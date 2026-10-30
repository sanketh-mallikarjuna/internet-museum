from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.wing import MuseumWing
from app.schemas.wing import MuseumWingResponse

router = APIRouter(prefix="/wings", tags=["Museum Wings"])


@router.get("", response_model=List[MuseumWingResponse])
def get_wings(db: Session = Depends(get_db)):
    """Retrieve all museum wings ordered by their curatorial display sequence."""
    wings = db.query(MuseumWing).order_by(MuseumWing.display_order.asc()).all()

    # Populate exhibit count for each wing
    results = []
    for wing in wings:
        response_item = MuseumWingResponse.model_validate(wing)
        response_item.exhibit_count = len(wing.exhibits)
        results.append(response_item)

    return results
