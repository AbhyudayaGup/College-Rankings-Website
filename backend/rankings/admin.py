from django.contrib import admin
from .models import College, CollegeRanking, RankingSource, RankingCategory, CacheMetadata


@admin.register(RankingSource)
class RankingSourceAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'region', 'last_updated']
    list_filter = ['region']
    search_fields = ['name', 'code']


@admin.register(College)
class CollegeAdmin(admin.ModelAdmin):
    list_display = ['name', 'country', 'city', 'established_year']
    list_filter = ['country']
    search_fields = ['name', 'country', 'city']
    ordering = ['name']


@admin.register(CollegeRanking)
class CollegeRankingAdmin(admin.ModelAdmin):
    list_display = ['college', 'source', 'rank', 'score', 'ranking_year']
    list_filter = ['source', 'ranking_year']
    search_fields = ['college__name']
    ordering = ['rank']
    raw_id_fields = ['college', 'source']


@admin.register(RankingCategory)
class RankingCategoryAdmin(admin.ModelAdmin):
    list_display = ['college_ranking', 'category_type', 'strength_level', 'score']
    list_filter = ['category_type', 'strength_level']


@admin.register(CacheMetadata)
class CacheMetadataAdmin(admin.ModelAdmin):
    list_display = ['source', 'fetch_status', 'last_fetch_time', 'colleges_fetched']
    list_filter = ['fetch_status']
