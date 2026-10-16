# Production Readiness & Deployment Guide
## MausamIQ: Climate Change & Seasonal Variation Impact on Agriculture

### Document Metadata
- **Document Version:** 1.0.0
- **Target Environments:**
  - Local Developer Mode (Windows / macOS / Linux)
  - Containerized Production (Docker, Docker Compose, Kubernetes)
  - Cloud Platform (Render, Railway, AWS ECS / EC2, Azure App Service)

---

## 1. Environment Configuration

All environment variables are declared in `.env.example` and parsed through `backend/app/config.py` using `pydantic-settings`:

```ini
# Core Application Settings
APP_ENV=production
DEBUG=false
SECRET_KEY=change_this_to_a_secure_random_hex_key_in_production
PORT=8000
HOST=0.0.0.0

# Database Configuration
# Default is local SQLite; uncomment PostgreSQL for production
DATABASE_URL=sqlite:///./app/db/mausamiq.db
# DATABASE_URL=postgresql://mausamiq_user:strong_password@localhost:5432/mausamiq_db

# CORS Allowed Origins (Comma-separated)
CORS_ORIGINS=http://localhost:5173,http://localhost:3000,https://mausamiq.org

# Logging & Observability
LOG_LEVEL=INFO
```

---

## 2. Local Setup & Execution Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm 9+

### Backend Setup
```powershell
# 1. Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# 2. Install dependencies
pip install -r backend/requirements.txt

# 3. Start development API server
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Frontend Setup
```powershell
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
```

---

## 3. Production Deployment with Docker

### Multi-Stage Dockerfile (Backend)
```dockerfile
FROM python:3.11-slim as backend
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/app ./app
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

### Nginx Production Static Hosting (Frontend)
```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 4. Health Checks & Monitoring
- **Liveness Probe:** `GET /api/v1/health` verifies process execution and dataset checksums.
- **Readiness Probe:** Checks database query connectivity (`SELECT 1`).
- **Telemetry:** Structured JSON logging with request duration, IP anonymity, and status codes.
