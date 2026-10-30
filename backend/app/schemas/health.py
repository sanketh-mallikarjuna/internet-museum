from datetime import datetime, timezone
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = "UP"
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    database: str = "UP"
    version: str = "1.0.0"
