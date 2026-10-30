import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database.session import get_db
from app.schemas.health import HealthResponse
from app.core.config import settings

logger = logging.getLogger(__name__)
router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
def get_health(db: Session = Depends(get_db)):
    """Health check endpoint that verifies server and database status."""
    db_status = "UP"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        logger.warning(f"Database health check query failed: {e}")
        db_status = "DOWN"

    return HealthResponse(
        status="UP",
        timestamp=datetime.now(timezone.utc).isoformat(),
        database=db_status,
        version=settings.VERSION,
    )
