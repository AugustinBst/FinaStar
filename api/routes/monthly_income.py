from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from api.database import get_db
from api.models.monthly_income import MonthlyIncome
from api.schemas.monthly_income import MonthlyIncomeCreate, MonthlyIncomeResponse
from api.core.dependencies import get_current_user
from api.models.user import User

router = APIRouter(prefix="/monthly-income", tags=["monthly-income"])

@router.get("/", response_model=list[MonthlyIncomeResponse])
def get_monthly_income(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(MonthlyIncome).filter(MonthlyIncome.user_id == current_user.id).order_by(MonthlyIncome.month.desc()).all()

@router.post("/", response_model=MonthlyIncomeResponse)
def create_monthly_income(data: MonthlyIncomeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    existing = db.query(MonthlyIncome).filter(
        MonthlyIncome.user_id == current_user.id,
        MonthlyIncome.month == data.month
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Income for this month already exists")
    income = MonthlyIncome(**data.model_dump(), user_id=current_user.id)
    db.add(income)
    db.commit()
    db.refresh(income)
    return income

@router.delete("/{income_id}")
def delete_monthly_income(income_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    income = db.query(MonthlyIncome).filter(MonthlyIncome.id == income_id, MonthlyIncome.user_id == current_user.id).first()
    if not income:
        raise HTTPException(status_code=404, detail="Income not found")
    db.delete(income)
    db.commit()
    return {"message": "Income deleted"}