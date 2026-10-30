"""API Routers package."""
from app.routers.health import router as health_router
from app.routers.wings import router as wings_router
from app.routers.exhibits import router as exhibits_router
from app.routers.trails import router as trails_router

__all__ = [
    "health_router",
    "wings_router",
    "exhibits_router",
    "trails_router",
]
