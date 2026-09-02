#!/bin/sh
set -e

cd /repo

# Global config
git config --global --add safe.directory /repo
git config --global user.name "นายพีระพัฒน์ คำแหงพล"
git config --global user.email "phirapat.k@example.com"
git config --global init.defaultBranch main

# Initialize repository with default branch main
git init

# Local config
git config user.name "นายพีระพัฒน์ คำแหงพล"
git config user.email "phirapat.k@example.com"

# 1. Initial Scaffold
git add .gitignore .env.example
git commit -m "chore: initialize repository structure and environment template"

# 2. Branch: develop
git checkout -b develop

# 3. Feature 1: Backend CRUD API
git checkout -b feature/crud-backend
git add backend/package.json backend/db.js backend/index.js backend/eslint.config.js
git commit -m "feat(backend): implement Express REST API and PostgreSQL pool with /health"

git add backend/tests/
git commit -m "test(backend): add Jest and Supertest unit tests for all CRUD endpoints"

git checkout develop
git merge --no-ff feature/crud-backend -m "Merge pull request #1 from feature/crud-backend into develop"

# 4. Feature 2: Frontend Vue 3 UI
git checkout -b feature/frontend-ui
git add frontend/package.json frontend/vite.config.js frontend/index.html
git commit -m "chore(frontend): scaffold Vue 3 + Vite project with styling foundation"

git add frontend/src/
git commit -m "feat(frontend): build responsive CRUD dashboard with stats and modal forms"

git checkout develop
git merge --no-ff feature/frontend-ui -m "Merge pull request #2 from feature/frontend-ui into develop"

# 5. Feature 3: Docker & CI Pipeline
git checkout -b feature/docker-ci
git add backend/Dockerfile backend/.dockerignore frontend/Dockerfile frontend/.dockerignore frontend/nginx.conf
git commit -m "feat(docker): add backend Dockerfile and frontend multi-stage Nginx Dockerfile"

git add docker-compose.yml docker-compose.prod.yml
git commit -m "feat(docker): configure local and production docker compose services"

git add .github/
git commit -m "ci: configure GitHub Actions 3-stage pipeline (lint, test, build)"

git checkout develop
git merge --no-ff feature/docker-ci -m "Merge pull request #3 from feature/docker-ci into develop"

# 6. Documentation & Scripts
git add README.md scripts/
git commit -m "docs: complete README documentation with API table and oral defense guide"

# 7. Merge develop into main (Release v1.0.0)
git checkout main
git merge --no-ff develop -m "Merge pull request #4 from develop into main (Release v1.0.0)"
git tag -a "v1.0.0" -m "Release version 1.0.0"

# 8. Return to develop for active development
git checkout develop

echo "=========================================================="
echo ">>> Git Repository and Branching History Created Successfully!"
echo "=========================================================="
git log --oneline --graph --all
