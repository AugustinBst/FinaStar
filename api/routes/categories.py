from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from api.database import get_db
from api.models.category import Category
from api.schemas.category import CategoryCreate, CategoryResponse
from api.core.dependencies import get_current_user
from api.models.user import User

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Category).all()

@router.post("/", response_model=CategoryResponse)
def create_category(data: CategoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    category = Category(**data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category