from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from typing import List, Optional
from app.api.deps import get_db
from app.models.bill import MandiBill
from app.schemas.bill import MandiBillCreate, MandiBillUpdate, MandiBillResponse
from app.services.excel_service import ExcelExportService

router = APIRouter()


@router.get("/next-receipt-no", response_model=dict)
def get_next_receipt_number(db: Session = Depends(get_db)):
    """Get the next sequential receipt number."""
    max_no = db.query(func.max(MandiBill.receipt_no)).scalar()
    next_no = (max_no or 0) + 1
    return {"next_receipt_no": next_no}


@router.get("/export/excel")
def export_all_bills_to_excel(
    search: Optional[str] = Query(None, description="Optional search filter"),
    date: Optional[str] = Query(None, description="Optional date filter"),
    db: Session = Depends(get_db),
):
    """Export complete bill history with both BILL SUMMARY and ITEM DETAILS into Excel."""
    query = db.query(MandiBill)

    if date:
        query = query.filter(MandiBill.bill_date == date)

    if search:
        search_term = f"%{search.strip()}%"
        if search.strip().isdigit():
            query = query.filter(
                or_(
                    MandiBill.receipt_no == int(search.strip()),
                    MandiBill.farmer_name.ilike(search_term),
                    MandiBill.village.ilike(search_term),
                )
            )
        else:
            query = query.filter(
                or_(
                    MandiBill.farmer_name.ilike(search_term),
                    MandiBill.village.ilike(search_term),
                    MandiBill.account_no.ilike(search_term),
                )
            )

    bills = query.order_by(MandiBill.receipt_no.asc()).all()

    excel_stream = ExcelExportService.export_all_bills_excel(bills)

    filename = "MAB_TRADERS_Billing_History.xlsx"
    headers = {
        "Content-Disposition": f'attachment; filename="{filename}"',
        "Access-Control-Expose-Headers": "Content-Disposition",
    }
    return StreamingResponse(
        excel_stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers=headers,
    )


@router.get("/", response_model=List[MandiBillResponse])
def list_bills(
    search: Optional[str] = Query(None, description="Search by farmer name, village, or receipt no"),
    date: Optional[str] = Query(None, description="Filter by date YYYY-MM-DD or DD/MM/YYYY"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """List and search mandi billing records."""
    query = db.query(MandiBill)

    if date:
        query = query.filter(MandiBill.bill_date == date)

    if search:
        search_term = f"%{search.strip()}%"
        # Check if search is a number for receipt_no
        if search.strip().isdigit():
            query = query.filter(
                or_(
                    MandiBill.receipt_no == int(search.strip()),
                    MandiBill.farmer_name.ilike(search_term),
                    MandiBill.village.ilike(search_term),
                )
            )
        else:
            query = query.filter(
                or_(
                    MandiBill.farmer_name.ilike(search_term),
                    MandiBill.village.ilike(search_term),
                    MandiBill.account_no.ilike(search_term),
                )
            )

    bills = query.order_by(MandiBill.receipt_no.desc()).offset(skip).limit(limit).all()
    return bills


@router.get("/{id}", response_model=MandiBillResponse)
def get_bill(id: int, db: Session = Depends(get_db)):
    """Get single bill details by ID."""
    bill = db.query(MandiBill).filter(MandiBill.id == id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="पावती सापडली नाही (Bill not found)")
    return bill


@router.post("/", response_model=MandiBillResponse)
def create_bill(bill_in: MandiBillCreate, db: Session = Depends(get_db)):
    """Save a new Mandi Bill."""
    receipt_no = bill_in.receipt_no
    if not receipt_no:
        max_no = db.query(func.max(MandiBill.receipt_no)).scalar()
        receipt_no = (max_no or 0) + 1
    else:
        # Check if receipt_no already exists
        existing = db.query(MandiBill).filter(MandiBill.receipt_no == receipt_no).first()
        if existing:
            # Auto-assign next available number
            max_no = db.query(func.max(MandiBill.receipt_no)).scalar()
            receipt_no = (max_no or 0) + 1

    bill = MandiBill(
        receipt_no=receipt_no,
        bill_date=bill_in.bill_date,
        farmer_name=bill_in.farmer_name.strip(),
        account_no=bill_in.account_no.strip() if bill_in.account_no else "",
        village=bill_in.village.strip() if bill_in.village else "",
        items=bill_in.items,
        expenses=bill_in.expenses,
        total_pishvi=bill_in.total_pishvi,
        total_vajan=bill_in.total_vajan,
        gross_amount=bill_in.gross_amount,
        total_deductions=bill_in.total_deductions,
        net_payable=bill_in.net_payable,
        notes=bill_in.notes,
    )
    db.add(bill)
    db.commit()
    db.refresh(bill)
    return bill


@router.put("/{id}", response_model=MandiBillResponse)
def update_bill(id: int, bill_in: MandiBillUpdate, db: Session = Depends(get_db)):
    """Update an existing bill."""
    bill = db.query(MandiBill).filter(MandiBill.id == id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="पावती सापडली नाही (Bill not found)")

    update_data = bill_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(bill, field, val)

    db.commit()
    db.refresh(bill)
    return bill


@router.delete("/{id}", response_model=dict)
def delete_bill(id: int, db: Session = Depends(get_db)):
    """Delete a bill record."""
    bill = db.query(MandiBill).filter(MandiBill.id == id).first()
    if not bill:
        raise HTTPException(status_code=404, detail="पावती सापडली नाही (Bill not found)")

    db.delete(bill)
    db.commit()
    return {"status": "success", "message": f"पावती क्र. {bill.receipt_no} यशस्वीरीत्या हटविली."}
