#!/usr/bin/env bash
# Exit on error
set -o errexit

pip install -r requirements.txt

python manage.py collectstatic --noinput
python manage.py migrate

# Seed demo data if database is empty (optional - uncomment if needed)
# python manage.py seed_demo_data
