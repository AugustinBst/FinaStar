from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime
from decimal import Decimal

class DebtCreate(BaseModel):
    type: str
    name: str
    total_amount: Decimal
    remaining_amount: Decimal
    monthly_payment: Decimal
    regularity: str = "monthly"

class DebtUpdate(BaseModel):
    type: str | None = None
    name: str | None = None
    total_amount: Decimal | None = None
    remaining_amount: Decimal | None = None
    monthly_payment: Decimal | None = None
    regularity: str | None = None

class DebtResponse(BaseModel):
    id: UUID
    user_id: UUID
    type: str
    name: str
    total_amount: Decimal
    remaining_amount: Decimal
    monthly_payment: Decimal
    regularity: str
    last_payment_date: date | None
    progress: float = 0.0
    created_at: datetime

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_with_progress(cls, debt):
        data = cls.model_validate(debt)
        if debt.total_amount and debt.total_amount > 0:
            data.progress = float((1 - debt.remaining_amount / debt.total_amount) * 100)
        return data