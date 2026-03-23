from sqlalchemy import Column, String, Date, Numeric, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from api.database import Base
import uuid

class Goal(Base):
    __tablename__ = "goals"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    emoji = Column(String, nullable=True)
    name = Column(String, nullable=False)
    deadline = Column(Date, nullable=True)
    target_price = Column(Numeric, nullable=False)
    amount_saved = Column(Numeric, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())