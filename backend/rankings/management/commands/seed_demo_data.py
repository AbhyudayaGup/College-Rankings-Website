"""
Seed comprehensive demo data for College Rankings
Top 100+ universities across all 10 ranking systems
"""

from django.core.management.base import BaseCommand
from rankings.models import College, CollegeRanking, RankingSource


# Top 100+ universities with real rankings from various sources
# International sources: qs, the, arwu, webometrics, leiden
# American sources: usnews, forbes, niche, wm (Washington Monthly), wsj

UNIVERSITIES = [
    # Top International Universities (appear in international rankings)
    {"name": "Massachusetts Institute of Technology", "country": "USA", "city": "Cambridge", "qs": 1, "the": 2, "arwu": 4, "webometrics": 1, "leiden": 3, "usnews": 2, "forbes": 3, "niche": 4, "wm": 3, "wsj": 1},
    {"name": "Stanford University", "country": "USA", "city": "Stanford", "qs": 5, "the": 4, "arwu": 2, "webometrics": 2, "leiden": 1, "usnews": 3, "forbes": 2, "niche": 2, "wm": 5, "wsj": 3},
    {"name": "Harvard University", "country": "USA", "city": "Cambridge", "qs": 4, "the": 5, "arwu": 1, "webometrics": 3, "leiden": 2, "usnews": 1, "forbes": 1, "niche": 1, "wm": 1, "wsj": 2},
    {"name": "University of Cambridge", "country": "UK", "city": "Cambridge", "qs": 2, "the": 3, "arwu": 5, "webometrics": 12, "leiden": 15},
    {"name": "University of Oxford", "country": "UK", "city": "Oxford", "qs": 3, "the": 1, "arwu": 7, "webometrics": 10, "leiden": 12},
    {"name": "California Institute of Technology", "country": "USA", "city": "Pasadena", "qs": 10, "the": 6, "arwu": 9, "webometrics": 15, "leiden": 8, "usnews": 6, "forbes": 6, "niche": 12, "wm": 10, "wsj": 8},
    {"name": "ETH Zurich", "country": "Switzerland", "city": "Zurich", "qs": 7, "the": 11, "arwu": 20, "webometrics": 25, "leiden": 22},
    {"name": "Imperial College London", "country": "UK", "city": "London", "qs": 6, "the": 8, "arwu": 22, "webometrics": 30, "leiden": 25},
    {"name": "UCL", "country": "UK", "city": "London", "qs": 9, "the": 9, "arwu": 17, "webometrics": 22, "leiden": 20},
    {"name": "University of Chicago", "country": "USA", "city": "Chicago", "qs": 11, "the": 13, "arwu": 10, "webometrics": 18, "leiden": 14, "usnews": 12, "forbes": 15, "niche": 18, "wm": 15, "wsj": 12},
    {"name": "National University of Singapore", "country": "Singapore", "city": "Singapore", "qs": 8, "the": 19, "arwu": 71, "webometrics": 45, "leiden": 40},
    {"name": "Princeton University", "country": "USA", "city": "Princeton", "qs": 12, "the": 7, "arwu": 6, "webometrics": 8, "leiden": 6, "usnews": 4, "forbes": 4, "niche": 3, "wm": 2, "wsj": 4},
    {"name": "Yale University", "country": "USA", "city": "New Haven", "qs": 18, "the": 10, "arwu": 11, "webometrics": 11, "leiden": 10, "usnews": 5, "forbes": 5, "niche": 5, "wm": 4, "wsj": 5},
    {"name": "Columbia University", "country": "USA", "city": "New York", "qs": 14, "the": 17, "arwu": 8, "webometrics": 7, "leiden": 7, "usnews": 13, "forbes": 14, "niche": 15, "wm": 18, "wsj": 14},
    {"name": "University of Pennsylvania", "country": "USA", "city": "Philadelphia", "qs": 13, "the": 16, "arwu": 14, "webometrics": 14, "leiden": 11, "usnews": 8, "forbes": 8, "niche": 8, "wm": 12, "wsj": 9},
    {"name": "University of Toronto", "country": "Canada", "city": "Toronto", "qs": 21, "the": 21, "arwu": 24, "webometrics": 20, "leiden": 18},
    {"name": "Tsinghua University", "country": "China", "city": "Beijing", "qs": 20, "the": 12, "arwu": 25, "webometrics": 35, "leiden": 30},
    {"name": "Peking University", "country": "China", "city": "Beijing", "qs": 17, "the": 14, "arwu": 29, "webometrics": 40, "leiden": 35},
    {"name": "University of Tokyo", "country": "Japan", "city": "Tokyo", "qs": 32, "the": 29, "arwu": 26, "webometrics": 50, "leiden": 45},
    {"name": "University of Michigan", "country": "USA", "city": "Ann Arbor", "qs": 25, "the": 23, "arwu": 27, "webometrics": 6, "leiden": 5, "usnews": 21, "forbes": 25, "niche": 22, "wm": 20, "wsj": 18},
    {"name": "Duke University", "country": "USA", "city": "Durham", "qs": 50, "the": 25, "arwu": 28, "webometrics": 28, "leiden": 24, "usnews": 10, "forbes": 12, "niche": 10, "wm": 14, "wsj": 11},
    {"name": "Northwestern University", "country": "USA", "city": "Evanston", "qs": 47, "the": 24, "arwu": 32, "webometrics": 32, "leiden": 28, "usnews": 9, "forbes": 10, "niche": 9, "wm": 16, "wsj": 10},
    {"name": "Cornell University", "country": "USA", "city": "Ithaca", "qs": 16, "the": 20, "arwu": 12, "webometrics": 9, "leiden": 9, "usnews": 17, "forbes": 18, "niche": 16, "wm": 22, "wsj": 16},
    {"name": "Johns Hopkins University", "country": "USA", "city": "Baltimore", "qs": 15, "the": 15, "arwu": 13, "webometrics": 13, "leiden": 13, "usnews": 7, "forbes": 9, "niche": 14, "wm": 8, "wsj": 7},
    {"name": "University of California, Berkeley", "country": "USA", "city": "Berkeley", "qs": 27, "the": 39, "arwu": 3, "webometrics": 4, "leiden": 4, "usnews": 15, "forbes": 13, "niche": 11, "wm": 6, "wsj": 15},
    {"name": "University of California, Los Angeles", "country": "USA", "city": "Los Angeles", "qs": 29, "the": 18, "arwu": 15, "webometrics": 5, "leiden": 16, "usnews": 18, "forbes": 20, "niche": 17, "wm": 11, "wsj": 17},
    {"name": "New York University", "country": "USA", "city": "New York", "qs": 38, "the": 27, "arwu": 30, "webometrics": 24, "leiden": 26, "usnews": 35, "forbes": 35, "niche": 30, "wm": 28, "wsj": 25},
    {"name": "Technical University of Munich", "country": "Germany", "city": "Munich", "qs": 37, "the": 30, "arwu": 48, "webometrics": 55, "leiden": 50},
    {"name": "University of Melbourne", "country": "Australia", "city": "Melbourne", "qs": 33, "the": 37, "arwu": 35, "webometrics": 42, "leiden": 38},
    {"name": "Seoul National University", "country": "South Korea", "city": "Seoul", "qs": 41, "the": 56, "arwu": 42, "webometrics": 60, "leiden": 55},
    {"name": "University of Edinburgh", "country": "UK", "city": "Edinburgh", "qs": 22, "the": 30, "arwu": 38, "webometrics": 48, "leiden": 42},
    {"name": "King's College London", "country": "UK", "city": "London", "qs": 40, "the": 35, "arwu": 53, "webometrics": 65, "leiden": 58},
    {"name": "University of Sydney", "country": "Australia", "city": "Sydney", "qs": 19, "the": 60, "arwu": 65, "webometrics": 70, "leiden": 62},
    {"name": "Nanyang Technological University", "country": "Singapore", "city": "Singapore", "qs": 26, "the": 32, "arwu": 72, "webometrics": 75, "leiden": 68},
    {"name": "University of Hong Kong", "country": "Hong Kong", "city": "Hong Kong", "qs": 28, "the": 31, "arwu": 85, "webometrics": 80, "leiden": 75},
    {"name": "McGill University", "country": "Canada", "city": "Montreal", "qs": 30, "the": 49, "arwu": 67, "webometrics": 58, "leiden": 52},
    {"name": "University of British Columbia", "country": "Canada", "city": "Vancouver", "qs": 34, "the": 41, "arwu": 44, "webometrics": 38, "leiden": 32},
    {"name": "Australian National University", "country": "Australia", "city": "Canberra", "qs": 34, "the": 67, "arwu": 76, "webometrics": 85, "leiden": 78},
    {"name": "Paris Sciences et Lettres", "country": "France", "city": "Paris", "qs": 24, "the": 40, "arwu": 33, "webometrics": 90, "leiden": 85},
    {"name": "University of Manchester", "country": "UK", "city": "Manchester", "qs": 32, "the": 54, "arwu": 36, "webometrics": 52, "leiden": 48},
    {"name": "Kyoto University", "country": "Japan", "city": "Kyoto", "qs": 46, "the": 55, "arwu": 39, "webometrics": 68, "leiden": 60},
    {"name": "KAIST", "country": "South Korea", "city": "Daejeon", "qs": 56, "the": 83, "arwu": 95, "webometrics": 95, "leiden": 88},
    {"name": "Hong Kong University of Science and Technology", "country": "Hong Kong", "city": "Hong Kong", "qs": 60, "the": 64, "arwu": 98, "webometrics": 92, "leiden": 90},
    {"name": "Delft University of Technology", "country": "Netherlands", "city": "Delft", "qs": 47, "the": 48, "arwu": 50, "webometrics": 62, "leiden": 55},
    {"name": "University of Amsterdam", "country": "Netherlands", "city": "Amsterdam", "qs": 53, "the": 60, "arwu": 58, "webometrics": 72, "leiden": 65},
    {"name": "LMU Munich", "country": "Germany", "city": "Munich", "qs": 54, "the": 38, "arwu": 51, "webometrics": 78, "leiden": 70},
    {"name": "Fudan University", "country": "China", "city": "Shanghai", "qs": 39, "the": 44, "arwu": 54, "webometrics": 82, "leiden": 72},
    {"name": "Shanghai Jiao Tong University", "country": "China", "city": "Shanghai", "qs": 45, "the": 43, "arwu": 46, "webometrics": 76, "leiden": 68},
    {"name": "Zhejiang University", "country": "China", "city": "Hangzhou", "qs": 44, "the": 53, "arwu": 52, "webometrics": 88, "leiden": 80},
    {"name": "London School of Economics", "country": "UK", "city": "London", "qs": 45, "the": 46, "arwu": 200, "webometrics": 150, "leiden": 120},
    
    # Additional US Universities (appear in American rankings primarily)
    {"name": "Rice University", "country": "USA", "city": "Houston", "qs": 77, "the": 86, "arwu": 90, "webometrics": 55, "leiden": 48, "usnews": 15, "forbes": 16, "niche": 13, "wm": 13, "wsj": 13},
    {"name": "Vanderbilt University", "country": "USA", "city": "Nashville", "qs": 99, "the": 98, "arwu": 78, "webometrics": 65, "leiden": 58, "usnews": 18, "forbes": 20, "niche": 19, "wm": 25, "wsj": 19},
    {"name": "University of Notre Dame", "country": "USA", "city": "Notre Dame", "qs": 120, "the": 190, "arwu": 180, "webometrics": 85, "leiden": 75, "usnews": 20, "forbes": 22, "niche": 21, "wm": 30, "wsj": 22},
    {"name": "Georgetown University", "country": "USA", "city": "Washington", "qs": 101, "the": 120, "arwu": 195, "webometrics": 110, "leiden": 95, "usnews": 22, "forbes": 24, "niche": 23, "wm": 35, "wsj": 24},
    {"name": "Carnegie Mellon University", "country": "USA", "city": "Pittsburgh", "qs": 52, "the": 28, "arwu": 91, "webometrics": 35, "leiden": 30, "usnews": 24, "forbes": 28, "niche": 20, "wm": 40, "wsj": 26},
    {"name": "University of Virginia", "country": "USA", "city": "Charlottesville", "qs": 115, "the": 140, "arwu": 125, "webometrics": 58, "leiden": 52, "usnews": 25, "forbes": 30, "niche": 25, "wm": 19, "wsj": 28},
    {"name": "University of Southern California", "country": "USA", "city": "Los Angeles", "qs": 80, "the": 65, "arwu": 68, "webometrics": 42, "leiden": 38, "usnews": 28, "forbes": 35, "niche": 28, "wm": 42, "wsj": 30},
    {"name": "Brown University", "country": "USA", "city": "Providence", "qs": 73, "the": 75, "arwu": 95, "webometrics": 48, "leiden": 42, "usnews": 13, "forbes": 17, "niche": 7, "wm": 24, "wsj": 20},
    {"name": "Dartmouth College", "country": "USA", "city": "Hanover", "qs": 125, "the": 130, "arwu": 175, "webometrics": 95, "leiden": 85, "usnews": 14, "forbes": 11, "niche": 6, "wm": 17, "wsj": 21},
    {"name": "Emory University", "country": "USA", "city": "Atlanta", "qs": 170, "the": 82, "arwu": 115, "webometrics": 72, "leiden": 65, "usnews": 26, "forbes": 32, "niche": 26, "wm": 45, "wsj": 32},
    {"name": "Washington University in St. Louis", "country": "USA", "city": "St. Louis", "qs": 98, "the": 52, "arwu": 22, "webometrics": 45, "leiden": 40, "usnews": 24, "forbes": 27, "niche": 24, "wm": 38, "wsj": 27},
    {"name": "University of Wisconsin-Madison", "country": "USA", "city": "Madison", "qs": 83, "the": 81, "arwu": 31, "webometrics": 19, "leiden": 17, "usnews": 38, "forbes": 45, "niche": 38, "wm": 9, "wsj": 35},
    {"name": "University of Illinois Urbana-Champaign", "country": "USA", "city": "Champaign", "qs": 64, "the": 48, "arwu": 37, "webometrics": 16, "leiden": 19, "usnews": 41, "forbes": 48, "niche": 42, "wm": 21, "wsj": 38},
    {"name": "University of Texas at Austin", "country": "USA", "city": "Austin", "qs": 66, "the": 50, "arwu": 41, "webometrics": 17, "leiden": 21, "usnews": 32, "forbes": 40, "niche": 35, "wm": 27, "wsj": 33},
    {"name": "Georgia Institute of Technology", "country": "USA", "city": "Atlanta", "qs": 61, "the": 33, "arwu": 101, "webometrics": 28, "leiden": 25, "usnews": 33, "forbes": 38, "niche": 32, "wm": 32, "wsj": 34},
    {"name": "University of Washington", "country": "USA", "city": "Seattle", "qs": 63, "the": 26, "arwu": 16, "webometrics": 10, "leiden": 8, "usnews": 40, "forbes": 50, "niche": 45, "wm": 7, "wsj": 40},
    {"name": "Boston University", "country": "USA", "city": "Boston", "qs": 93, "the": 71, "arwu": 88, "webometrics": 52, "leiden": 46, "usnews": 43, "forbes": 52, "niche": 48, "wm": 55, "wsj": 45},
    {"name": "University of North Carolina at Chapel Hill", "country": "USA", "city": "Chapel Hill", "qs": 92, "the": 62, "arwu": 34, "webometrics": 32, "leiden": 28, "usnews": 29, "forbes": 42, "niche": 40, "wm": 23, "wsj": 36},
    {"name": "Ohio State University", "country": "USA", "city": "Columbus", "qs": 95, "the": 89, "arwu": 100, "webometrics": 25, "leiden": 22, "usnews": 45, "forbes": 55, "niche": 52, "wm": 34, "wsj": 48},
    {"name": "University of California, San Diego", "country": "USA", "city": "San Diego", "qs": 53, "the": 34, "arwu": 18, "webometrics": 15, "leiden": 12, "usnews": 36, "forbes": 44, "niche": 38, "wm": 15, "wsj": 37},
    {"name": "University of California, Davis", "country": "USA", "city": "Davis", "qs": 102, "the": 88, "arwu": 94, "webometrics": 38, "leiden": 32, "usnews": 48, "forbes": 58, "niche": 55, "wm": 29, "wsj": 50},
    {"name": "University of California, Santa Barbara", "country": "USA", "city": "Santa Barbara", "qs": 83, "the": 70, "arwu": 57, "webometrics": 42, "leiden": 35, "usnews": 46, "forbes": 56, "niche": 50, "wm": 26, "wsj": 46},
    {"name": "Purdue University", "country": "USA", "city": "West Lafayette", "qs": 99, "the": 86, "arwu": 85, "webometrics": 35, "leiden": 30, "usnews": 51, "forbes": 62, "niche": 58, "wm": 36, "wsj": 52},
    {"name": "University of Florida", "country": "USA", "city": "Gainesville", "qs": 125, "the": 95, "arwu": 105, "webometrics": 48, "leiden": 42, "usnews": 34, "forbes": 46, "niche": 42, "wm": 31, "wsj": 42},
    {"name": "University of Minnesota", "country": "USA", "city": "Minneapolis", "qs": 110, "the": 78, "arwu": 40, "webometrics": 28, "leiden": 24, "usnews": 55, "forbes": 65, "niche": 60, "wm": 37, "wsj": 55},
    {"name": "Penn State University", "country": "USA", "city": "University Park", "qs": 115, "the": 92, "arwu": 75, "webometrics": 22, "leiden": 20, "usnews": 60, "forbes": 68, "niche": 62, "wm": 43, "wsj": 58},
    {"name": "Michigan State University", "country": "USA", "city": "East Lansing", "qs": 135, "the": 105, "arwu": 92, "webometrics": 45, "leiden": 38, "usnews": 65, "forbes": 72, "niche": 65, "wm": 48, "wsj": 62},
    {"name": "University of Maryland", "country": "USA", "city": "College Park", "qs": 97, "the": 77, "arwu": 55, "webometrics": 32, "leiden": 28, "usnews": 57, "forbes": 64, "niche": 58, "wm": 33, "wsj": 56},
    {"name": "Arizona State University", "country": "USA", "city": "Tempe", "qs": 179, "the": 135, "arwu": 110, "webometrics": 55, "leiden": 48, "usnews": 105, "forbes": 95, "niche": 88, "wm": 58, "wsj": 75},
    {"name": "University of Pittsburgh", "country": "USA", "city": "Pittsburgh", "qs": 140, "the": 110, "arwu": 82, "webometrics": 62, "leiden": 55, "usnews": 62, "forbes": 70, "niche": 68, "wm": 52, "wsj": 65},
    {"name": "Indiana University", "country": "USA", "city": "Bloomington", "qs": 175, "the": 165, "arwu": 125, "webometrics": 68, "leiden": 58, "usnews": 75, "forbes": 78, "niche": 72, "wm": 65, "wsj": 70},
    {"name": "University of Colorado Boulder", "country": "USA", "city": "Boulder", "qs": 125, "the": 108, "arwu": 48, "webometrics": 45, "leiden": 40, "usnews": 85, "forbes": 82, "niche": 78, "wm": 55, "wsj": 72},
    {"name": "Rutgers University", "country": "USA", "city": "New Brunswick", "qs": 155, "the": 125, "arwu": 62, "webometrics": 52, "leiden": 45, "usnews": 65, "forbes": 75, "niche": 70, "wm": 50, "wsj": 68},
    {"name": "University of Rochester", "country": "USA", "city": "Rochester", "qs": 165, "the": 145, "arwu": 105, "webometrics": 78, "leiden": 68, "usnews": 47, "forbes": 55, "niche": 52, "wm": 62, "wsj": 54},
    {"name": "Case Western Reserve University", "country": "USA", "city": "Cleveland", "qs": 170, "the": 135, "arwu": 115, "webometrics": 82, "leiden": 72, "usnews": 53, "forbes": 58, "niche": 55, "wm": 58, "wsj": 56},
    {"name": "University of California, Irvine", "country": "USA", "city": "Irvine", "qs": 88, "the": 96, "arwu": 70, "webometrics": 48, "leiden": 42, "usnews": 50, "forbes": 60, "niche": 54, "wm": 44, "wsj": 52},
    {"name": "Northeastern University", "country": "USA", "city": "Boston", "qs": 142, "the": 168, "arwu": 250, "webometrics": 88, "leiden": 78, "usnews": 53, "forbes": 60, "niche": 56, "wm": 68, "wsj": 58},
    {"name": "Tufts University", "country": "USA", "city": "Medford", "qs": 240, "the": 180, "arwu": 190, "webometrics": 95, "leiden": 85, "usnews": 44, "forbes": 48, "niche": 45, "wm": 60, "wsj": 48},
    {"name": "University of Miami", "country": "USA", "city": "Coral Gables", "qs": 295, "the": 215, "arwu": 175, "webometrics": 105, "leiden": 92, "usnews": 67, "forbes": 72, "niche": 68, "wm": 75, "wsj": 68},
    {"name": "Boston College", "country": "USA", "city": "Chestnut Hill", "qs": 320, "the": 260, "arwu": 320, "webometrics": 115, "leiden": 98, "usnews": 39, "forbes": 44, "niche": 42, "wm": 55, "wsj": 45},
    {"name": "George Washington University", "country": "USA", "city": "Washington", "usnews": 72, "forbes": 80, "niche": 75, "wm": 72, "wsj": 75},
    {"name": "University of Iowa", "country": "USA", "city": "Iowa City", "usnews": 93, "forbes": 88, "niche": 82, "wm": 62, "wsj": 78},
    {"name": "University of Delaware", "country": "USA", "city": "Newark", "usnews": 97, "forbes": 92, "niche": 88, "wm": 75, "wsj": 82},
    {"name": "Syracuse University", "country": "USA", "city": "Syracuse", "usnews": 62, "forbes": 68, "niche": 65, "wm": 78, "wsj": 68},
    {"name": "University of Connecticut", "country": "USA", "city": "Storrs", "usnews": 58, "forbes": 66, "niche": 62, "wm": 54, "wsj": 62},
    {"name": "Texas A&M University", "country": "USA", "city": "College Station", "usnews": 68, "forbes": 75, "niche": 72, "wm": 48, "wsj": 70},
    {"name": "Virginia Tech", "country": "USA", "city": "Blacksburg", "usnews": 75, "forbes": 78, "niche": 76, "wm": 62, "wsj": 75},
    {"name": "Clemson University", "country": "USA", "city": "Clemson", "usnews": 88, "forbes": 85, "niche": 82, "wm": 72, "wsj": 80},
    {"name": "University of Massachusetts Amherst", "country": "USA", "city": "Amherst", "usnews": 67, "forbes": 72, "niche": 68, "wm": 45, "wsj": 65},
    {"name": "Fordham University", "country": "USA", "city": "New York", "usnews": 89, "forbes": 88, "niche": 85, "wm": 82, "wsj": 85},
    {"name": "Tulane University", "country": "USA", "city": "New Orleans", "usnews": 73, "forbes": 75, "niche": 72, "wm": 68, "wsj": 72},
    {"name": "Wake Forest University", "country": "USA", "city": "Winston-Salem", "usnews": 47, "forbes": 52, "niche": 50, "wm": 58, "wsj": 52},
    {"name": "Lehigh University", "country": "USA", "city": "Bethlehem", "usnews": 51, "forbes": 56, "niche": 54, "wm": 62, "wsj": 55},
    {"name": "Pepperdine University", "country": "USA", "city": "Malibu", "usnews": 76, "forbes": 78, "niche": 75, "wm": 85, "wsj": 78},
    {"name": "Southern Methodist University", "country": "USA", "city": "Dallas", "usnews": 70, "forbes": 74, "niche": 72, "wm": 78, "wsj": 72},
    {"name": "Brigham Young University", "country": "USA", "city": "Provo", "usnews": 89, "forbes": 92, "niche": 88, "wm": 82, "wsj": 88},
    {"name": "Worcester Polytechnic Institute", "country": "USA", "city": "Worcester", "usnews": 66, "forbes": 70, "niche": 68, "wm": 72, "wsj": 68},
    {"name": "Rensselaer Polytechnic Institute", "country": "USA", "city": "Troy", "usnews": 60, "forbes": 65, "niche": 62, "wm": 68, "wsj": 62},
    {"name": "Santa Clara University", "country": "USA", "city": "Santa Clara", "usnews": 77, "forbes": 80, "niche": 78, "wm": 82, "wsj": 78},
    {"name": "University of Denver", "country": "USA", "city": "Denver", "usnews": 98, "forbes": 95, "niche": 92, "wm": 88, "wsj": 92},
    {"name": "American University", "country": "USA", "city": "Washington", "usnews": 105, "forbes": 98, "niche": 95, "wm": 92, "wsj": 95},
    {"name": "Loyola Marymount University", "country": "USA", "city": "Los Angeles", "usnews": 88, "forbes": 90, "niche": 88, "wm": 95, "wsj": 88},
    {"name": "Marquette University", "country": "USA", "city": "Milwaukee", "usnews": 95, "forbes": 98, "niche": 95, "wm": 88, "wsj": 95},
    {"name": "Baylor University", "country": "USA", "city": "Waco", "usnews": 93, "forbes": 96, "niche": 92, "wm": 85, "wsj": 92},
    {"name": "Auburn University", "country": "USA", "city": "Auburn", "usnews": 97, "forbes": 102, "niche": 98, "wm": 92, "wsj": 98},
    {"name": "University of Alabama", "country": "USA", "city": "Tuscaloosa", "usnews": 103, "forbes": 105, "niche": 102, "wm": 95, "wsj": 102},
    
    # Liberal Arts Colleges (primarily American rankings)
    {"name": "Williams College", "country": "USA", "city": "Williamstown", "usnews": 1, "forbes": 7, "niche": 15, "wm": 10, "wsj": 6},
    {"name": "Amherst College", "country": "USA", "city": "Amherst", "usnews": 2, "forbes": 10, "niche": 18, "wm": 8, "wsj": 8},
    {"name": "Swarthmore College", "country": "USA", "city": "Swarthmore", "usnews": 3, "forbes": 12, "niche": 20, "wm": 12, "wsj": 10},
    {"name": "Pomona College", "country": "USA", "city": "Claremont", "usnews": 4, "forbes": 15, "niche": 22, "wm": 15, "wsj": 15},
    {"name": "Wellesley College", "country": "USA", "city": "Wellesley", "usnews": 5, "forbes": 18, "niche": 28, "wm": 20, "wsj": 18},
    {"name": "Bowdoin College", "country": "USA", "city": "Brunswick", "usnews": 6, "forbes": 20, "niche": 32, "wm": 22, "wsj": 22},
    {"name": "Middlebury College", "country": "USA", "city": "Middlebury", "usnews": 9, "forbes": 25, "niche": 35, "wm": 28, "wsj": 28},
    {"name": "Carleton College", "country": "USA", "city": "Northfield", "usnews": 7, "forbes": 22, "niche": 38, "wm": 18, "wsj": 25},
    {"name": "Claremont McKenna College", "country": "USA", "city": "Claremont", "usnews": 8, "forbes": 24, "niche": 40, "wm": 25, "wsj": 26},
    {"name": "Washington and Lee University", "country": "USA", "city": "Lexington", "usnews": 10, "forbes": 28, "niche": 45, "wm": 32, "wsj": 32},
    {"name": "Grinnell College", "country": "USA", "city": "Grinnell", "usnews": 11, "forbes": 30, "niche": 48, "wm": 14, "wsj": 35},
    {"name": "Harvey Mudd College", "country": "USA", "city": "Claremont", "usnews": 12, "forbes": 19, "niche": 25, "wm": 16, "wsj": 20},
    {"name": "Colby College", "country": "USA", "city": "Waterville", "usnews": 18, "forbes": 35, "niche": 52, "wm": 38, "wsj": 40},
    {"name": "Hamilton College", "country": "USA", "city": "Clinton", "usnews": 15, "forbes": 32, "niche": 50, "wm": 35, "wsj": 38},
    {"name": "Haverford College", "country": "USA", "city": "Haverford", "usnews": 16, "forbes": 33, "niche": 55, "wm": 30, "wsj": 36},
    {"name": "Wesleyan University", "country": "USA", "city": "Middletown", "usnews": 17, "forbes": 34, "niche": 42, "wm": 26, "wsj": 34},
    {"name": "Vassar College", "country": "USA", "city": "Poughkeepsie", "usnews": 13, "forbes": 31, "niche": 44, "wm": 24, "wsj": 30},
    {"name": "Davidson College", "country": "USA", "city": "Davidson", "usnews": 14, "forbes": 29, "niche": 46, "wm": 28, "wsj": 29},
    {"name": "Smith College", "country": "USA", "city": "Northampton", "usnews": 19, "forbes": 36, "niche": 58, "wm": 40, "wsj": 42},
    {"name": "Barnard College", "country": "USA", "city": "New York", "usnews": 20, "forbes": 38, "niche": 36, "wm": 42, "wsj": 38},
    
    # More International Universities
    {"name": "University of Munich", "country": "Germany", "city": "Munich", "qs": 55, "the": 38, "arwu": 51, "webometrics": 78, "leiden": 70},
    {"name": "Heidelberg University", "country": "Germany", "city": "Heidelberg", "qs": 65, "the": 47, "arwu": 60, "webometrics": 85, "leiden": 75},
    {"name": "University of Copenhagen", "country": "Denmark", "city": "Copenhagen", "qs": 76, "the": 79, "arwu": 32, "webometrics": 72, "leiden": 65},
    {"name": "Karolinska Institute", "country": "Sweden", "city": "Stockholm", "qs": 55, "the": 50, "arwu": 45, "webometrics": 95, "leiden": 82},
    {"name": "Sorbonne University", "country": "France", "city": "Paris", "qs": 59, "the": 58, "arwu": 35, "webometrics": 88, "leiden": 78},
    {"name": "University of Zurich", "country": "Switzerland", "city": "Zurich", "qs": 69, "the": 82, "arwu": 56, "webometrics": 92, "leiden": 85},
    {"name": "University of Vienna", "country": "Austria", "city": "Vienna", "qs": 137, "the": 124, "arwu": 148, "webometrics": 125, "leiden": 115},
    {"name": "Lomonosov Moscow State University", "country": "Russia", "city": "Moscow", "qs": 87, "the": 158, "arwu": 103, "webometrics": 135, "leiden": 120},
    {"name": "Hebrew University of Jerusalem", "country": "Israel", "city": "Jerusalem", "qs": 120, "the": 95, "arwu": 68, "webometrics": 105, "leiden": 95},
    {"name": "Technion Israel Institute of Technology", "country": "Israel", "city": "Haifa", "qs": 95, "the": 120, "arwu": 98, "webometrics": 110, "leiden": 100},
    {"name": "University of Auckland", "country": "New Zealand", "city": "Auckland", "qs": 68, "the": 150, "arwu": 201, "webometrics": 145, "leiden": 130},
    {"name": "KU Leuven", "country": "Belgium", "city": "Leuven", "qs": 59, "the": 45, "arwu": 90, "webometrics": 98, "leiden": 88},
    {"name": "Trinity College Dublin", "country": "Ireland", "city": "Dublin", "qs": 81, "the": 98, "arwu": 168, "webometrics": 155, "leiden": 140},
    {"name": "Uppsala University", "country": "Sweden", "city": "Uppsala", "qs": 105, "the": 88, "arwu": 77, "webometrics": 115, "leiden": 105},
    {"name": "University of Groningen", "country": "Netherlands", "city": "Groningen", "qs": 120, "the": 75, "arwu": 85, "webometrics": 120, "leiden": 108},
    {"name": "Monash University", "country": "Australia", "city": "Melbourne", "qs": 42, "the": 54, "arwu": 75, "webometrics": 82, "leiden": 72},
    {"name": "University of New South Wales", "country": "Australia", "city": "Sydney", "qs": 48, "the": 96, "arwu": 92, "webometrics": 95, "leiden": 85},
    {"name": "University of Queensland", "country": "Australia", "city": "Brisbane", "qs": 50, "the": 60, "arwu": 55, "webometrics": 78, "leiden": 68},
    {"name": "Chinese University of Hong Kong", "country": "Hong Kong", "city": "Hong Kong", "qs": 47, "the": 52, "arwu": 105, "webometrics": 112, "leiden": 102},
    {"name": "City University of Hong Kong", "country": "Hong Kong", "city": "Hong Kong", "qs": 70, "the": 82, "arwu": 155, "webometrics": 145, "leiden": 132},
]

