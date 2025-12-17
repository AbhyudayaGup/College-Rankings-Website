"""
Management Command to Fetch Rankings Data
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from rankings.models import College, CollegeRanking, RankingSource, CacheMetadata
from scrapers import QSScraper, ARWUScraper, USNewsScraper, ForbesScraper, NicheScraper
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Fetch college rankings from various sources'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--source',
            type=str,
            help='Specific source to update (e.g., qs, arwu, usnews, forbes, niche)',
        )
        parser.add_argument(
            '--all',
            action='store_true',
            help='Update all sources',
        )
        parser.add_argument(
            '--init-only',
            action='store_true',
            help='Only initialize ranking sources without fetching data',
        )
    
    def handle(self, *args, **options):
        source_filter = options.get('source')
        update_all = options.get('all', False)
        init_only = options.get('init_only', False)
        
        # Initialize ranking sources if not exist
        self._init_sources()
        
        if init_only:
            return
        
        scrapers = {
            'qs': QSScraper(),
            'arwu': ARWUScraper(),
            'usnews': USNewsScraper(),
            'forbes': ForbesScraper(),
            'niche': NicheScraper(),
        }
        
        if source_filter:
            if source_filter not in scrapers:
                self.stdout.write(
                    self.style.ERROR(f'Unknown source: {source_filter}. Available: {", ".join(scrapers.keys())}')
                )
                return
            scrapers = {source_filter: scrapers[source_filter]}
        elif not update_all:
            self.stdout.write(
                self.style.WARNING('Please specify --source <name> or --all to fetch rankings')
            )
            return
        
        for source_code, scraper in scrapers.items():
            self.stdout.write(f"\n{'='*50}")
            self.stdout.write(f"Fetching {source_code.upper()} rankings...")
            self._fetch_from_scraper(scraper, source_code)
        
        self.stdout.write(f"\n{'='*50}")
        self.stdout.write(self.style.SUCCESS('✓ Rankings fetch complete!'))
    
    def _init_sources(self):
        """Initialize ranking source records"""
        sources = [
            {
                'name': 'QS World University Rankings',
                'code': 'qs',
                'region': 'INTERNATIONAL',
                'website_url': 'https://www.topuniversities.com',
                'description': 'QS World University Rankings is an annual publication of university rankings by Quacquarelli Symonds.',
            },
            {
                'name': 'Academic Ranking of World Universities',
                'code': 'arwu',
                'region': 'INTERNATIONAL',
                'website_url': 'https://www.shanghairanking.com',
                'description': 'Also known as Shanghai Ranking, focuses on research output and academic excellence.',
            },
            {
                'name': 'Times Higher Education World Ranking',
                'code': 'the',
                'region': 'INTERNATIONAL',
                'website_url': 'https://www.timeshighereducation.com',
                'description': 'THE World University Rankings evaluate universities across teaching, research, and international outlook.',
            },
            {
                'name': 'Webometrics Ranking',
                'code': 'webometrics',
                'region': 'INTERNATIONAL',
                'website_url': 'https://www.webometrics.info',
                'description': 'Measures web presence and impact of universities worldwide.',
            },
            {
                'name': 'Leiden Ranking',
                'code': 'leiden',
                'region': 'INTERNATIONAL',
                'website_url': 'https://www.leidenranking.com',
                'description': 'Focuses on scientific performance of universities based on bibliometric indicators.',
            },
            {
                'name': 'US News Best Colleges',
                'code': 'usnews',
                'region': 'AMERICAN',
                'website_url': 'https://www.usnews.com',
                'description': 'Most widely recognized college ranking in the United States.',
            },
            {
                'name': 'Forbes Best Colleges',
                'code': 'forbes',
                'region': 'AMERICAN',
                'website_url': 'https://www.forbes.com',
                'description': 'Forbes ranking focuses on return on investment and student outcomes.',
            },
            {
                'name': 'Niche College Rankings',
                'code': 'niche',
                'region': 'AMERICAN',
                'website_url': 'https://www.niche.com',
                'description': 'Combines academic, admissions, and student life factors in rankings.',
            },
            {
                'name': 'Washington Monthly College Rankings',
                'code': 'washmonthly',
                'region': 'AMERICAN',
                'website_url': 'https://www.washingtonmonthly.com',
                'description': 'Focuses on social mobility, research, and public service.',
            },
            {
                'name': 'Wall Street Journal College Rankings',
                'code': 'wsj',
                'region': 'AMERICAN',
                'website_url': 'https://www.wsj.com',
                'description': 'Rankings based on student outcomes, resources, and engagement.',
            },
        ]
        
        created_count = 0
        for source_data in sources:
            _, created = RankingSource.objects.get_or_create(
                code=source_data['code'],
                defaults=source_data
            )
            if created:
                created_count += 1
        
        self.stdout.write(
            self.style.SUCCESS(f'✓ Ranking sources initialized ({created_count} new)')
        )
    
    def _fetch_from_scraper(self, scraper, source_code):
        """Fetch and store data from scraper"""
        try:
            source = RankingSource.objects.get(code=source_code)
            cache, _ = CacheMetadata.objects.get_or_create(source=source)
            
            self.stdout.write(f"  Scraping {source.name}...")
            rankings_data = scraper.scrape()
            
            if not rankings_data:
                cache.fetch_status = 'FAILED'
                cache.error_message = 'No data returned from scraper'
                cache.last_fetch_time = timezone.now()
                cache.save()
                self.stdout.write(self.style.WARNING(f'  ⚠ No data from {source.name}'))
                return
            
            # Store college and ranking data
            ranking_year = datetime.now().year
            colleges_created = 0
            rankings_created = 0
            rankings_updated = 0
            
            for ranking_data in rankings_data:
                try:
                    # Get or create college
                    college, created = College.objects.get_or_create(
                        name=ranking_data['college_name'],
                        defaults={
                            'country': ranking_data.get('country', 'Unknown'),
                            'website_url': ranking_data.get('url', ''),
                        }
                    )
                    
                    if created:
                        colleges_created += 1
                    
                    # Create or update ranking entry
                    college_ranking, ranking_created = CollegeRanking.objects.update_or_create(
                        college=college,
                        source=source,
                        ranking_year=ranking_year,
                        defaults={
                            'rank': ranking_data.get('rank', 999),
                            'score': ranking_data.get('score'),
                            'data_source_url': ranking_data.get('url', ''),
                        }
                    )
                    
                    # Update metrics if available
                    metrics = ranking_data.get('metrics', {})
                    updated = False
                    if metrics.get('academic_reputation'):
                        college_ranking.academic_reputation = metrics['academic_reputation']
                        updated = True
                    if metrics.get('employer_reputation'):
                        college_ranking.employer_reputation = metrics['employer_reputation']
                        updated = True
                    if metrics.get('research_impact'):
                        college_ranking.research_impact = metrics['research_impact']
                        updated = True
                    if metrics.get('international_diversity'):
                        college_ranking.international_diversity = metrics['international_diversity']
                        updated = True
                    if metrics.get('faculty_student_ratio'):
                        college_ranking.faculty_student_ratio = metrics['faculty_student_ratio']
                        updated = True
                    
                    if updated:
                        college_ranking.save()
                    
                    if ranking_created:
                        rankings_created += 1
                    else:
                        rankings_updated += 1
                
                except Exception as e:
                    logger.error(f"Error saving ranking: {str(e)}")
                    continue
            
            # Update cache metadata
            cache.last_fetch_time = timezone.now()
            cache.last_successful_fetch = timezone.now()
            cache.fetch_status = 'SUCCESS'
            cache.colleges_fetched = len(rankings_data)
            cache.error_message = ''
            cache.save()
            
            self.stdout.write(self.style.SUCCESS(
                f'  ✓ {source.name}: {colleges_created} new colleges, '
                f'{rankings_created} new rankings, {rankings_updated} updated'
            ))
        
        except RankingSource.DoesNotExist:
            self.stdout.write(self.style.ERROR(f'  ✗ Source not found: {source_code}'))
        except Exception as e:
            logger.error(f"Scraper error for {source_code}: {str(e)}")
            self.stdout.write(self.style.ERROR(f'  ✗ Error: {str(e)}'))
            
            try:
                cache.fetch_status = 'FAILED'
                cache.error_message = str(e)
                cache.last_fetch_time = timezone.now()
                cache.save()
            except:
                pass
