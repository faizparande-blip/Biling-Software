from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from datetime import datetime, timezone
from app.core.database import Base


class LotEntry(Base):
    """Mandi Dheri / Lot Entry for arrivals and auction recording."""
    __tablename__ = "lot_entries"

    id = Column(Integer, primary_key=True, index=True)
    lot_number = Column(String(50), unique=True, index=True, nullable=False)
    entry_date = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    farmer_id = Column(Integer, ForeignKey("parties.id"), nullable=False)
    buyer_id = Column(Integer, ForeignKey("parties.id"), nullable=True)
    commodity_id = Column(Integer, ForeignKey("commodities.id"), nullable=False)

    bags_count = Column(Integer, default=0)
    gross_weight = Column(Float, default=0.0)
    tare_weight = Column(Float, default=0.0)
    net_weight = Column(Float, default=0.0)
    rate_per_quintal = Column(Float, default=0.0)
    status = Column(String(20), default="auctioned")  # arrived, auctioned, weighed, billed
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
