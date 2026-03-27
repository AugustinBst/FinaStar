from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from decimal import Decimal

class TransactionCreate(BaseModel):
    type: str
    amount: Decimal
    goal_id: UUID | None = None
    category_id: UUID | None = None

class TransactionResponse(BaseModel):
    id: UUID
    user_id: UUID
    type: str
    amount: Decimal
    goal_id: UUID | None
    category_id: UUID | None
    created_at: datetime

    class Config:
        from_attributes = True