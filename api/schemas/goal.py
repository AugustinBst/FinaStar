from pydantic import BaseModel
from uuid import UUID
from datetime import date, datetime
from decimal import Decimal

class GoalCreate(BaseModel):
    emoji: str | None = None
    name: str
    deadline: date | None = None
    target_price: Decimal

class GoalUpdate(BaseModel):
    emoji: str | None = None
    name: str | None = None
    deadline: date | None = None
    target_price: Decimal | None = None
    amount_saved: Decimal | None = None

class GoalResponse(BaseModel):
    id: UUID
    user_id: UUID
    emoji: str | None
    name: str
    deadline: date | None
    target_price: Decimal
    amount_saved: Decimal
    progress: float = 0.0
    created_at: datetime

    class Config:
        from_attributes = True

    @classmethod
    def from_orm_with_progress(cls, goal):
        data = cls.model_validate(goal)
        if goal.target_price and goal.target_price > 0:
            data.progress = float(goal.amount_saved / goal.target_price * 100)
        return data