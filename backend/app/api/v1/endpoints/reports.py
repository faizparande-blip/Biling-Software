from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.services.excel_service import ExcelExportService

router = APIRouter()


@router.get("/summary")
def get_daily_summary():
    """Daily Mandi trading summary."""
    return {
        "total_arrivals_bags": 0,
        "total_sales_amount": 0.0,
        "total_commission": 0.0,
        "total_mandi_tax": 0.0,
    }


@router.get("/export/sales-excel")
def export_sales_excel():
    """Export mandi sales report using openpyxl."""
    sample_data = []
    excel_stream = ExcelExportService.export_sales_report(sample_data, title="Sales Register")
    return StreamingResponse(
        excel_stream,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=MAB_Sales_Report.xlsx"},
    )
