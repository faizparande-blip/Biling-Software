from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from app.schemas.party import PartyCreate, PartyResponse

router = APIRouter()


@router.get("/", response_model=List[PartyResponse])
def list_parties(party_type: Optional[str] = Query(None, description="farmer, buyer, broker")):
    """List mandi parties (farmers, buyers, brokers)."""
    return []


@router.post("/", response_model=PartyResponse)
def create_party(party: PartyCreate):
    """Create a new mandi party."""
    return {
        "id": 1,
        "party_type": party.party_type,
        "name": party.name,
        "father_or_firm_name": party.father_or_firm_name,
        "phone": party.phone,
        "village_or_city": party.village_or_city,
        "address": party.address,
        "gstin": party.gstin,
        "mandi_license_no": party.mandi_license_no,
        "bank_account_no": party.bank_account_no,
        "bank_ifsc": party.bank_ifsc,
        "opening_balance": party.opening_balance or 0.0,
        "current_balance": party.opening_balance or 0.0,
        "is_active": True,
        "created_at": "2026-11-05T10:00:00Z"
    }
