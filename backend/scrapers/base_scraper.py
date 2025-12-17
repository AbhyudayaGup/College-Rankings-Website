"""
Base Scraper Class for College Rankings
"""

import requests
from abc import ABC, abstractmethod
from typing import List, Dict, Optional
import logging
from bs4 import BeautifulSoup
import time

logger = logging.getLogger(__name__)


class BaseScraper(ABC):
    """Base class for all ranking scrapers"""
    
    def __init__(self, source_name: str, source_code: str, region: str):
        self.source_name = source_name
        self.source_code = source_code
        self.region = region
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
        })
    
    @abstractmethod
    def scrape(self) -> List[Dict]:
        """
        Scrape rankings data
        Returns list of college rankings with structure:
        {
            'college_name': str,
            'country': str,
            'rank': int,
            'score': float (0-100),
            'url': str,
            'metrics': {
                'academic_reputation': float,
                'employer_reputation': float,
                'teaching_quality': float,
                'research_impact': float,
                'international_diversity': float,
            }
        }
        """
        pass
    
    def _fetch_page(self, url: str, timeout: int = 15) -> Optional[BeautifulSoup]:
        """Fetch and parse webpage"""
        try:
            response = self.session.get(url, timeout=timeout)
            response.raise_for_status()
            return BeautifulSoup(response.content, 'html.parser')
        except requests.exceptions.Timeout:
            logger.error(f"Timeout fetching {url}")
            return None
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching {url}: {str(e)}")
            return None
    
    def _normalize_score(self, score) -> Optional[float]:
        """Normalize score to 0-100 scale"""
        if score is None:
            return None
        try:
            # Remove any non-numeric characters except decimal point
            if isinstance(score, str):
                score = ''.join(c for c in score if c.isdigit() or c == '.')
            score_float = float(score)
            return min(100, max(0, score_float))
        except (ValueError, TypeError):
            return None
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ""
        return ' '.join(text.split()).strip()
    
    def _rate_limit(self, seconds: float = 2.0):
        """Apply rate limiting between requests"""
        time.sleep(seconds)
