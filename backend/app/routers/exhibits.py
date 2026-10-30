from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database.session import get_db
from app.models.exhibit import Exhibit
from app.schemas.exhibit import ExhibitResponse

router = APIRouter(prefix="/exhibits", tags=["Exhibits"])


@router.get("", response_model=List[ExhibitResponse])
def get_exhibits(
    wing_id: Optional[str] = Query(None, alias="wingId", description="Filter by museum wing ID"),
    search: Optional[str] = Query(None, description="Search term for title, tagline, or author"),
    db: Session = Depends(get_db),
):
    """
    Retrieve all exhibits with optional filtering by wingId or search term.
    Returns JSON structures compatible with the frontend Exhibit interface.
    """
    query = db.query(Exhibit)

    if wing_id:
        query = query.filter(Exhibit.wing_id == wing_id)

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Exhibit.title.ilike(search_pattern),
                Exhibit.tagline.ilike(search_pattern),
                Exhibit.author.ilike(search_pattern),
            )
        )

    exhibits = query.order_by(Exhibit.id.asc()).all()
    return [ExhibitResponse.model_validate(e) for e in exhibits]


@router.get("/{exhibit_id}", response_model=ExhibitResponse)
def get_exhibit_by_id(exhibit_id: str, db: Session = Depends(get_db)):
    """Retrieve full details of a single exhibit by its unique identifier."""
    exhibit = db.query(Exhibit).filter(Exhibit.id == exhibit_id).first()
    if not exhibit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Exhibit with ID '{exhibit_id}' not found.",
        )
    return ExhibitResponse.model_validate(exhibit)
