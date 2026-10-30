from sqlalchemy import Column, String, Text, Integer, Boolean, DateTime, ForeignKey, UniqueConstraint, func
from sqlalchemy.orm import relationship
from app.database.base import Base


class MuseumTrail(Base):
    __tablename__ = "museum_trails"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    curator_name = Column(String(128), nullable=False)
    estimated_minutes = Column(Integer, nullable=True)
    is_staff_pick = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    tags = relationship("TrailTag", back_populates="trail", cascade="all, delete-orphan", lazy="joined")
    stops = relationship("TrailStop", back_populates="trail", cascade="all, delete-orphan", order_by="TrailStop.stop_order", lazy="joined")

    def __repr__(self) -> str:
        return f"<MuseumTrail(id={self.id}, title={self.title})>"


class TrailTag(Base):
    __tablename__ = "trail_tags"

    trail_id = Column(String(64), ForeignKey("museum_trails.id", ondelete="CASCADE"), primary_key=True)
    tag = Column(String(64), primary_key=True, index=True)

    trail = relationship("MuseumTrail", back_populates="tags")

    def __repr__(self) -> str:
        return f"<TrailTag({self.trail_id}: {self.tag})>"


class TrailStop(Base):
    __tablename__ = "trail_stops"

    id = Column(Integer, primary_key=True, autoincrement=True)
    trail_id = Column(String(64), ForeignKey("museum_trails.id", ondelete="CASCADE"), nullable=False, index=True)
    exhibit_id = Column(String(64), ForeignKey("exhibits.id", ondelete="CASCADE"), nullable=False, index=True)
    stop_order = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("trail_id", "stop_order", name="uk_trail_stop_order"),
    )

    # Relationships
    trail = relationship("MuseumTrail", back_populates="stops")
    exhibit = relationship("Exhibit", back_populates="trail_stops", lazy="joined")

    def __repr__(self) -> str:
        return f"<TrailStop(trail={self.trail_id}, exhibit={self.exhibit_id}, order={self.stop_order})>"