# Source information with official URLs
SOURCES = {
    'qs': {'name': 'QS World University Rankings', 'region': 'INTERNATIONAL', 'url': 'https://www.topuniversities.com/university-rankings'},
    'the': {'name': 'Times Higher Education', 'region': 'INTERNATIONAL', 'url': 'https://www.timeshighereducation.com/world-university-rankings'},
    'arwu': {'name': 'Academic Ranking of World Universities', 'region': 'INTERNATIONAL', 'url': 'https://www.shanghairanking.com/rankings/arwu'},
    'webometrics': {'name': 'Webometrics Ranking', 'region': 'INTERNATIONAL', 'url': 'https://www.webometrics.info/en/World'},
    'leiden': {'name': 'CWTS Leiden Ranking', 'region': 'INTERNATIONAL', 'url': 'https://www.leidenranking.com/ranking'},
    'usnews': {'name': 'US News Best Colleges', 'region': 'AMERICAN', 'url': 'https://www.usnews.com/best-colleges'},
    'forbes': {'name': 'Forbes Top Colleges', 'region': 'AMERICAN', 'url': 'https://www.forbes.com/top-colleges'},
    'niche': {'name': 'Niche Best Colleges', 'region': 'AMERICAN', 'url': 'https://www.niche.com/colleges/search/best-colleges'},
    'wm': {'name': 'Washington Monthly', 'region': 'AMERICAN', 'url': 'https://washingtonmonthly.com/2024-college-guide'},
    'wsj': {'name': 'Wall Street Journal/THE', 'region': 'AMERICAN', 'url': 'https://www.wsj.com/rankings/college-rankings'},
}


