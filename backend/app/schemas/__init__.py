"""Pydantic schemas for request validation and response serialization."""
from app.schemas.wing import MuseumWingBase, MuseumWingResponse
from app.schemas.exhibit import Coords, ExhibitResponse
from app.schemas.trail import TrailStopResponse, MuseumTrailResponse
from app.schemas.health import HealthResponse

__all__ = [
    "MuseumWingBase",
    "MuseumWingResponse",
    "Coords",
    "ExhibitResponse",
    "TrailStopResponse",
    "MuseumTrailResponse",
    "HealthResponse",
]
