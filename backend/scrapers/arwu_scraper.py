"""
ARWU (Shanghai Ranking) Scraper
"""

from typing import List, Dict
import logging
from .base_scraper import BaseScraper

logger = logging.getLogger(__name__)


class ARWUScraper(BaseScraper):
    """Scraper for ARWU (Shanghai Ranking)"""
    
    def __init__(self):
        super().__init__(
            "Academic Ranking of World Universities",
            "arwu",
            "INTERNATIONAL"
        )
        self.url = "https://www.shanghairanking.com/rankings/arwu/2024"
    
    def scrape(self) -> List[Dict]:
        """Scrape ARWU rankings"""
        colleges = []
        
        try:
            soup = self._fetch_page(self.url)
            if not soup:
                return colleges
            
            # Parse ARWU table
            table = soup.find('table', class_='ranking-table')
            if not table:
                table = soup.find('table', class_='rk-table')
            if not table:
                table = soup.find('table')
            
            if table:
                rows = table.find_all('tr')[1:]  # Skip header
                
                for row in rows[:500]:  # Top 500
                    try:
                        cells = row.find_all('td')
                        if len(cells) >= 3:
                            rank_text = self._clean_text(cells[0].get_text())
                            name = self._clean_text(cells[1].get_text())
                            
                            # Handle score
                            score_text = self._clean_text(cells[2].get_text()) if len(cells) > 2 else None
                            
                            # Handle country
                            country = "Unknown"
                            if len(cells) > 3:
                                country = self._clean_text(cells[3].get_text())
                            else:
                                # Try to find country from flag or other element
                                img = row.find('img', class_='flag')
                                if img:
                                    country = img.get('alt', 'Unknown')
                            
                            # Parse rank
                            if '-' in rank_text:
                                rank_text = rank_text.split('-')[0]
                            try:
                                rank = int(''.join(c for c in rank_text if c.isdigit()))
                            except ValueError:
                                rank = 999
                            
                            # Get URL
                            link = row.find('a')
                            url = link.get('href', '') if link else ''
                            
                            college_data = {
                                'college_name': name,
                                'country': country,
                                'rank': rank,
                                'score': self._normalize_score(score_text),
                                'url': url,
                                'metrics': {
                                    'research_impact': self._normalize_score(score_text),
                                }
                            }
                            colleges.append(college_data)
                    except Exception as e:
                        logger.warning(f"Error parsing ARWU row: {str(e)}")
                        continue
        
        except Exception as e:
            logger.error(f"ARWU scraper error: {str(e)}")
        
        logger.info(f"ARWU Scraper: Found {len(colleges)} colleges")
        return colleges
