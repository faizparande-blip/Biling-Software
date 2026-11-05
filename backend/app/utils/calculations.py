"""Mandi standard trade calculations for J-Form (Seller) and I-Form (Buyer)."""
from typing import Dict, Any


def calculate_mandi_line_item(
    weight_quintal: float,
    rate_per_quintal: float,
    bags: int = 0,
    mandi_tax_pct: float = 1.0,
    cess_pct: float = 0.5,
    commission_pct: float = 2.5,
    labour_per_bag: float = 10.0,
    weighing_per_bag: float = 3.0,
) -> Dict[str, float]:
    """Calculate produce value and statutory mandi charges."""
    gross_amount = round(weight_quintal * rate_per_quintal, 2)
    mandi_tax = round((gross_amount * mandi_tax_pct) / 100.0, 2)
    development_cess = round((gross_amount * cess_pct) / 100.0, 2)
    commission = round((gross_amount * commission_pct) / 100.0, 2)
    labour_charges = round(bags * labour_per_bag, 2)
    weighing_charges = round(bags * weighing_per_bag, 2)

    total_buyer_charges = round(mandi_tax + development_cess + commission + labour_charges + weighing_charges, 2)
    buyer_net_payable = round(gross_amount + total_buyer_charges, 2)

    return {
        "gross_amount": gross_amount,
        "mandi_tax": mandi_tax,
        "development_cess": development_cess,
        "commission": commission,
        "labour_charges": labour_charges,
        "weighing_charges": weighing_charges,
        "total_charges": total_buyer_charges,
        "buyer_net_payable": buyer_net_payable,
    }
