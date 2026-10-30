import uuid
from sqlalchemy import Column, String, Boolean, DateTime, func
from app.database.base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(64), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(32), default="curator", nullable=False)
    avatar = Column(String(255), default="🏛️", nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, username={self.username}, role={self.role})>"
