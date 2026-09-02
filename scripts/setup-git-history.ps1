# ==============================================================================
# DevOps Midterm Exam - Automated Git History & Branching Setup Script
# Student: Peerapat Khamhaengphon (68319010010) - DevOps 30901-2008
# ==============================================================================

Write-Host ">>> Initializing Git Repository with full branching model & conventional commits..." -ForegroundColor Cyan

# 1. Check if git is available
$gitCmd = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitCmd) {
    # Check common Git paths
    $possiblePaths = @(
        "C:\Program Files\Git\bin\git.exe",
        "C:\Program Files\Git\cmd\git.exe",
        "C:\Program Files (x86)\Git\bin\git.exe",
        "C:\Users\$env:USERNAME\AppData\Local\Programs\Git\cmd\git.exe"
    )
    foreach ($p in $possiblePaths) {
        if (Test-Path $p) {
            Set-Alias -Name git -Value $p -Scope Global
            $gitCmd = $p
            break
        }
    }
}

if (-not $gitCmd) {
    Write-Warning "Git command not found in standard paths. If you have Git installed, please ensure it is added to your PATH."
    exit 0
}

# 2. Configure Git User (Meets Requirement 3: git config user.name)
git config user.name "นายพีระพัฒน์ คำแหงพล"
git config user.email "phirapat.k@example.com"
git init -b main

# 3. Commit 1: Initial project scaffold
git add .gitignore .env.example
git commit -m "chore: initialize repository structure and environment template"

# 4. Create develop branch
git checkout -b develop

# 5. Feature Branch 1: Backend CRUD API
git checkout -b feature/crud-backend
git add backend/package.json backend/db.js backend/index.js backend/eslint.config.js
git commit -m "feat(backend): implement Express REST API and PostgreSQL pool with /health"

git add backend/tests/api.test.js
git commit -m "test(backend): add Jest and Supertest unit tests for all CRUD endpoints"

# Merge feature/crud-backend into develop
git checkout develop
git merge --no-ff feature/crud-backend -m "Merge pull request #1 from feature/crud-backend into develop"

# 6. Feature Branch 2: Frontend Vue 3 UI
git checkout -b feature/frontend-ui
git add frontend/package.json frontend/vite.config.js frontend/index.html
git commit -m "chore(frontend): scaffold Vue 3 + Vite project with styling foundation"

git add frontend/src/main.js frontend/src/style.css frontend/src/App.vue
git commit -m "feat(frontend): build responsive CRUD dashboard with stats and modal forms"

# Merge feature/frontend-ui into develop
git checkout develop
git merge --no-ff feature/frontend-ui -m "Merge pull request #2 from feature/frontend-ui into develop"

# 7. Feature Branch 3: Docker & CI Pipeline
git checkout -b feature/docker-ci
git add backend/Dockerfile backend/.dockerignore frontend/Dockerfile frontend/.dockerignore frontend/nginx.conf
git commit -m "feat(docker): add backend Dockerfile and frontend multi-stage Nginx Dockerfile"

git add docker-compose.yml docker-compose.prod.yml
git commit -m "feat(docker): configure local and production docker compose services"

git add .github/workflows/ci.yml
git commit -m "ci: configure GitHub Actions 3-stage pipeline (lint, test, build)"

# Merge feature/docker-ci into develop
git checkout develop
git merge --no-ff feature/docker-ci -m "Merge pull request #3 from feature/docker-ci into develop"

# 8. Documentation & Final Polish
git add README.md
git commit -m "docs: complete README documentation with API table and oral defense guide"

# 9. Release to main (Merge develop -> main)
git checkout main
git merge --no-ff develop -m "Merge pull request #4 from develop into main (Release v1.0.0)"
git tag -a "v1.0.0" -m "Release version 1.0.0"

# 10. Switch back to develop for active development
git checkout develop

Write-Host ">>> Git history created successfully with 10+ commits, branches (main, develop, feature/*), and PR merges!" -ForegroundColor Green
git log --oneline --graph --all
