from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime
from decimal import Decimal

class MonthlyIncomeCreate(BaseModel):
    month: date
    amount: Decimal

class MonthlyIncomeResponse(BaseModel):
    id: UUID
    user_id: UUID
    month: date
    amount: Decimal
    created_at: datetime

    class Config:
        from_attributes = True