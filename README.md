# 🎓 College Rankings Aggregator

A full-stack application that aggregates college rankings from 10 different global ranking systems, providing users with a unified platform to search, compare, and analyze universities worldwide.

## 🌟 Features

### Core Functionality
- **10 Ranking Systems Integration**
  - International: QS, THE, ARWU, Webometrics, Leiden
  - American: US News, Forbes, Niche, Washington Monthly, WSJ

- **130+ Universities with 900+ Rankings**
  - Comprehensive data across all 10 indexes
  - Real-time ranking comparison

- **Dual View Mode**
  - **Composite View**: See weighted average rankings from all 5 indexes
  - **Single Index View**: Browse rankings from any specific index with source links

- **Composite Scoring Algorithm**
  - Automatic calculation of average rankings from 5 international sources
  - Automatic calculation of average rankings from 5 American sources
  - Normalization to 0-100 scale
  - Universities not present in an index are excluded (not penalized)

- **Detailed College Profiles**
  - All 10 ranking indexes shown for each college
  - Visual indicators for which indexes the college is present in
  - Clickable links to official ranking sources
  - Strengths and weaknesses analysis

- **Search & Filter**
  - Search colleges by name, country, or ranking system
  - Filter by region (International/American)
  - Pagination support for large datasets

- **Data Management**
  - Hybrid caching system (24-48 hour refresh)
  - Database storage of rankings
  - Demo data seeding command
  - Cache metadata tracking

## 🏗️ Architecture

### Backend Stack
- **Framework**: Django 5.0 + Django REST Framework
- **Database**: SQLite (dev) / PostgreSQL (production)
- **Data Collection**: BeautifulSoup4 + Selenium
- **Caching**: Django cache framework
- **Task Scheduling**: Celery + APScheduler (optional)

### Frontend Stack
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Data Sources
All data is from public ranking websites - **No API keys required**:
- QS Rankings: topuniversities.com
- THE Rankings: timeshighereducation.com
- ARWU: shanghairanking.com
- Webometrics: webometrics.info
- Leiden: leidenranking.com
- US News: usnews.com
- Forbes: forbes.com
- Niche: niche.com
- Washington Monthly: washingtonmonthly.com
- WSJ/THE: wsj.com

## 📁 Project Structure

```
college-rankings-project/
├── backend/
│   ├── config/                    # Django settings & configuration
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── rankings/                  # Main Django app
│   │   ├── models.py              # Database models
│   │   ├── views.py               # REST API endpoints
│   │   ├── serializers.py         # Data serialization
│   │   ├── admin.py               # Admin panel config
│   │   └── management/commands/   # CLI commands
│   │       ├── seed_demo_data.py  # Seed 130+ universities
│   │       ├── fetch_rankings.py  # Data collection command
│   │       └── update_cache.py    # Cache status command
│   ├── scrapers/                  # Web scraping modules
│   │   ├── base_scraper.py        # Base scraper class
│   │   ├── qs_scraper.py          # QS Rankings
│   │   ├── arwu_scraper.py        # ARWU Rankings
│   │   ├── usnews_scraper.py      # US News
│   │   ├── forbes_scraper.py      # Forbes
│   │   └── niche_scraper.py       # Niche
│   ├── manage.py
│   ├── pyproject.toml
│   ├── requirements.txt
│   └── .env.example
│
├── Frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── RankingsTable.tsx
│   │   │   ├── CollegeCard.tsx
│   │   │   ├── CompositeRankingView.tsx
│   │   │   ├── IndexRankingView.tsx
│   │   │   └── StrengthsWeaknesses.tsx
│   │   ├── pages/                 # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── CollegeDetail.tsx
│   │   │   └── Search.tsx
│   │   ├── services/api.ts        # API service layer
│   │   ├── types/index.ts         # TypeScript interfaces
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── .env.example
│
├── README.md                      # This file
└── SETUP.md                       # Setup & running instructions
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/colleges/` | List all colleges |
| GET | `/api/colleges/{id}/` | Get college details |
| GET | `/api/colleges/search/?q=<query>` | Search colleges |
| GET | `/api/colleges/{id}/rankings_breakdown/` | Get rankings breakdown |
| GET | `/api/rankings/` | List all rankings |
| GET | `/api/rankings/by_source/?source=<code>` | Get rankings by source |
| GET | `/api/composite-rankings/international/` | International composite |
| GET | `/api/composite-rankings/american/` | US composite |
| GET | `/api/comparison/compare/?ids=1,2,3` | Compare colleges |
| GET | `/api/analysis/analyze/?college_id=1` | Analyze strengths/weaknesses |
| GET | `/api/sources/` | List ranking sources |

## 📊 Database Models

### RankingSource
Represents a ranking system (QS, THE, ARWU, etc.)
- Name, code, region (International/American)
- Website URL, update frequency

### College
Core university information
- Name, country, city
- Website, logo, description
- Established year

### CollegeRanking
Individual ranking entry for a college
- Rank, score (0-100)
- Performance metrics (academic reputation, research impact, etc.)
- Ranking year

### CacheMetadata
Track data cache status for each source

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
DATABASE_URL=sqlite:///db.sqlite3
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:8000/api
```

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
