from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import extract, func
from datetime import datetime
from api.database import get_db
from api.models.transaction import Transaction
from api.models.monthly_income import MonthlyIncome
from api.models.debt import Debt
from api.core.dependencies import get_current_user
from api.models.user import User

router = APIRouter(prefix="/overview", tags=["overview"])

@router.get("/")
def get_overview(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    now = datetime.now()
    month = now.month
    year = now.year

    total_deposits = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "deposit"
    ).scalar() or 0

    total_expenses = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense"
    ).scalar() or 0

    monthly_expenses = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense",
        extract("month", Transaction.created_at) == month,
        extract("year", Transaction.created_at) == year
    ).scalar() or 0

    monthly_deposits = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "deposit",
        extract("month", Transaction.created_at) == month,
        extract("year", Transaction.created_at) == year
    ).scalar() or 0

    current_income = db.query(MonthlyIncome).filter(
        MonthlyIncome.user_id == current_user.id,
        extract("month", MonthlyIncome.month) == month,
        extract("year", MonthlyIncome.month) == year
    ).first()

    total_monthly_debt = db.query(func.sum(Debt.monthly_payment)).filter(
        Debt.user_id == current_user.id
    ).scalar() or 0

    balance = float(total_deposits) - float(total_expenses)
    monthly_savings = float(monthly_deposits) - float(monthly_expenses)

    return {
        "balance": round(balance, 2),
        "monthly_expenses": round(float(monthly_expenses), 2),
        "monthly_deposits": round(float(monthly_deposits), 2),
        "monthly_savings": round(monthly_savings, 2),
        "monthly_income": float(current_income.amount) if current_income else None,
        "total_monthly_debt_payments": round(float(total_monthly_debt), 2),
    }