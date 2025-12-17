from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import College, RankingSource, CollegeRanking


class CollegeModelTests(TestCase):
    def setUp(self):
        self.college = College.objects.create(
            name="Test University",
            country="USA",
            city="Boston"
        )
        self.source = RankingSource.objects.create(
            name="Test Ranking",
            code="test",
            region="INTERNATIONAL",
            website_url="https://test.com"
        )
    
    def test_college_creation(self):
        self.assertEqual(self.college.name, "Test University")
        self.assertEqual(str(self.college), "Test University")
    
    def test_composite_score_international(self):
        CollegeRanking.objects.create(
            college=self.college,
            source=self.source,
            rank=1,
            score=95.0,
            ranking_year=2024
        )
        self.assertEqual(self.college.composite_score_international, 95.0)


class CollegeAPITests(APITestCase):
    def setUp(self):
        self.college = College.objects.create(
            name="Harvard University",
            country="USA",
            city="Cambridge"
        )
    
    def test_list_colleges(self):
        url = reverse('college-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_search_colleges(self):
        url = reverse('college-search')
        response = self.client.get(url, {'q': 'Harvard'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
