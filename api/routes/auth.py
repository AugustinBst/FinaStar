from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from api.database import get_db
from api.models.user import User
from api.schemas import UserCreate, UserLogin, UserResponse, Token
from api.core import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.pseudo == user.pseudo).first()
    if existing:
        raise HTTPException(status_code=400, detail="Pseudo already used")

    new_user = User(
        pseudo=user.pseudo,
        password_hash=hash_password(user.password),
        age=user.age,
        currency=user.currency
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.pseudo == user.pseudo).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(db_user.id)})
    return {"access_token": token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user

from api.schemas import UserCreate, UserLogin, UserResponse, Token, UserUpdate

@router.patch("/me", response_model=UserResponse)
def update_me(data: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(current_user, key, value)
    db.commit()
    db.refresh(current_user)
    return current_user