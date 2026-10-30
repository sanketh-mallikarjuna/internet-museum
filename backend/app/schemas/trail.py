from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator


class TrailStopResponse(BaseModel):
    id: int
    trail_id: str = Field(alias="trailId")
    exhibit_id: str = Field(alias="exhibitId")
    stop_order: int = Field(alias="stopOrder")
    exhibit_title: Optional[str] = Field(default=None, alias="exhibitTitle")

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
        serialize_by_alias=True,
    )

    @model_validator(mode="before")
    @classmethod
    def convert_orm_model(cls, data: any) -> any:
        if hasattr(data, "__dict__"):
            exhibit_title = None
            if hasattr(data, "exhibit") and data.exhibit:
                exhibit_title = getattr(data.exhibit, "title", None)

            return {
                "id": getattr(data, "id", None),
                "trailId": getattr(data, "trail_id", None),
                "exhibitId": getattr(data, "exhibit_id", None),
                "stopOrder": getattr(data, "stop_order", 0),
                "exhibitTitle": exhibit_title,
            }
        return data


class MuseumTrailResponse(BaseModel):
    id: str
    title: str
    description: str
    curator_name: str = Field(alias="curatorName")
    exhibit_ids: List[str] = Field(default_factory=list, alias="exhibitIds")
    estimated_minutes: Optional[int] = Field(default=None, alias="estimatedMinutes")
    tags: List[str] = Field(default_factory=list)
    is_staff_pick: Optional[bool] = Field(default=False, alias="isStaffPick")
    created_at: Optional[str] = Field(default=None, alias="createdAt")
    stops: Optional[List[TrailStopResponse]] = Field(default_factory=list)

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
        serialize_by_alias=True,
    )

    @model_validator(mode="before")
    @classmethod
    def convert_orm_model(cls, data: any) -> any:
        if hasattr(data, "__dict__"):
            # Extract tags
            raw_tags = getattr(data, "tags", [])
            tag_list = []
            for t in raw_tags:
                if hasattr(t, "tag"):
                    tag_list.append(t.tag)
                elif isinstance(t, str):
                    tag_list.append(t)

            # Extract stops and ordered exhibitIds
            raw_stops = getattr(data, "stops", [])
            sorted_stops = sorted(raw_stops, key=lambda s: getattr(s, "stop_order", 0))
            exhibit_ids = [s.exhibit_id for s in sorted_stops if hasattr(s, "exhibit_id")]

            created_at_val = getattr(data, "created_at", None)
            created_at_str = created_at_val.isoformat() if created_at_val else None

            return {
                "id": getattr(data, "id", None),
                "title": getattr(data, "title", None),
                "description": getattr(data, "description", None),
                "curatorName": getattr(data, "curator_name", None),
                "exhibitIds": exhibit_ids,
                "estimatedMinutes": getattr(data, "estimated_minutes", None),
                "tags": tag_list,
                "isStaffPick": getattr(data, "is_staff_pick", False),
                "createdAt": created_at_str,
                "stops": sorted_stops,
            }
        return data
