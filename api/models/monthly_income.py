from sqlalchemy import Column, Numeric, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from api.database import Base
import uuid

class MonthlyIncome(Base):
    __tablename__ = "monthly_income"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    month = Column(Date, nullable=False)
    amount = Column(Numeric, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())