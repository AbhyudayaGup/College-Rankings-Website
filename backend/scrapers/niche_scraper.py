"""
Niche College Rankings Scraper
"""

from typing import List, Dict, Optional
import logging
from .base_scraper import BaseScraper

logger = logging.getLogger(__name__)


class NicheScraper(BaseScraper):
    """Scraper for Niche Rankings"""
    
    def __init__(self):
        super().__init__(
            "Niche College Rankings",
            "niche",
            "AMERICAN"
        )
        self.url = "https://www.niche.com/colleges/search/best-colleges/"
    
    def scrape(self) -> List[Dict]:
        """Scrape Niche rankings"""
        colleges = []
        
        try:
            soup = self._fetch_page(self.url)
            if not soup:
                return colleges
            
            # Try multiple selectors for Niche layout
            results = (
                soup.find_all('div', class_='search-result') or
                soup.find_all('li', class_='search-result') or
                soup.find_all('article', class_='search-result')
            )
            
            for idx, result in enumerate(results[:100], 1):
                try:
                    name_elem = (
                        result.find('h2', class_='search-result__title') or
                        result.find('a', class_='search-result__link') or
                        result.find('h2') or
                        result.find('a')
                    )
                    
                    grade_elem = (
                        result.find('div', class_='niche__grade') or
                        result.find('span', class_='search-result-grade') or
                        result.find('div', class_='overall-grade')
                    )
                    
                    if name_elem:
                        name = self._clean_text(name_elem.get_text())
                        
                        college_data = {
                            'college_name': name,
                            'country': 'USA',
                            'rank': idx,
                            'score': self._extract_niche_grade(grade_elem),
                            'url': name_elem.get('href', '') if name_elem.name == 'a' else (result.find('a') or {}).get('href', ''),
                            'metrics': {}
                        }
                        colleges.append(college_data)
                except Exception as e:
                    logger.warning(f"Error parsing Niche result: {str(e)}")
                    continue
        
        except Exception as e:
            logger.error(f"Niche scraper error: {str(e)}")
        
        logger.info(f"Niche Scraper: Found {len(colleges)} colleges")
        return colleges
    
    def _extract_niche_grade(self, elem) -> Optional[float]:
        """Convert Niche letter grade to numeric score"""
        if not elem:
            return None
        
        grade = self._clean_text(elem.get_text()).upper()
        
        # Map letter grades to numeric scores
        grade_map = {
            'A+': 98, 'A': 95, 'A-': 92,
            'B+': 88, 'B': 85, 'B-': 82,
            'C+': 78, 'C': 75, 'C-': 72,
            'D+': 68, 'D': 65, 'D-': 62,
            'F': 50
        }
        
        # Handle grades that might have extra text
        for g, score in grade_map.items():
            if g in grade:
                return float(score)
        
        return None
