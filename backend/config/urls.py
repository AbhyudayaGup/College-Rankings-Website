"""
URL configuration for college-rankings-backend project.
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rankings.views import (
    CollegeViewSet,
    CollegeRankingViewSet,
    RankingSourceViewSet,
    CompositeRankingViewSet,
    ComparisonViewSet,
    StrengthsWeaknessesViewSet,
)

router = DefaultRouter()
router.register(r'colleges', CollegeViewSet, basename='college')
router.register(r'rankings', CollegeRankingViewSet, basename='ranking')
router.register(r'sources', RankingSourceViewSet, basename='source')
router.register(r'composite-rankings', CompositeRankingViewSet, basename='composite-ranking')
router.register(r'comparison', ComparisonViewSet, basename='comparison')
router.register(r'analysis', StrengthsWeaknessesViewSet, basename='analysis')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
