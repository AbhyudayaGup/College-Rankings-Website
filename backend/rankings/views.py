"""
Django REST API Views
"""

from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q, Avg, F
from django.shortcuts import get_object_or_404

from .models import College, CollegeRanking, RankingSource, RankingCategory
from .serializers import (
    CollegeSerializer, 
    CollegeDetailSerializer,
    CollegeRankingSerializer,
    RankingSourceSerializer,
    CompositeRankingSerializer
)
import logging

logger = logging.getLogger(__name__)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100


class CollegeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoints for College data
    """
    queryset = College.objects.all().prefetch_related('collegeranking_set')
    serializer_class = CollegeSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'country', 'city']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CollegeDetailSerializer
        return CollegeSerializer
    
    @action(detail=True, methods=['get'])
    def rankings_breakdown(self, request, pk=None):
        """
        Get detailed breakdown of college rankings across all sources
        GET /api/colleges/{id}/rankings_breakdown/
        """
        college = self.get_object()
        rankings = college.collegeranking_set.all().select_related('source')
        
        breakdown = {
            'college': CollegeSerializer(college).data,
            'international_rankings': [],
            'american_rankings': [],
            'composite_scores': {
                'international': college.composite_score_international,
                'american': college.composite_score_american,
            },
            'all_rankings': CollegeRankingSerializer(rankings, many=True).data,
        }
        
        # Separate by region
        for ranking in rankings:
            data = CollegeRankingSerializer(ranking).data
            if ranking.source.region == 'INTERNATIONAL':
                breakdown['international_rankings'].append(data)
            else:
                breakdown['american_rankings'].append(data)
        
        return Response(breakdown)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Search colleges by name, country
        GET /api/colleges/search/?q=harvard
        """
        query = request.query_params.get('q', '')
        country = request.query_params.get('country', '')
        ranking_source = request.query_params.get('source', '')
        
        queryset = self.queryset
        
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) |
                Q(city__icontains=query)
            )
        
        if country:
            queryset = queryset.filter(country__icontains=country)
        
        if ranking_source:
            queryset = queryset.filter(
                collegeranking__source__code=ranking_source
            ).distinct()
        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class CompositeRankingViewSet(viewsets.ViewSet):
    """
    Composite rankings calculated from multiple sources
    """
    
    @action(detail=False, methods=['get'])
    def international(self, request):
        """
        Get international composite rankings (average of 5 sources)
        GET /api/composite-rankings/international/
        """
        colleges = College.objects.annotate(
            avg_score=Avg(
                'collegeranking__score',
                filter=Q(collegeranking__source__region='INTERNATIONAL')
            )
        ).filter(avg_score__isnull=False).order_by('-avg_score')
        
        page = StandardResultsSetPagination()
        paginated = page.paginate_queryset(colleges, request)
        
        serializer = CompositeRankingSerializer(
            paginated, 
            many=True, 
            context={'region': 'INTERNATIONAL'}
        )
        return page.get_paginated_response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def american(self, request):
        """
        Get American composite rankings (average of 5 sources)
        GET /api/composite-rankings/american/
        """
        colleges = College.objects.annotate(
            avg_score=Avg(
                'collegeranking__score',
                filter=Q(collegeranking__source__region='AMERICAN')
            )
        ).filter(avg_score__isnull=False).order_by('-avg_score')
        
        page = StandardResultsSetPagination()
        paginated = page.paginate_queryset(colleges, request)
        
        serializer = CompositeRankingSerializer(
            paginated, 
            many=True, 
            context={'region': 'AMERICAN'}
        )
        return page.get_paginated_response(serializer.data)


class RankingSourceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API for ranking sources metadata
    """
    queryset = RankingSource.objects.all()
    serializer_class = RankingSourceSerializer
    filter_backends = [filters.OrderingFilter]
    ordering = ['region', 'name']


class CollegeRankingViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API for individual college rankings
    """
    queryset = CollegeRanking.objects.select_related('college', 'source')
    serializer_class = CollegeRankingSerializer
    pagination_class = StandardResultsSetPagination
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['rank', 'score']
    ordering = ['rank']
    
    @action(detail=False, methods=['get'])
    def by_source(self, request):
        """
        Get rankings for a specific source
        GET /api/rankings/by_source/?source=qs&page_size=100
        """
        source_code = request.query_params.get('source', '')
        
        if not source_code:
            return Response(
                {'error': 'source parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        source = get_object_or_404(RankingSource, code=source_code)
        rankings = self.queryset.filter(source=source).order_by('rank')
        
        page = self.paginate_queryset(rankings)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response_data = self.get_paginated_response(serializer.data)
            response_data.data['source'] = RankingSourceSerializer(source).data
            return response_data
        
        serializer = self.get_serializer(rankings, many=True)
        return Response({
            'source': RankingSourceSerializer(source).data,
            'results': serializer.data
        })
    
    @action(detail=False, methods=['get'])
    def all_sources(self, request):
        """
        Get list of all available ranking sources
        GET /api/rankings/all_sources/
        """
        sources = RankingSource.objects.all().order_by('region', 'name')
        return Response(RankingSourceSerializer(sources, many=True).data)


class ComparisonViewSet(viewsets.ViewSet):
    """
    Compare colleges side-by-side
    """
    
    @action(detail=False, methods=['get'])
    def compare(self, request):
        """
        Compare multiple colleges
        GET /api/comparison/compare/?ids=1,2,3
        """
        ids = request.query_params.get('ids', '')
        
        if not ids:
            return Response(
                {'error': 'ids parameter required (comma-separated)'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            college_ids = [int(id.strip()) for id in ids.split(',')]
        except ValueError:
            return Response(
                {'error': 'Invalid college IDs'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        colleges = College.objects.filter(id__in=college_ids).prefetch_related('collegeranking_set')
        
        comparison_data = []
        for college in colleges:
            rankings = college.collegeranking_set.all()
            comparison_data.append({
                'college': CollegeSerializer(college).data,
                'rankings': CollegeRankingSerializer(rankings, many=True).data,
                'composite_international': college.composite_score_international,
                'composite_american': college.composite_score_american,
            })
        
        return Response(comparison_data)


class StrengthsWeaknessesViewSet(viewsets.ViewSet):
    """
    Identify college strengths and weaknesses
    """
    
    @action(detail=False, methods=['get'])
    def analyze(self, request):
        """
        Analyze college strengths and weaknesses
        GET /api/analysis/analyze/?college_id=1
        """
        college_id = request.query_params.get('college_id')
        
        if not college_id:
            return Response(
                {'error': 'college_id parameter required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        college = get_object_or_404(College, id=college_id)
        rankings = college.collegeranking_set.all()
        
        # Aggregate metrics across all rankings
        avg_metrics = {}
        metric_fields = [
            'academic_reputation',
            'employer_reputation',
            'faculty_student_ratio',
            'research_impact',
            'international_diversity',
            'teaching_quality',
            'student_satisfaction'
        ]
        
        for field in metric_fields:
            values = [float(getattr(r, field)) for r in rankings if getattr(r, field) is not None]
            if values:
                avg_metrics[field] = round(sum(values) / len(values), 2)
        
        # Identify strengths (top 3 metrics) and weaknesses (bottom 3)
        sorted_metrics = sorted(avg_metrics.items(), key=lambda x: x[1], reverse=True)
        strengths = sorted_metrics[:3] if len(sorted_metrics) >= 3 else sorted_metrics
        weaknesses = sorted_metrics[-3:] if len(sorted_metrics) >= 3 else []
        
        return Response({
            'college': CollegeSerializer(college).data,
            'strengths': [{'metric': s[0], 'score': s[1]} for s in strengths],
            'weaknesses': [{'metric': w[0], 'score': w[1]} for w in weaknesses],
            'all_metrics': avg_metrics,
        })
