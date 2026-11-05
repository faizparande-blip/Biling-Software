from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class LotEntryBase(BaseModel):
    lot_number: str
    farmer_id: int
    buyer_id: Optional[int] = None
    commodity_id: int
    bags_count: int = 0
    gross_weight: float = 0.0
    tare_weight: float = 0.0
    net_weight: float = 0.0
    rate_per_quintal: float = 0.0
    status: Optional[str] = "auctioned"
    notes: Optional[str] = None


class LotEntryCreate(LotEntryBase):
    pass


class LotEntryResponse(LotEntryBase):
    id: int
    entry_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True
