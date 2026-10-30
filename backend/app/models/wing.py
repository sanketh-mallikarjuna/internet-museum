from sqlalchemy import Column, String, Text, Integer, DateTime, func
from sqlalchemy.orm import relationship
from app.database.base import Base


class MuseumWing(Base):
    __tablename__ = "museum_wings"

    id = Column(String(32), primary_key=True, index=True)
    name = Column(String(128), nullable=False)
    tagline = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    accent_color = Column(String(16), nullable=False)
    icon = Column(String(16), nullable=False)
    display_order = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    exhibits = relationship("Exhibit", back_populates="wing", cascade="all, delete-orphan", order_by="Exhibit.id")

    def __repr__(self) -> str:
        return f"<MuseumWing(id={self.id}, name={self.name})>"
