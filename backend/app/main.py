import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.core.config import settings
from app.database.session import init_db, SessionLocal
from app.services.seed_service import seed_museum_data
from app.routers import health_router, wings_router, exhibits_router, trails_router, auth_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("internet_museum")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle event handler for database initialization and initial data seeding."""
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}...")
    try:
        init_db()
        # Seed initial data idempotently on startup
        with SessionLocal() as db:
            seed_museum_data(db)
    except Exception as e:
        logger.error(f"Database initialization/seeding warning: {e}")
        logger.info("Application will continue running; ensure database connection parameters are configured.")

    yield
    logger.info("Shutting down Internet Museum API...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="REST API backend for the Internet Museum — A Curated Digital Archive & Interactive Exhibition",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Configure Cross-Origin Resource Sharing (CORS) for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(wings_router, prefix=settings.API_V1_STR)
app.include_router(exhibits_router, prefix=settings.API_V1_STR)
app.include_router(trails_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)



@app.api_route("/", methods=["GET", "HEAD"], include_in_schema=False)
def root():
    """Redirect root access to interactive OpenAPI Swagger documentation."""
    return RedirectResponse(url="/docs")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
