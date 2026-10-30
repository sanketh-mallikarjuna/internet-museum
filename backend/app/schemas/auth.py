from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128, description="Password must be at least 6 characters")
    username: str = Field(..., min_length=2, max_length=64, description="Curator name must be between 2 and 64 characters")
    role: Optional[str] = "curator"
    avatar: Optional[str] = "🏛️"


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, description="Password cannot be empty")


class UserProfile(BaseModel):
    id: str
    email: str
    username: str
    role: str = "curator"
    avatar: Optional[str] = "🏛️"
    is_active: bool = Field(default=True, alias="isActive")
    created_at: Optional[datetime] = Field(default=None, alias="createdAt")

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
        serialize_by_alias=True,
    )


class TokenResponse(BaseModel):
    access_token: str = Field(alias="accessToken")
    token_type: str = Field(default="bearer", alias="tokenType")
    user: UserProfile

    model_config = ConfigDict(
        populate_by_name=True,
        serialize_by_alias=True,
    )
