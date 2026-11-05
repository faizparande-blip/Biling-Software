from fastapi import APIRouter
from typing import List
from app.schemas.commodity import CommodityCreate, CommodityResponse

router = APIRouter()


@router.get("/", response_model=List[CommodityResponse])
def list_commodities():
    """List commodities / crops (e.g., Wheat, Mustard, Paddy)."""
    return []


@router.post("/", response_model=CommodityResponse)
def create_commodity(commodity: CommodityCreate):
    """Add a new commodity."""
    return {
        "id": 1,
        "name": commodity.name,
        "local_name": commodity.local_name,
        "standard_unit": commodity.standard_unit,
        "bag_weight_kg": commodity.bag_weight_kg,
        "mandi_tax_rate": commodity.mandi_tax_rate,
        "cess_rate": commodity.cess_rate,
        "commission_rate": commodity.commission_rate,
        "is_active": True,
        "created_at": "2026-11-05T10:00:00Z"
    }
