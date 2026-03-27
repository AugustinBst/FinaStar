from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import extract
from uuid import UUID
from api.database import get_db
from api.models.transaction import Transaction
from api.models.goal import Goal
from api.schemas.transaction import TransactionCreate, TransactionResponse
from api.core.dependencies import get_current_user
from api.models.user import User

router = APIRouter(prefix="/transactions", tags=["transactions"])

@router.get("/", response_model=list[TransactionResponse])
def get_transactions(
    month: int | None = None,
    year: int | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Transaction).filter(Transaction.user_id == current_user.id)
    if month:
        query = query.filter(extract("month", Transaction.created_at) == month)
    if year:
        query = query.filter(extract("year", Transaction.created_at) == year)
    return query.order_by(Transaction.created_at.desc()).all()

@router.post("/", response_model=TransactionResponse)
def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if data.type not in ["deposit", "expense"]:
        raise HTTPException(status_code=400, detail="Type must be 'deposit' or 'expense'")

    if data.goal_id:
        goal = db.query(Goal).filter(Goal.id == data.goal_id, Goal.user_id == current_user.id).first()
        if not goal:
            raise HTTPException(status_code=404, detail="Goal not found")
        if data.type == "deposit":
            goal.amount_saved = float(str(goal.amount_saved)) + float(str(data.amount)) # type: ignore

    transaction = Transaction(**data.model_dump(), user_id=current_user.id)
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction

@router.delete("/{transaction_id}")
def delete_transaction(
    transaction_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    if transaction.goal_id and transaction.type == "deposit": # type: ignore
        goal = db.query(Goal).filter(Goal.id == transaction.goal_id).first()
        if goal:
            goal.amount_saved = max(0, float(str(goal.amount_saved)) - float(str(transaction.amount)))  # type: ignore

    db.delete(transaction)
    db.commit()
    return {"message": "Transaction deleted"}
