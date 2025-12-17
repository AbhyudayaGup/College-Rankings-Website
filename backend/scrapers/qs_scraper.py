"""
QS World University Rankings Scraper
"""

from typing import List, Dict, Optional
import logging
from .base_scraper import BaseScraper

logger = logging.getLogger(__name__)


class QSScraper(BaseScraper):
    """Scraper for QS World University Rankings"""
    
    def __init__(self):
        super().__init__(
            "QS World University Rankings",
            "qs",
            "INTERNATIONAL"
        )
        self.url = "https://www.topuniversities.com/university-rankings/world-university-rankings/2025"
    
    def scrape(self) -> List[Dict]:
        """Scrape QS rankings"""
        colleges = []
        page = 1
        
        try:
            while page <= 5:  # Get top 250 universities (50 per page)
                url = f"{self.url}?page={page}"
                soup = self._fetch_page(url)
                
                if not soup:
                    break
                
                # Parse ranking rows - adjust selectors based on actual HTML structure
                rankings = soup.find_all('tr', class_='ranking-row')
                
                # Alternative selectors if the above doesn't work
                if not rankings:
                    rankings = soup.find_all('div', class_='ranking-card')
                
                if not rankings:
                    # Try generic table rows
                    table = soup.find('table')
                    if table:
                        rankings = table.find_all('tr')[1:]  # Skip header
                
                if not rankings:
                    break
                
                for ranking in rankings:
                    try:
                        college_data = self._parse_ranking_row(ranking)
                        if college_data:
                            colleges.append(college_data)
                    except Exception as e:
                        logger.warning(f"Error parsing QS ranking row: {str(e)}")
                        continue
                
                page += 1
                self._rate_limit(2)  # Rate limiting
        
        except Exception as e:
            logger.error(f"QS scraper error: {str(e)}")
        
        logger.info(f"QS Scraper: Found {len(colleges)} colleges")
        return colleges
    
    def _parse_ranking_row(self, elem) -> Optional[Dict]:
        """Parse a single ranking row"""
        rank_elem = (
            elem.find('span', class_='ranking-rank') or 
            elem.find('td', class_='rank') or
            elem.find('div', class_='rank')
        )
        
        name_elem = (
            elem.find('a', class_='ranking-link') or 
            elem.find('a', class_='uni-link') or
            elem.find('h2') or
            elem.find('a')
        )
        
        score_elem = (
            elem.find('span', class_='ranking-score') or
            elem.find('td', class_='score') or
            elem.find('div', class_='score')
        )
        
        if not (rank_elem and name_elem):
            return None
        
        rank_text = self._clean_text(rank_elem.get_text())
        # Handle ranges like "101-110"
        if '-' in rank_text:
            rank_text = rank_text.split('-')[0]
        
        try:
            rank = int(''.join(c for c in rank_text if c.isdigit())) if rank_text else 999
        except ValueError:
            rank = 999
        
        return {
            'college_name': self._clean_text(name_elem.get_text()),
            'country': self._extract_country(elem),
            'rank': rank,
            'score': self._normalize_score(score_elem.get_text() if score_elem else None),
            'url': name_elem.get('href', ''),
            'metrics': {
                'academic_reputation': self._extract_metric(elem, 'AR'),
                'employer_reputation': self._extract_metric(elem, 'ER'),
                'faculty_student_ratio': self._extract_metric(elem, 'FSR'),
                'international_diversity': self._extract_metric(elem, 'ID'),
            }
        }
    
    def _extract_country(self, elem) -> str:
        """Extract country from element"""
        country_elem = (
            elem.find('span', class_='country') or
            elem.find('div', class_='location') or
            elem.find('span', class_='location')
        )
        return self._clean_text(country_elem.get_text()) if country_elem else "Unknown"
    
    def _extract_metric(self, elem, metric_code: str) -> Optional[float]:
        """Extract specific metric from ranking row"""
        metric_elem = elem.find('span', class_=f'metric-{metric_code}')
        if not metric_elem:
            metric_elem = elem.find('td', {'data-metric': metric_code})
        
        if metric_elem:
            return self._normalize_score(metric_elem.get_text())
        return None
