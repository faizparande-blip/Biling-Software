from fastapi import APIRouter
from typing import List
from app.schemas.auction import LotEntryCreate, LotEntryResponse

router = APIRouter()


@router.get("/lots", response_model=List[LotEntryResponse])
def list_lots():
    """List mandi lots / arrival dheris."""
    return []


@router.post("/lots", response_model=LotEntryResponse)
def create_lot(lot: LotEntryCreate):
    """Record an arrival or auction lot."""
    return {
        "id": 1,
        "lot_number": lot.lot_number,
        "farmer_id": lot.farmer_id,
        "buyer_id": lot.buyer_id,
        "commodity_id": lot.commodity_id,
        "bags_count": lot.bags_count,
        "gross_weight": lot.gross_weight,
        "tare_weight": lot.tare_weight,
        "net_weight": lot.net_weight,
        "rate_per_quintal": lot.rate_per_quintal,
        "status": lot.status or "auctioned",
        "notes": lot.notes,
        "entry_date": "2026-11-05T10:00:00Z",
        "created_at": "2026-11-05T10:00:00Z"
    }
