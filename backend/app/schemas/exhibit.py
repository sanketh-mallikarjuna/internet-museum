from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, model_validator


class Coords(BaseModel):
    x: float
    y: float


class ExhibitResponse(BaseModel):
    id: str
    title: str
    url: str
    year: Optional[int] = None
    author: Optional[str] = None
    wing_id: str = Field(alias="wingId")
    tagline: str
    curator_notes: str = Field(alias="curatorNotes")
    tags: List[str] = Field(default_factory=list)
    interaction_level: str = Field(default="interactive", alias="interactionLevel")
    thumbnail_url: Optional[str] = Field(default=None, alias="thumbnailUrl")
    is_curator_pick: Optional[bool] = Field(default=False, alias="isCuratorPick")
    coords: Optional[Coords] = None

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
        serialize_by_alias=True,
    )

    @model_validator(mode="before")
    @classmethod
    def convert_orm_model(cls, data: any) -> any:
        if hasattr(data, "__dict__"):
            # Check if tags is a list of ExhibitTag objects
            raw_tags = getattr(data, "tags", [])
            tag_list = []
            for t in raw_tags:
                if hasattr(t, "tag"):
                    tag_list.append(t.tag)
                elif isinstance(t, str):
                    tag_list.append(t)

            # Check coords
            coord_x = getattr(data, "coord_x", None)
            coord_y = getattr(data, "coord_y", None)
            coords_obj = None
            if coord_x is not None and coord_y is not None:
                coords_obj = {"x": coord_x, "y": coord_y}

            return {
                "id": getattr(data, "id", None),
                "title": getattr(data, "title", None),
                "url": getattr(data, "url", None),
                "year": getattr(data, "year_established", None),
                "author": getattr(data, "author", None),
                "wingId": getattr(data, "wing_id", None),
                "tagline": getattr(data, "tagline", None),
                "curatorNotes": getattr(data, "curator_notes", None),
                "tags": tag_list,
                "interactionLevel": getattr(data, "interaction_level", "interactive"),
                "thumbnailUrl": getattr(data, "thumbnail_url", None),
                "isCuratorPick": getattr(data, "is_curator_pick", False),
                "coords": coords_obj,
            }
        return data
