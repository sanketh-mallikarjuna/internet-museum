"""Pydantic schemas for request validation and response serialization."""
from app.schemas.wing import MuseumWingBase, MuseumWingResponse
from app.schemas.exhibit import Coords, ExhibitResponse
from app.schemas.trail import TrailStopResponse, MuseumTrailResponse
from app.schemas.health import HealthResponse
from app.schemas.auth import UserRegister, UserLogin, UserProfile, TokenResponse

__all__ = [
    "MuseumWingBase",
    "MuseumWingResponse",
    "Coords",
    "ExhibitResponse",
    "TrailStopResponse",
    "MuseumTrailResponse",
    "HealthResponse",
    "UserRegister",
    "UserLogin",
    "UserProfile",
    "TokenResponse",
]

