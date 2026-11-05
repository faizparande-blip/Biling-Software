from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PartyBase(BaseModel):
    party_type: str  # 'farmer', 'buyer', 'broker'
    name: str
    father_or_firm_name: Optional[str] = None
    phone: Optional[str] = None
    village_or_city: Optional[str] = None
    address: Optional[str] = None
    gstin: Optional[str] = None
    mandi_license_no: Optional[str] = None
    bank_account_no: Optional[str] = None
    bank_ifsc: Optional[str] = None
    opening_balance: Optional[float] = 0.0


class PartyCreate(PartyBase):
    pass


class PartyUpdate(BaseModel):
    name: Optional[str] = None
    father_or_firm_name: Optional[str] = None
    phone: Optional[str] = None
    village_or_city: Optional[str] = None
    address: Optional[str] = None
    gstin: Optional[str] = None
    mandi_license_no: Optional[str] = None
    bank_account_no: Optional[str] = None
    bank_ifsc: Optional[str] = None
    is_active: Optional[bool] = None


class PartyResponse(PartyBase):
    id: int
    current_balance: float
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True
