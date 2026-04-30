from sqlalchemy import Column, String, Numeric, DateTime
from api.database import Base
import datetime
import uuid

class CryptoHistory(Base):
    __tablename__ = "crypto_history"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    crypto_name = Column(String, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    consulted_at = Column(DateTime, default=datetime.datetime.utcnow)