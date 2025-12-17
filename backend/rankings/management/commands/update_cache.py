"""
Management Command to Update Cache Status
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from rankings.models import RankingSource, CacheMetadata
from datetime import timedelta


class Command(BaseCommand):
    help = 'Check and update cache status for ranking sources'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--status',
            action='store_true',
            help='Show current cache status for all sources',
        )
        parser.add_argument(
            '--stale',
            action='store_true',
            help='List sources with stale cache (older than update frequency)',
        )
    
    def handle(self, *args, **options):
        show_status = options.get('status', False)
        show_stale = options.get('stale', False)
        
        if show_status or not show_stale:
            self._show_status()
        
        if show_stale:
            self._show_stale()
    
    def _show_status(self):
        """Display current cache status"""
        self.stdout.write("\n" + "="*70)
        self.stdout.write("CACHE STATUS")
        self.stdout.write("="*70)
        
        sources = RankingSource.objects.all()
        
        for source in sources:
            try:
                cache = CacheMetadata.objects.get(source=source)
                status_color = {
                    'SUCCESS': self.style.SUCCESS,
                    'FAILED': self.style.ERROR,
                    'PENDING': self.style.WARNING,
                }.get(cache.fetch_status, self.style.NOTICE)
                
                last_fetch = cache.last_successful_fetch
                if last_fetch:
                    age = timezone.now() - last_fetch
                    age_str = f"{age.days}d {age.seconds//3600}h ago"
                else:
                    age_str = "Never"
                
                self.stdout.write(
                    f"\n{source.name} ({source.code})"
                )
                self.stdout.write(
                    f"  Status: {status_color(cache.fetch_status)}"
                )
                self.stdout.write(f"  Last Fetch: {age_str}")
                self.stdout.write(f"  Colleges Fetched: {cache.colleges_fetched}")
                
                if cache.error_message:
                    self.stdout.write(
                        self.style.ERROR(f"  Error: {cache.error_message[:100]}")
                    )
            
            except CacheMetadata.DoesNotExist:
                self.stdout.write(
                    f"\n{source.name} ({source.code})"
                )
                self.stdout.write(
                    self.style.WARNING("  No cache data")
                )
        
        self.stdout.write("\n" + "="*70)
    
    def _show_stale(self):
        """Show sources with stale cache"""
        self.stdout.write("\nSOURCES NEEDING UPDATE:")
        self.stdout.write("-"*40)
        
        stale_sources = []
        
        for source in RankingSource.objects.all():
            try:
                cache = CacheMetadata.objects.get(source=source)
                
                if not cache.last_successful_fetch:
                    stale_sources.append((source.code, "Never fetched"))
                    continue
                
                age = timezone.now() - cache.last_successful_fetch
                threshold = timedelta(hours=source.update_frequency_hours)
                
                if age > threshold:
                    stale_sources.append(
                        (source.code, f"Last fetch {age.days}d {age.seconds//3600}h ago")
                    )
            
            except CacheMetadata.DoesNotExist:
                stale_sources.append((source.code, "No cache data"))
        
        if stale_sources:
            for code, reason in stale_sources:
                self.stdout.write(self.style.WARNING(f"  {code}: {reason}"))
            
            self.stdout.write("\nRun the following to update:")
            self.stdout.write(self.style.NOTICE(
                f"  python manage.py fetch_rankings --source {stale_sources[0][0]}"
            ))
            self.stdout.write("Or update all sources:")
            self.stdout.write(self.style.NOTICE(
                "  python manage.py fetch_rankings --all"
            ))
        else:
            self.stdout.write(self.style.SUCCESS("  All caches are up to date!"))
