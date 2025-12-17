"""
Django Models for College Rankings
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator


class RankingSource(models.Model):
    """Represents a ranking system (QS, THE, ARWU, etc.)"""
    REGION_CHOICES = [
        ('INTERNATIONAL', 'International'),
        ('AMERICAN', 'American'),
    ]
    
    name = models.CharField(max_length=100, unique=True)  # e.g., "QS World Ranking"
    code = models.CharField(max_length=20, unique=True)   # e.g., "qs"
    region = models.CharField(max_length=20, choices=REGION_CHOICES)
    description = models.TextField(blank=True)
    website_url = models.URLField()
    last_updated = models.DateTimeField(auto_now=True)
    update_frequency_hours = models.IntegerField(default=24)
    
    class Meta:
        ordering = ['region', 'name']
    
    def __str__(self):
        return f"{self.name} ({self.region})"


class College(models.Model):
    """Core college/university model"""
    name = models.CharField(max_length=200, unique=True)
    country = models.CharField(max_length=100)
    city = models.CharField(max_length=100, blank=True)
    established_year = models.IntegerField(null=True, blank=True)
    website_url = models.URLField(blank=True)
    description = models.TextField(blank=True)
    logo_url = models.URLField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['name']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['country']),
        ]
    
    def __str__(self):
        return self.name
    
    @property
    def composite_score_international(self):
        """Calculate average score from international rankings"""
        rankings = self.collegeranking_set.filter(
            source__region='INTERNATIONAL'
        ).exclude(score__isnull=True)
        
        if rankings.exists():
            avg = rankings.aggregate(
                avg_score=models.Avg('score')
            )['avg_score']
            return round(avg, 2) if avg else None
        return None
    
    @property
    def composite_score_american(self):
        """Calculate average score from American rankings"""
        rankings = self.collegeranking_set.filter(
            source__region='AMERICAN'
        ).exclude(score__isnull=True)
        
        if rankings.exists():
            avg = rankings.aggregate(
                avg_score=models.Avg('score')
            )['avg_score']
            return round(avg, 2) if avg else None
        return None


class CollegeRanking(models.Model):
    """Individual ranking entry for a college in a ranking system"""
    college = models.ForeignKey(College, on_delete=models.CASCADE)
    source = models.ForeignKey(RankingSource, on_delete=models.CASCADE)
    
    rank = models.IntegerField(validators=[MinValueValidator(1)])
    score = models.DecimalField(
        max_digits=5, decimal_places=2,
        null=True, blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)]
    )
    
    # Breakdown of performance
    overall_score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    academic_reputation = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    employer_reputation = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    faculty_student_ratio = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    research_impact = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    international_diversity = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    teaching_quality = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    student_satisfaction = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # Additional metadata
    ranking_year = models.IntegerField()
    data_source_url = models.URLField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('college', 'source', 'ranking_year')
        ordering = ['rank']
        indexes = [
            models.Index(fields=['college', 'source']),
            models.Index(fields=['ranking_year']),
            models.Index(fields=['rank']),
        ]
    
    def __str__(self):
        return f"{self.college.name} - {self.source.code} - Rank #{self.rank}"


class RankingCategory(models.Model):
    """Performance categories for detailed breakdowns"""
    CATEGORY_TYPES = [
        ('ACADEMIC', 'Academic Excellence'),
        ('RESEARCH', 'Research & Innovation'),
        ('EMPLOYMENT', 'Employment Outcomes'),
        ('STUDENT_LIFE', 'Student Life'),
        ('DIVERSITY', 'Diversity & Inclusion'),
        ('INTERNATIONAL', 'International Presence'),
        ('INFRASTRUCTURE', 'Infrastructure & Facilities'),
        ('AFFORDABILITY', 'Affordability'),
    ]
    
    college_ranking = models.ForeignKey(
        CollegeRanking,
        on_delete=models.CASCADE,
        related_name='categories'
    )
    category_type = models.CharField(max_length=20, choices=CATEGORY_TYPES)
    strength_level = models.CharField(
        max_length=20,
        choices=[
            ('EXCEPTIONAL', 'Exceptional'),
            ('STRONG', 'Strong'),
            ('AVERAGE', 'Average'),
            ('WEAK', 'Weak'),
        ]
    )
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    description = models.TextField(blank=True)
    
    class Meta:
        unique_together = ('college_ranking', 'category_type')
    
    def __str__(self):
        return f"{self.college_ranking.college.name} - {self.get_category_type_display()}"


class CacheMetadata(models.Model):
    """Track data cache status"""
    source = models.OneToOneField(RankingSource, on_delete=models.CASCADE)
    last_fetch_time = models.DateTimeField(null=True, blank=True)
    last_successful_fetch = models.DateTimeField(null=True, blank=True)
    fetch_status = models.CharField(
        max_length=20,
        choices=[
            ('SUCCESS', 'Successful'),
            ('FAILED', 'Failed'),
            ('PENDING', 'Pending'),
        ],
        default='PENDING'
    )
    error_message = models.TextField(blank=True)
    colleges_fetched = models.IntegerField(default=0)
    
    def __str__(self):
        return f"Cache: {self.source.name}"
