from pydantic import BaseModel
from uuid import UUID

class CategoryCreate(BaseModel):
    name: str
    emoji: str | None = None

class CategoryResponse(BaseModel):
    id: UUID
    name: str
    emoji: str | None

    class Config:
        from_attributes = True