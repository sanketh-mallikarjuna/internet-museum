# Internet Museum — FastAPI Backend (Milestone 3)

The high-performance, asynchronous REST API backend for the **Internet Museum**, built with **Python 3.11+**, **FastAPI**, **SQLAlchemy ORM**, **Pydantic v2**, and **Alembic**.

> **Note**: The previous Java Spring Boot backend has been safely preserved and archived under `backend-springboot-archive/`.

---

## 🏛️ Architecture & Folder Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI application entrypoint, CORS & lifespan
│   ├── core/
│   │   ├── __init__.py
│   │   └── config.py            # Pydantic BaseSettings, DB connection & CORS origins
│   ├── database/
│   │   ├── __init__.py
│   │   ├── base.py              # Declarative ORM Base
│   │   └── session.py           # Engine creation, SessionLocal & get_db dependency
│   ├── models/
│   │   ├── __init__.py
│   │   ├── wing.py              # MuseumWing model
│   │   ├── exhibit.py           # Exhibit and ExhibitTag models
│   │   └── trail.py             # MuseumTrail, TrailTag, and TrailStop models
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── wing.py              # MuseumWingResponse DTO
│   │   ├── exhibit.py           # ExhibitResponse DTO (with nested coords)
│   │   ├── trail.py             # MuseumTrailResponse & TrailStopResponse DTOs
│   │   └── health.py            # HealthResponse DTO
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── health.py            # GET /api/v1/health
│   │   ├── wings.py             # GET /api/v1/wings
│   │   ├── exhibits.py          # GET /api/v1/exhibits & GET /api/v1/exhibits/{id}
│   │   └── trails.py            # GET /api/v1/trails
│   └── services/
│       ├── __init__.py
│       └── seed_service.py      # Idempotent database seeder (5 wings, 30 exhibits, 3 trails)
├── migrations/                  # Alembic database migrations
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       └── 001_initial_schema.py # V1 schema definition
├── tests/
│   ├── conftest.py              # Test database session & FastAPI TestClient fixture
│   ├── test_health.py           # Health endpoint verification
│   ├── test_wings.py            # Museum wings retrieval tests
│   ├── test_exhibits.py         # Exhibit listing, filtering, search, and detail tests
│   ├── test_trails.py           # Museum trail & ordered stops verification
│   ├── test_seed.py             # Seed record count & idempotency tests
│   └── test_cors.py             # Cross-Origin Resource Sharing tests
├── alembic.ini                  # Alembic migration configuration
├── pytest.ini                   # Pytest test discovery & PYTHONPATH configuration
├── requirements.txt             # Pip dependency manifest
├── .env.example                 # Environment variables template
└── README.md                    # Project documentation
```

---

## 🚀 Quickstart & Setup

### 1. Prerequisites
- **Python 3.11+** installed (tested on Python 3.14 / 3.11)
- **MySQL 8.0+** (or SQLite fallback for offline demonstration)

### 2. Virtual Environment Setup
Open PowerShell inside the `backend/` directory:
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```

### 3. Environment Configuration
Create a `.env` file from `.env.example`:
```powershell
Copy-Item .env.example .env
```

Edit `.env` to provide your MySQL database credentials:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=internet_museum
DB_USER=root
DB_PASSWORD=your_mysql_password
```
*(If MySQL is not running or credentials are empty, the application automatically uses the local `internet_museum.db` SQLite fallback for demonstration without crashing).*

---

## 🗄️ Database Migrations & Seeding

### 1. Run Alembic Migrations
Apply version-controlled schema migrations:
```powershell
.\.venv\Scripts\alembic.exe upgrade head
```

### 2. Initial Data Seeding
The application automatically and idempotently seeds all required curated museum data on startup via `lifespan`:
- **5 Museum Wings**: The Central Atrium, Hall of Generative Wonders, Archive of Forgotten Protocols, The Cabinet of Curiosities, and Playground of Fiction & Play.
- **30 Exhibits**: Complete with authors, years, tags, curator notes, interaction levels, and constellation canvas coordinates.
- **3 Preset Trails**: Fully ordered stops referencing the curated exhibits.

Seeding is **strictly idempotent**; re-running it will update existing entries without creating duplicates.

---

## 🏃 Running the Application

Start the development server with live reload:
```powershell
.\.venv\Scripts\uvicorn.exe app.main:app --host 127.0.0.1 --port 8000 --reload
```

---

## 📖 Interactive API Documentation

Once the server is running, explore and test the endpoints via interactive OpenAPI Swagger UI:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **OpenAPI Schema JSON**: [http://localhost:8000/api/v1/openapi.json](http://localhost:8000/api/v1/openapi.json)

---

## 📡 REST API Endpoints

All endpoints are prefixed with `/api/v1` and return JSON compatible with the frontend TypeScript interfaces:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/health` | Service and database health check (`UP`/`DOWN`). |
| `GET` | `/api/v1/wings` | Retrieve all 5 museum wings with exhibit counts. |
| `GET` | `/api/v1/exhibits` | Retrieve all 30 exhibits. Supports `?wingId=` and `?search=`. |
| `GET` | `/api/v1/exhibits/{id}` | Retrieve details of a specific exhibit by ID. |
| `GET` | `/api/v1/trails` | Retrieve all preset museum trails with ordered stop IDs. |

---

## 🧪 Running Automated Tests

Run the full automated test suite with pytest:
```powershell
.\.venv\Scripts\pytest.exe -v
```

All 12 automated unit and integration tests execute against an isolated database fixture covering:
- Database connectivity & schema creation
- Exact seed counts (5 wings, 30 exhibits, 3 trails)
- Seeding idempotency
- Wing listing & curatorial display order
- Exhibit listing, wing filtering, search, and detail lookup
- Trail listing & stop order sequencing
- Health check endpoint
- CORS preflight headers
