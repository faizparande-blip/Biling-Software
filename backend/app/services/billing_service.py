"""Mandi Billing Service: Handles bill compilation, tax aggregation and balancing."""
from typing import Dict, Any, List


class BillingService:
    @staticmethod
    def prepare_j_form(farmer_data: Dict[str, Any], lots: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Compute and format J-Form (Seller bill) for a farmer."""
        # Baseline service stub for Phase 2 implementation
        return {
            "status": "ready",
            "type": "J-FORM",
            "party": farmer_data,
            "lots": lots,
        }

    @staticmethod
    def prepare_i_form(buyer_data: Dict[str, Any], lots: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Compute and format I-Form (Buyer bill) with APMC fees and commission."""
        # Baseline service stub for Phase 2 implementation
        return {
            "status": "ready",
            "type": "I-FORM",
            "party": buyer_data,
            "lots": lots,
        }
