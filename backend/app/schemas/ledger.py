from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class LedgerEntryBase(BaseModel):
    voucher_number: str
    party_id: int
    entry_type: str  # 'debit', 'credit'
    payment_mode: Optional[str] = "cash"
    reference_bill_id: Optional[int] = None
    amount: float
    narration: Optional[str] = None


class LedgerEntryCreate(LedgerEntryBase):
    pass


class LedgerEntryResponse(LedgerEntryBase):
    id: int
    entry_date: datetime
    running_balance: float
    created_at: datetime

    class Config:
        from_attributes = True
