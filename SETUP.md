# 🚀 Setup & Running Guide

Complete guide to set up and run the College Rankings Aggregator project.

## Prerequisites

- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **Git** - [Download](https://git-scm.com/)

Verify installations:
```bash
python --version   # Should show 3.11+
node --version     # Should show 18+
npm --version      # Should show 9+
```

---

## Backend Setup

### Step 1: Navigate to Backend
```bash
cd college-rankings-project/backend
```

### Step 2: Create Virtual Environment (Recommended)
```bash
# Create virtual environment
python -m venv venv

# Activate it
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env if needed (defaults work for development)
```

### Step 5: Initialize Database
```bash
# Generate database migrations
python manage.py makemigrations

# Create database tables
python manage.py migrate

# Create admin user (optional)
python manage.py createsuperuser
```

### Step 6: Initialize Ranking Sources
```bash
# Set up the 10 ranking sources in database
python manage.py fetch_rankings --init-only
```

### Step 7: Fetch Rankings Data
```bash
# Option 1: Seed with demo data (recommended - reliable and fast)
python manage.py seed_demo_data

# Option 2: Try web scrapers (may fail due to website blocks)
python manage.py fetch_rankings --all
```

### Step 8: Start Backend Server
```bash
python manage.py runserver
```

✅ Backend running at: **http://localhost:8000/api/**

---

## Frontend Setup

### Step 1: Navigate to Frontend (New Terminal)
```bash
cd college-rankings-project/Frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# Default configuration works for local development
```

### Step 4: Start Development Server
```bash
npm run dev
```

✅ Frontend running at: **http://localhost:5173/**

---

## Quick Start (TL;DR)

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py fetch_rankings --init-only
python manage.py runserver
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm install
npm run dev
```

**Access:**
- 🌐 Frontend: http://localhost:5173
- 🔌 API: http://localhost:8000/api/
- 👤 Admin: http://localhost:8000/admin/

---

## Management Commands

### Fetch Rankings
```bash
# Fetch all ranking sources
python manage.py fetch_rankings --all

# Fetch specific source (qs, arwu, usnews, forbes, niche)
python manage.py fetch_rankings --source qs

# Initialize sources only (no data fetch)
python manage.py fetch_rankings --init-only
```

### Check Cache Status
```bash
# View cache status for all sources
python manage.py update_cache --status

# List sources needing update
python manage.py update_cache --stale
```

### Database Operations
```bash
# Create new migrations after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Access Django shell
python manage.py shell

# Collect static files (production)
python manage.py collectstatic --noinput
```

---

## Frontend Build Commands

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

---

## Troubleshooting

### Backend Issues

**"Module not found" errors:**
```bash
# Make sure virtual environment is activated
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Reinstall dependencies
pip install -r requirements.txt
```

**Database errors:**
```bash
# Reset database
rm db.sqlite3
python manage.py makemigrations
python manage.py migrate
python manage.py fetch_rankings --init-only
```

**CORS errors:**
- Check that `CORS_ALLOWED_ORIGINS` in `.env` includes your frontend URL
- Default: `http://localhost:5173`

### Frontend Issues

**"npm install" fails:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API connection errors:**
- Ensure backend is running on port 8000
- Check `VITE_API_URL` in `.env` matches backend URL

**Tailwind styles not loading:**
```bash
# Ensure PostCSS is configured
npm install -D tailwindcss postcss autoprefixer
```

---

## Production Deployment

### Backend (Heroku Example)
```bash
# Add Procfile
echo "web: gunicorn config.wsgi" > Procfile

# Set environment variables
heroku config:set DEBUG=False
heroku config:set SECRET_KEY=$(python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())')

# Deploy
git push heroku main
```

### Frontend (Netlify/Vercel)
```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting provider
```

### Environment Variables for Production

**Backend:**
```
DEBUG=False
SECRET_KEY=<generate-a-secure-key>
ALLOWED_HOSTS=yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com
DATABASE_URL=postgres://user:pass@host:5432/dbname
```

**Frontend:**
```
VITE_API_URL=https://api.yourdomain.com/api
```

---

## API Testing

### Using cURL
```bash
# List colleges
curl http://localhost:8000/api/colleges/

# Search
curl "http://localhost:8000/api/colleges/search/?q=Harvard"

# Get college details
curl http://localhost:8000/api/colleges/1/

# Get composite rankings
curl http://localhost:8000/api/composite-rankings/international/
```

### Using Browser
Navigate to http://localhost:8000/api/ for the browsable API interface.

---

## Development Tips

1. **Hot Reload**: Both frontend (Vite) and backend (Django) support hot reload during development.

2. **API Proxy**: The Vite dev server proxies `/api` requests to Django, avoiding CORS issues in development.

3. **Database Browser**: Use Django Admin at `/admin/` to browse and edit data.

4. **Scraper Testing**: Test scrapers individually before running `--all`:
   ```bash
   python manage.py fetch_rankings --source qs
   ```

5. **TypeScript Types**: Frontend types in `src/types/index.ts` match backend serializers.
