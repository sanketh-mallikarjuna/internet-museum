from sqlalchemy import Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database.base import Base


class Exhibit(Base):
    __tablename__ = "exhibits"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    url = Column(String(1024), nullable=False)
    year_established = Column(Integer, nullable=True)
    author = Column(String(255), nullable=True)
    wing_id = Column(String(32), ForeignKey("museum_wings.id", onupdate="CASCADE"), nullable=False, index=True)
    tagline = Column(String(512), nullable=False)
    curator_notes = Column(Text, nullable=False)
    interaction_level = Column(String(32), default="interactive", nullable=False)
    thumbnail_url = Column(String(1024), nullable=True)
    is_curator_pick = Column(Boolean, default=False, nullable=False)
    coord_x = Column(Float, nullable=True)
    coord_y = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    wing = relationship("MuseumWing", back_populates="exhibits")
    tags = relationship("ExhibitTag", back_populates="exhibit", cascade="all, delete-orphan", lazy="joined")
    trail_stops = relationship("TrailStop", back_populates="exhibit", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Exhibit(id={self.id}, title={self.title})>"


class ExhibitTag(Base):
    __tablename__ = "exhibit_tags"

    exhibit_id = Column(String(64), ForeignKey("exhibits.id", ondelete="CASCADE"), primary_key=True)
    tag = Column(String(64), primary_key=True, index=True)

    exhibit = relationship("Exhibit", back_populates="tags")

    def __repr__(self) -> str:
        return f"<ExhibitTag({self.exhibit_id}: {self.tag})>"
