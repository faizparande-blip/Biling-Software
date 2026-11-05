from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from datetime import datetime, timezone
from app.core.database import Base


class MandiBill(Base):
    """Mandi Billing Patti (पावती) Model for M.A.B TRADERS, Solapur."""
    __tablename__ = "mandi_bills"

    id = Column(Integer, primary_key=True, index=True)
    receipt_no = Column(Integer, unique=True, index=True, nullable=False)  # पावती क्र.
    bill_date = Column(String(20), index=True, nullable=False)            # दिनांक
    farmer_name = Column(String(150), index=True, nullable=False)         # मालधनीचे नांव
    account_no = Column(String(50), nullable=True)                       # व. नं. (खाते क्रमांक)
    village = Column(String(100), nullable=True)                          # गांव

    # Dynamic line items: [{pishvi, vajan, bhav, rupaye, paise, amount}]
    items = Column(JSON, nullable=False, default=list)

    # Expenses / Deductions: {adat, hamali, tolai, stri_hamali, levy, motor_bhada, warani, rokh_uchal, bardana, itar}
    expenses = Column(JSON, nullable=False, default=dict)

    # Calculations summary
    total_pishvi = Column(Integer, default=0)        # एकूण पिशवी
    total_vajan = Column(Float, default=0.0)         # एकूण वजन (KG)
    gross_amount = Column(Float, default=0.0)        # एकूण रुपये (Gross)
    total_deductions = Column(Float, default=0.0)    # वजा खर्च
    net_payable = Column(Float, default=0.0)         # एकूण रक्कम (Net Payable)

    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
