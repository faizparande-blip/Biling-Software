from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from datetime import datetime, timezone
from app.core.database import Base


class Commodity(Base):
    """Agricultural produce items traded in Mandi (e.g., Wheat, Mustard, Paddy, Cotton)."""
    __tablename__ = "commodities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    local_name = Column(String(100), nullable=True)  # Hindi/Local nomenclature
    standard_unit = Column(String(20), default="Quintal")  # Quintal, Bag, KG
    bag_weight_kg = Column(Float, default=50.0)
    mandi_tax_rate = Column(Float, default=1.0)  # in percentage
    cess_rate = Column(Float, default=0.5)        # in percentage
    commission_rate = Column(Float, default=2.5)  # in percentage
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
