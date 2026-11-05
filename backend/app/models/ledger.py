from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from datetime import datetime, timezone
from app.core.database import Base


class LedgerEntry(Base):
    """Financial transactions: Khata / Ledger entries, receipts, and payments."""
    __tablename__ = "ledger_entries"

    id = Column(Integer, primary_key=True, index=True)
    voucher_number = Column(String(50), unique=True, index=True, nullable=False)
    party_id = Column(Integer, ForeignKey("parties.id"), nullable=False)
    entry_date = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    entry_type = Column(String(20), nullable=False)  # 'debit', 'credit'
    payment_mode = Column(String(20), default="cash")  # cash, bank_transfer, cheque, upi
    reference_bill_id = Column(Integer, ForeignKey("bills.id"), nullable=True)

    amount = Column(Float, nullable=False)
    running_balance = Column(Float, default=0.0)
    narration = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
