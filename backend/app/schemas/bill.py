from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime


class BillItemSchema(BaseModel):
    id: Optional[str] = None
    pishvi: Optional[int] = 0
    vajan: Optional[float] = 0.0
    bhav: Optional[float] = 0.0
    rupaye: Optional[int] = 0
    paise: Optional[int] = 0
    amount: Optional[float] = 0.0


class BillExpensesSchema(BaseModel):
    adat: Optional[float] = 0.0          # अडत
    hamali: Optional[float] = 0.0        # हमाली
    tolai: Optional[float] = 0.0         # तोलाई
    stri_hamali: Optional[float] = 0.0   # स्त्री ह.
    levy: Optional[float] = 0.0          # लेव्ही
    motor_bhada: Optional[float] = 0.0   # मो. भाडा
    warani: Optional[float] = 0.0        # वारणी
    rokh_uchal: Optional[float] = 0.0    # रोख उचल
    bardana: Optional[float] = 0.0       # बारदाना
    itar: Optional[float] = 0.0          # इतर


class MandiBillCreate(BaseModel):
    receipt_no: Optional[int] = None
    bill_date: str
    farmer_name: str
    account_no: Optional[str] = ""
    village: Optional[str] = ""
    items: List[Dict[str, Any]]
    expenses: Dict[str, Any]
    total_pishvi: int = 0
    total_vajan: float = 0.0
    gross_amount: float = 0.0
    total_deductions: float = 0.0
    net_payable: float = 0.0
    notes: Optional[str] = ""


class MandiBillUpdate(BaseModel):
    bill_date: Optional[str] = None
    farmer_name: Optional[str] = None
    account_no: Optional[str] = None
    village: Optional[str] = None
    items: Optional[List[Dict[str, Any]]] = None
    expenses: Optional[Dict[str, Any]] = None
    total_pishvi: Optional[int] = None
    total_vajan: Optional[float] = None
    gross_amount: Optional[float] = None
    total_deductions: Optional[float] = None
    net_payable: Optional[float] = None
    notes: Optional[str] = None


class MandiBillResponse(BaseModel):
    id: int
    receipt_no: int
    bill_date: str
    farmer_name: str
    account_no: Optional[str] = ""
    village: Optional[str] = ""
    items: List[Dict[str, Any]]
    expenses: Dict[str, Any]
    total_pishvi: int
    total_vajan: float
    gross_amount: float
    total_deductions: float
    net_payable: float
    notes: Optional[str] = ""
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
