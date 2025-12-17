"""
Forbes Best Colleges Scraper
"""

from typing import List, Dict
import logging
from .base_scraper import BaseScraper

logger = logging.getLogger(__name__)


class ForbesScraper(BaseScraper):
    """Scraper for Forbes Best Colleges Rankings"""
    
    def __init__(self):
        super().__init__(
            "Forbes Best Colleges",
            "forbes",
            "AMERICAN"
        )
        self.url = "https://www.forbes.com/top-colleges/"
    
    def scrape(self) -> List[Dict]:
        """Scrape Forbes rankings"""
        colleges = []
        
        try:
            soup = self._fetch_page(self.url)
            if not soup:
                return colleges
            
            # Try multiple selectors for Forbes layout
            college_entries = (
                soup.find_all('div', class_='college-entry') or
                soup.find_all('tr', class_='table-row') or
                soup.find_all('article', class_='list-item')
            )
            
            # Fallback to table parsing
            if not college_entries:
                table = soup.find('table')
                if table:
                    college_entries = table.find_all('tr')[1:]  # Skip header
            
            for idx, entry in enumerate(college_entries[:100], 1):
                try:
                    # Try different element structures
                    name_elem = (
                        entry.find('h3') or 
                        entry.find('a', class_='name') or
                        entry.find('td', class_='name') or
                        entry.find('a')
                    )
                    
                    score_elem = (
                        entry.find('span', class_='score') or
                        entry.find('td', class_='score')
                    )
                    
                    rank_elem = (
                        entry.find('span', class_='rank') or
                        entry.find('td', class_='rank')
                    )
                    
                    if name_elem:
                        name = self._clean_text(name_elem.get_text())
                        
                        # Get rank
                        rank = idx
                        if rank_elem:
                            rank_text = self._clean_text(rank_elem.get_text())
                            rank_text = rank_text.replace('#', '').replace('.', '')
                            if rank_text.isdigit():
                                rank = int(rank_text)
                        
                        college_data = {
                            'college_name': name,
                            'country': 'USA',
                            'rank': rank,
                            'score': self._normalize_score(score_elem.get_text() if score_elem else None),
                            'url': name_elem.get('href', '') if name_elem.name == 'a' else (entry.find('a') or {}).get('href', ''),
                            'metrics': {}
                        }
                        colleges.append(college_data)
                except Exception as e:
                    logger.warning(f"Error parsing Forbes entry: {str(e)}")
                    continue
        
        except Exception as e:
            logger.error(f"Forbes scraper error: {str(e)}")
        
        logger.info(f"Forbes Scraper: Found {len(colleges)} colleges")
        return colleges
