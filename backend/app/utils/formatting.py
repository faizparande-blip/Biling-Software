"""Currency, date, and invoice formatting utilities."""
from datetime import datetime


def format_currency(amount: float) -> str:
    """Format decimal as INR currency string."""
    return f"₹{amount:,.2f}"


def format_date_ist(dt: datetime) -> str:
    """Format datetime object into standard Indian format DD-MM-YYYY."""
    if not dt:
        return ""
    return dt.strftime("%d-%m-%Y")


def generate_bill_series(prefix: str, sequence_no: int) -> str:
    """Generate invoice serial number (e.g. MAB/J/2026/001)."""
    current_year = datetime.now().year
    return f"MAB/{prefix.upper()}/{current_year}/{sequence_no:04d}"
