from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from uuid import UUID
from api.database import get_db
from api.models.goal import Goal
from api.schemas.goal import GoalCreate, GoalUpdate, GoalResponse
from api.core.dependencies import get_current_user
from api.models.user import User

router = APIRouter(prefix="/goals", tags=["goals"])

@router.get("/", response_model=list[GoalResponse])
def get_goals(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goals = db.query(Goal).filter(Goal.user_id == current_user.id).all()
    return [GoalResponse.from_orm_with_progress(g) for g in goals]

@router.post("/", response_model=GoalResponse)
def create_goal(goal: GoalCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_goal = Goal(**goal.model_dump(), user_id=current_user.id)
    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)
    return GoalResponse.from_orm_with_progress(new_goal)

@router.patch("/{goal_id}", response_model=GoalResponse)
def update_goal(goal_id: UUID, data: GoalUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="id doesn't exist")
    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(goal, key, value)
    db.commit()
    db.refresh(goal)
    return GoalResponse.from_orm_with_progress(goal)

@router.delete("/{goal_id}")
def delete_goal(goal_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    goal = db.query(Goal).filter(Goal.id == goal_id, Goal.user_id == current_user.id).first()
    if not goal:
        raise HTTPException(status_code=404, detail="id doesn't exist")
    db.delete(goal)
    db.commit()
    return {"Goal deleted"}