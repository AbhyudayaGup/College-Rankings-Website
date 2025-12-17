# Scrapers package
from .base_scraper import BaseScraper
from .qs_scraper import QSScraper
from .arwu_scraper import ARWUScraper
from .usnews_scraper import USNewsScraper
from .forbes_scraper import ForbesScraper
from .niche_scraper import NicheScraper

__all__ = [
    'BaseScraper',
    'QSScraper',
    'ARWUScraper',
    'USNewsScraper',
    'ForbesScraper',
    'NicheScraper',
]
