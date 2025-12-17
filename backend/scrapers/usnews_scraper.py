"""
US News Best Colleges Scraper
"""

from typing import List, Dict
import logging
from .base_scraper import BaseScraper

logger = logging.getLogger(__name__)


class USNewsScraper(BaseScraper):
    """Scraper for US News Best Colleges Rankings"""
    
    def __init__(self):
        super().__init__(
            "US News Best Colleges",
            "usnews",
            "AMERICAN"
        )
        self.url = "https://www.usnews.com/best-colleges/rankings/national-universities"
    
    def scrape(self) -> List[Dict]:
        """Scrape US News rankings"""
        colleges = []
        
        try:
            soup = self._fetch_page(self.url)
            if not soup:
                return colleges
            
            # US News uses JavaScript-rendered content
            # Try multiple selectors
            ranking_cards = (
                soup.find_all('div', class_='RankList__ListItem') or
                soup.find_all('div', class_='RankingCard') or
                soup.find_all('li', class_='UnorderedListStyled')
            )
            
            if not ranking_cards:
                # Try finding from JSON-LD structured data
                scripts = soup.find_all('script', type='application/ld+json')
                for script in scripts:
                    # Parse JSON data if available
                    pass
            
            for idx, card in enumerate(ranking_cards[:100], 1):
                try:
                    name_elem = (
                        card.find('a', class_='Heading') or
                        card.find('h3') or
                        card.find('a')
                    )
                    
                    score_elem = card.find('span', class_='RankList__Score')
                    rank_elem = card.find('span', class_='RankList__Rank')
                    
                    if name_elem:
                        name = self._clean_text(name_elem.get_text())
                        
                        # Get rank from element or use index
                        rank = idx
                        if rank_elem:
                            rank_text = self._clean_text(rank_elem.get_text())
                            rank_text = rank_text.replace('#', '')
                            if rank_text.isdigit():
                                rank = int(rank_text)
                        
                        college_data = {
                            'college_name': name,
                            'country': 'USA',
                            'rank': rank,
                            'score': self._normalize_score(score_elem.get_text() if score_elem else None),
                            'url': name_elem.get('href', ''),
                            'metrics': {}
                        }
                        colleges.append(college_data)
                except Exception as e:
                    logger.warning(f"Error parsing US News card: {str(e)}")
                    continue
        
        except Exception as e:
            logger.error(f"US News scraper error: {str(e)}")
        
        logger.info(f"US News Scraper: Found {len(colleges)} colleges")
        return colleges
