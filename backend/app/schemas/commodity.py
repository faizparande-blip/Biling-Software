from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CommodityBase(BaseModel):
    name: str
    local_name: Optional[str] = None
    standard_unit: Optional[str] = "Quintal"
    bag_weight_kg: Optional[float] = 50.0
    mandi_tax_rate: Optional[float] = 1.0
    cess_rate: Optional[float] = 0.5
    commission_rate: Optional[float] = 2.5


class CommodityCreate(CommodityBase):
    pass


class CommodityUpdate(BaseModel):
    name: Optional[str] = None
    local_name: Optional[str] = None
    standard_unit: Optional[str] = None
    bag_weight_kg: Optional[float] = None
    mandi_tax_rate: Optional[float] = None
    cess_rate: Optional[float] = None
    commission_rate: Optional[float] = None
    is_active: Optional[bool] = None


class CommodityResponse(CommodityBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
