"""
Django REST Serializers
"""

from rest_framework import serializers
from .models import College, CollegeRanking, RankingSource, RankingCategory, CacheMetadata


class RankingSourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RankingSource
        fields = ['id', 'name', 'code', 'region', 'website_url', 'last_updated']


class RankingCategorySerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_type_display', read_only=True)
    
    class Meta:
        model = RankingCategory
        fields = ['id', 'category_type', 'category_display', 'strength_level', 'score', 'description']


class CollegeRankingSerializer(serializers.ModelSerializer):
    source = RankingSourceSerializer(read_only=True)
    source_code = serializers.CharField(source='source.code', read_only=True)
    college = serializers.SerializerMethodField()
    
    class Meta:
        model = CollegeRanking
        fields = [
            'id', 'college', 'source', 'source_code', 'rank', 'score', 'ranking_year',
            'academic_reputation', 'employer_reputation', 'faculty_student_ratio',
            'research_impact', 'international_diversity', 'teaching_quality'
        ]
    
    def get_college(self, obj):
        from .serializers import CollegeSerializer
        return CollegeSerializer(obj.college).data if obj.college else None


class CollegeSerializer(serializers.ModelSerializer):
    class Meta:
        model = College
        fields = ['id', 'name', 'country', 'city', 'established_year', 'logo_url']


class CollegeDetailSerializer(serializers.ModelSerializer):
    rankings = serializers.SerializerMethodField()
    composite_score_international = serializers.ReadOnlyField()
    composite_score_american = serializers.ReadOnlyField()
    
    class Meta:
        model = College
        fields = [
            'id', 'name', 'country', 'city', 'established_year',
            'website_url', 'description', 'logo_url', 'rankings',
            'composite_score_international', 'composite_score_american'
        ]
    
    def get_rankings(self, obj):
        rankings = obj.collegeranking_set.all().select_related('source')
        return CollegeRankingSerializer(rankings, many=True).data


class CompositeRankingSerializer(serializers.Serializer):
    college = CollegeSerializer(read_only=True)
    composite_score = serializers.SerializerMethodField()
    region = serializers.SerializerMethodField()
    rankings_count = serializers.SerializerMethodField()
    
    def get_composite_score(self, obj):
        from django.db.models import Avg
        # Get the annotated avg_score if available, otherwise calculate
        if hasattr(obj, 'avg_score') and obj.avg_score is not None:
            return round(float(obj.avg_score), 2)
        return None
    
    def get_region(self, obj):
        return self.context.get('region', 'INTERNATIONAL')
    
    def get_rankings_count(self, obj):
        region = self.context.get('region', 'INTERNATIONAL')
        return obj.collegeranking_set.filter(source__region=region).count()
    
    def to_representation(self, instance):
        """Custom representation to include college data"""
        data = {
            'college': CollegeSerializer(instance).data,
            'composite_score': self.get_composite_score(instance),
            'region': self.get_region(instance),
            'rankings_count': self.get_rankings_count(instance),
        }
        return data


class CacheMetadataSerializer(serializers.ModelSerializer):
    source_name = serializers.CharField(source='source.name', read_only=True)
    
    class Meta:
        model = CacheMetadata
        fields = ['id', 'source_name', 'last_fetch_time', 'last_successful_fetch', 
                  'fetch_status', 'error_message', 'colleges_fetched']
