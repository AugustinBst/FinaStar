from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class UserCreate(BaseModel):
    pseudo: str
    password: str
    age: int | None = None
    currency: str = "EUR"

class UserLogin(BaseModel):
    pseudo: str
    password: str

class UserResponse(BaseModel):
    id: UUID
    pseudo: str
    age: int | None
    currency: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str