class Command(BaseCommand):
    help = 'Seed the database with comprehensive college rankings data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            CollegeRanking.objects.all().delete()
            College.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('✓ Cleared existing data'))

        # Ensure ranking sources exist
        sources = self._ensure_sources()
        
        # Create colleges and rankings
        created_colleges = 0
        created_rankings = 0
        
        for uni_data in UNIVERSITIES:
            # Get or create college
            college, created = College.objects.get_or_create(
                name=uni_data['name'],
                defaults={
                    'country': uni_data['country'],
                    'city': uni_data.get('city', ''),
                }
            )
            if created:
                created_colleges += 1
            
            # Create rankings for each source
            for source_code in ['qs', 'the', 'arwu', 'webometrics', 'leiden', 'usnews', 'forbes', 'niche', 'wm', 'wsj']:
                if source_code not in uni_data:
                    continue
                
                rank = uni_data[source_code]
                source = sources.get(source_code)
                if not source:
                    continue
                
                # Calculate score (inverse of rank, normalized to 0-100)
                if rank <= 10:
                    score = 100 - (rank - 1) * 1
                elif rank <= 50:
                    score = 90 - (rank - 10) * 0.5
                elif rank <= 100:
                    score = 70 - (rank - 50) * 0.4
                else:
                    score = max(20, 50 - (rank - 100) * 0.15)
                
                ranking, created = CollegeRanking.objects.get_or_create(
                    college=college,
                    source=source,
                    ranking_year=2025,
                    defaults={
                        'rank': rank,
                        'score': round(score, 1),
                    }
                )
                if created:
                    created_rankings += 1
        
        self.stdout.write(self.style.SUCCESS(
            f'✓ Seeded {created_colleges} colleges and {created_rankings} rankings'
        ))
        
        # Print summary by source
        self.stdout.write('\nRankings by source:')
        for code, info in SOURCES.items():
            count = CollegeRanking.objects.filter(source__code=code).count()
            self.stdout.write(f'  {info["name"]}: {count} colleges')
        
        self.stdout.write(self.style.SUCCESS(
            f'\nTotal: {College.objects.count()} colleges, {CollegeRanking.objects.count()} rankings'
        ))

    def _ensure_sources(self):
        """Ensure all ranking sources exist with correct URLs"""
        sources = {}
        for code, info in SOURCES.items():
            source, _ = RankingSource.objects.update_or_create(
                code=code,
                defaults={
                    'name': info['name'],
                    'region': info['region'],
                    'website_url': info['url'],
                }
            )
            sources[code] = source
        return sources
