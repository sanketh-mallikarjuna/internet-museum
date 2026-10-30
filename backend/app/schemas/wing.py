from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class MuseumWingBase(BaseModel):
    id: str
    name: str
    tagline: str
    description: str
    accent_color: str = Field(alias="accentColor")
    icon: str
    display_order: int = Field(default=0, alias="displayOrder")

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
        serialize_by_alias=True,
    )


class MuseumWingResponse(MuseumWingBase):
    exhibit_count: Optional[int] = Field(default=None, alias="exhibitCount")
