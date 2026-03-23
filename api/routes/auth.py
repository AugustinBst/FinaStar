from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from api.database import get_db
from api.models import User
from api.schemas import UserCreate, UserLogin, UserResponse, Token
from api.core import hash_password, verify_password, create_access_token
from api.core import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.pseudo == user.pseudo).first()
    if existing:
        raise HTTPException(status_code=400, detail="Pseudo déjà utilisé")
    
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
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    
    token = create_access_token({"sub": str(db_user.id)})
    return {"access_token": token, "token_type": "bearer"}



@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user