from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import extract
from uuid import UUID
from datetime import date, timedelta
from api.database import get_db
from api.models.debt import Debt
from api.models.transaction import Transaction
from api.schemas.debt import DebtCreate, DebtUpdate, DebtResponse
from api.core.dependencies import get_current_user
from api.models.user import User

router = APIRouter(prefix="/debts", tags=["debts"])

def is_payment_due(debt: Debt) -> bool:
    today = date.today()
    if not debt.last_payment_date:
        return True
    if debt.regularity == "weekly":
        return (today - debt.last_payment_date).days >= 7
    elif debt.regularity == "biweekly":
        return (today - debt.last_payment_date).days >= 14
    else:
        last = debt.last_payment_date
        next_payment = date(last.year + (last.month // 12), (last.month % 12) + 1, last.day)
        return today >= next_payment

@router.post("/process-payments")
def process_payments(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    debts = db.query(Debt).filter(Debt.user_id == current_user.id).all()
    processed = []

    for debt in debts:
        if float(debt.remaining_amount) <= 0:
            continue
        if is_payment_due(debt):
            payment = min(float(debt.monthly_payment), float(debt.remaining_amount))
            debt.remaining_amount = float(debt.remaining_amount) - payment  # type: ignore
            debt.last_payment_date = date.today()  # type: ignore

            transaction = Transaction(
                user_id=current_user.id,
                type="expense",
                amount=payment,
            )
            db.add(transaction)
            processed.append(debt.name)

    db.commit()
    return {"processed": processed}

@router.get("/", response_model=list[DebtResponse])
def get_debts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    debts = db.query(Debt).filter(Debt.user_id == current_user.id).all()
    return [DebtResponse.from_orm_with_progress(d) for d in debts]

@router.post("/", response_model=DebtResponse)
def create_debt(data: DebtCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    debt = Debt(**data.model_dump(), user_id=current_user.id)
    db.add(debt)
    db.commit()
    db.refresh(debt)
    return DebtResponse.from_orm_with_progress(debt)

@router.patch("/{debt_id}", response_model=DebtResponse)
def update_debt(debt_id: UUID, data: DebtUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    debt = db.query(Debt).filter(Debt.id == debt_id, Debt.user_id == current_user.id).first()
    if not debt:
        raise HTTPException(status_code=404, detail="Debt not found")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(debt, key, value)
    db.commit()
    db.refresh(debt)
    return DebtResponse.from_orm_with_progress(debt)

@router.delete("/{debt_id}")
def delete_debt(debt_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    debt = db.query(Debt).filter(Debt.id == debt_id, Debt.user_id == current_user.id).first()
    if not debt:
        raise HTTPException(status_code=404, detail="Debt not found")
    db.delete(debt)
    db.commit()
    return {"message": "Debt deleted"}