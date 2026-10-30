from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.trail import MuseumTrail
from app.schemas.trail import MuseumTrailResponse

router = APIRouter(prefix="/trails", tags=["Museum Trails"])


@router.get("", response_model=List[MuseumTrailResponse])
def get_trails(db: Session = Depends(get_db)):
    """Retrieve all preset museum trails with ordered stop IDs and tags."""
    trails = db.query(MuseumTrail).order_by(MuseumTrail.id.asc()).all()
    return [MuseumTrailResponse.model_validate(t) for t in trails]
