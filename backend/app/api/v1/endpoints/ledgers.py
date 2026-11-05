from fastapi import APIRouter
from typing import List
from app.schemas.ledger import LedgerEntryCreate, LedgerEntryResponse

router = APIRouter()


@router.get("/", response_model=List[LedgerEntryResponse])
def list_ledger_entries():
    """List ledger accounts / khata entries."""
    return []


@router.post("/", response_model=LedgerEntryResponse)
def create_ledger_entry(entry: LedgerEntryCreate):
    """Post a debit/credit payment or receipt voucher."""
    return {
        "id": 1,
        "voucher_number": entry.voucher_number,
        "party_id": entry.party_id,
        "entry_type": entry.entry_type,
        "payment_mode": entry.payment_mode or "cash",
        "reference_bill_id": entry.reference_bill_id,
        "amount": entry.amount,
        "running_balance": entry.amount,
        "narration": entry.narration,
        "entry_date": "2026-11-05T10:00:00Z",
        "created_at": "2026-11-05T10:00:00Z"
    }
