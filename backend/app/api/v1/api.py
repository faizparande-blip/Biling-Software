from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    parties,
    commodities,
    auctions,
    bills,
    ledgers,
    reports,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(parties.router, prefix="/parties", tags=["Parties (Farmers & Buyers)"])
api_router.include_router(commodities.router, prefix="/commodities", tags=["Commodities"])
api_router.include_router(auctions.router, prefix="/auctions", tags=["Auctions & Arrivals"])
api_router.include_router(bills.router, prefix="/bills", tags=["Mandi Billing (J-Form / I-Form)"])
api_router.include_router(ledgers.router, prefix="/ledgers", tags=["Ledger & Accounts"])
api_router.include_router(reports.router, prefix="/reports", tags=["Reports & Excel Export"])
