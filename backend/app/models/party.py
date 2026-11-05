from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from datetime import datetime, timezone
from app.core.database import Base


class Party(Base):
    """Parties involved in Mandi trading: Farmers (sellers), Traders (buyers), Brokers."""
    __tablename__ = "parties"

    id = Column(Integer, primary_key=True, index=True)
    party_type = Column(String(20), index=True, nullable=False)  # 'farmer', 'buyer', 'broker'
    name = Column(String(150), index=True, nullable=False)
    father_or_firm_name = Column(String(150), nullable=True)
    phone = Column(String(20), index=True, nullable=True)
    village_or_city = Column(String(100), nullable=True)
    address = Column(Text, nullable=True)
    gstin = Column(String(20), nullable=True)
    mandi_license_no = Column(String(50), nullable=True)
    bank_account_no = Column(String(50), nullable=True)
    bank_ifsc = Column(String(20), nullable=True)
    opening_balance = Column(Float, default=0.0)
    current_balance = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
