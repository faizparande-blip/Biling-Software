"""Excel export service powered by OpenPyXL.
Generates comprehensive two-sheet workbooks for M.A.B TRADERS Billing History.
"""
import io
from typing import List, Any
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter


class ExcelExportService:
    @staticmethod
    def export_all_bills_excel(bills: List[Any]) -> io.BytesIO:
        """Export all saved mandi billing records into a professional two-sheet Excel file.
        
        Sheet 1: BILL SUMMARY (Summary of every receipt with all deductions and net payable)
        Sheet 2: ITEM DETAILS (Every produce item row breakdown with bags, weight, rate, rupaye, paise)
        """
        wb = Workbook()
        
        # -------------------------------------------------------------
        # STYLES & PALETTE
        # -------------------------------------------------------------
        header_fill = PatternFill(start_color="1E3A8A", end_color="1E3A8A", fill_type="solid") # Deep Mandi Navy
        header_font = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
        
        total_fill = PatternFill(start_color="FEF3C7", end_color="FEF3C7", fill_type="solid") # Soft Amber for Totals
        total_font = Font(name="Calibri", size=11, bold=True, color="92400E")
        
        green_total_font = Font(name="Calibri", size=11, bold=True, color="166534")
        red_total_font = Font(name="Calibri", size=11, bold=True, color="991B1B")

        center_align = Alignment(horizontal="center", vertical="center")
        left_align = Alignment(horizontal="left", vertical="center")
        right_align = Alignment(horizontal="right", vertical="center")

        thin_border = Border(
            left=Side(style="thin", color="D1D5DB"),
            right=Side(style="thin", color="D1D5DB"),
            top=Side(style="thin", color="D1D5DB"),
            bottom=Side(style="thin", color="D1D5DB")
        )
        
        total_border = Border(
            left=Side(style="thin", color="D1D5DB"),
            right=Side(style="thin", color="D1D5DB"),
            top=Side(style="thin", color="4B5563"),
            bottom=Side(style="double", color="1F2937") # Double bottom border for accountant total
        )

        num_format_currency = '"₹"#,##0.00'
        num_format_weight = '#,##0.00'
        num_format_int = '#,##0'

        # =============================================================
        # SHEET 1: BILL SUMMARY
        # =============================================================
        ws1 = wb.active
        ws1.title = "BILL SUMMARY"

        headers_s1 = [
            "Receipt Number",
            "Date",
            "Farmer Name",
            "Account Number",
            "Village",
            "Total Bags",
            "Total Weight (KG)",
            "Gross Amount",
            "Total Commission",
            "Total Hamali",
            "Total Tolai",
            "Total Stri Hamali",
            "Total Levy",
            "Transport",
            "Warni",
            "Cash Advance",
            "Bardana",
            "Other Expenses",
            "Total Deductions",
            "Net Payable Amount"
        ]

        ws1.append(headers_s1)

        # Style Header Row
        for col_idx in range(1, len(headers_s1) + 1):
            cell = ws1.cell(row=1, column=col_idx)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = center_align

        # Data Rows Accumulators for Grand Total
        sum_bags = 0
        sum_weight = 0.0
        sum_gross = 0.0
        sum_adat = 0.0
        sum_hamali = 0.0
        sum_tolai = 0.0
        sum_stri_hamali = 0.0
        sum_levy = 0.0
        sum_transport = 0.0
        sum_warni = 0.0
        sum_rokh_uchal = 0.0
        sum_bardana = 0.0
        sum_itar = 0.0
        sum_deductions = 0.0
        sum_net_payable = 0.0

        current_row_s1 = 2
        for bill in bills:
            # Handle both ORM model and dictionary
            exp = bill.expenses if hasattr(bill, "expenses") else bill.get("expenses", {})
            if not isinstance(exp, dict):
                exp = {}

            receipt_no = bill.receipt_no if hasattr(bill, "receipt_no") else bill.get("receipt_no", 0)
            bill_date = bill.bill_date if hasattr(bill, "bill_date") else bill.get("bill_date", "")
            farmer_name = bill.farmer_name if hasattr(bill, "farmer_name") else bill.get("farmer_name", "")
            account_no = bill.account_no if hasattr(bill, "account_no") else bill.get("account_no", "")
            village = bill.village if hasattr(bill, "village") else bill.get("village", "")
            
            pishvi = int(bill.total_pishvi if hasattr(bill, "total_pishvi") else bill.get("total_pishvi", 0) or 0)
            vajan = float(bill.total_vajan if hasattr(bill, "total_vajan") else bill.get("total_vajan", 0.0) or 0.0)
            gross = float(bill.gross_amount if hasattr(bill, "gross_amount") else bill.get("gross_amount", 0.0) or 0.0)
            
            adat = float(exp.get("adat", 0.0) or 0.0)
            hamali = float(exp.get("hamali", 0.0) or 0.0)
            tolai = float(exp.get("tolai", 0.0) or 0.0)
            stri_hamali = float(exp.get("stri_hamali", 0.0) or 0.0)
            levy = float(exp.get("levy", 0.0) or 0.0)
            transport = float(exp.get("motor_bhada", 0.0) or 0.0)
            warni = float(exp.get("warani", 0.0) or 0.0)
            rokh_uchal = float(exp.get("rokh_uchal", 0.0) or 0.0)
            bardana = float(exp.get("bardana", 0.0) or 0.0)
            itar = float(exp.get("itar", 0.0) or 0.0)
            
            deductions = float(bill.total_deductions if hasattr(bill, "total_deductions") else bill.get("total_deductions", 0.0) or 0.0)
            net_pay = float(bill.net_payable if hasattr(bill, "net_payable") else bill.get("net_payable", 0.0) or 0.0)

            # Accumulate
            sum_bags += pishvi
            sum_weight += vajan
            sum_gross += gross
            sum_adat += adat
            sum_hamali += hamali
            sum_tolai += tolai
            sum_stri_hamali += stri_hamali
            sum_levy += levy
            sum_transport += transport
            sum_warni += warni
            sum_rokh_uchal += rokh_uchal
            sum_bardana += bardana
            sum_itar += itar
            sum_deductions += deductions
            sum_net_payable += net_pay

            row_data = [
                receipt_no,
                bill_date,
                farmer_name,
                account_no,
                village,
                pishvi,
                vajan,
                gross,
                adat,
                hamali,
                tolai,
                stri_hamali,
                levy,
                transport,
                warni,
                rokh_uchal,
                bardana,
                itar,
                deductions,
                net_pay
            ]

            ws1.append(row_data)

            # Apply row styling
            for col_idx in range(1, len(row_data) + 1):
                c = ws1.cell(row=current_row_s1, column=col_idx)
                c.border = thin_border
                if col_idx in [1, 2, 4]:
                    c.alignment = center_align
                elif col_idx in [3, 5]:
                    c.alignment = left_align
                else:
                    c.alignment = right_align

                # Number formatting
                if col_idx == 6:
                    c.number_format = num_format_int
                elif col_idx == 7:
                    c.number_format = num_format_weight
                elif col_idx >= 8:
                    c.number_format = num_format_currency

            current_row_s1 += 1

        # Sheet 1: Grand Total Row
        grand_total_row_s1 = [
            "GRAND TOTAL",
            "",
            f"{len(bills)} Bills Total",
            "",
            "",
            sum_bags,
            sum_weight,
            sum_gross,
            sum_adat,
            sum_hamali,
            sum_tolai,
            sum_stri_hamali,
            sum_levy,
            sum_transport,
            sum_warni,
            sum_rokh_uchal,
            sum_bardana,
            sum_itar,
            sum_deductions,
            sum_net_payable
        ]
        ws1.append(grand_total_row_s1)

        for col_idx in range(1, len(grand_total_row_s1) + 1):
            c = ws1.cell(row=current_row_s1, column=col_idx)
            c.fill = total_fill
            c.border = total_border
            c.font = total_font
            if col_idx == 1:
                c.alignment = center_align
            elif col_idx in [6]:
                c.alignment = right_align
                c.number_format = num_format_int
            elif col_idx in [7]:
                c.alignment = right_align
                c.number_format = num_format_weight
            elif col_idx == 19:
                c.alignment = right_align
                c.number_format = num_format_currency
                c.font = red_total_font
            elif col_idx == 20:
                c.alignment = right_align
                c.number_format = num_format_currency
                c.font = green_total_font
            elif col_idx >= 8:
                c.alignment = right_align
                c.number_format = num_format_currency

        # Sheet 1: Enable Auto Filter on header row and freeze panes
        ws1.auto_filter.ref = f"A1:{get_column_letter(len(headers_s1))}{current_row_s1 - 1}"
        ws1.freeze_panes = "A2"

        # Sheet 1: Adjust Column Widths
        for col in ws1.columns:
            col_letter = get_column_letter(col[0].column)
            max_len = 0
            for cell in col:
                val_str = str(cell.value or "")
                if len(val_str) > max_len:
                    max_len = len(val_str)
            ws1.column_dimensions[col_letter].width = max(max_len + 4, 12)

        # =============================================================
        # SHEET 2: ITEM DETAILS
        # =============================================================
        ws2 = wb.create_sheet(title="ITEM DETAILS")

        headers_s2 = [
            "Receipt Number",
            "Date",
            "Farmer Name",
            "Item Name",
            "Bags",
            "Weight (KG)",
            "Rate (Per Qtl)",
            "Amount (Rupees)",
            "Paise"
        ]

        ws2.append(headers_s2)

        # Style Header Row Sheet 2
        for col_idx in range(1, len(headers_s2) + 1):
            cell = ws2.cell(row=1, column=col_idx)
            cell.fill = header_fill
            cell.font = header_font
            cell.alignment = center_align

        current_row_s2 = 2
        items_total_bags = 0
        items_total_weight = 0.0
        items_total_rupaye = 0
        items_total_amount = 0.0

        for bill in bills:
            receipt_no = bill.receipt_no if hasattr(bill, "receipt_no") else bill.get("receipt_no", 0)
            bill_date = bill.bill_date if hasattr(bill, "bill_date") else bill.get("bill_date", "")
            farmer_name = bill.farmer_name if hasattr(bill, "farmer_name") else bill.get("farmer_name", "")
            
            raw_items = bill.items if hasattr(bill, "items") else bill.get("items", [])
            if not isinstance(raw_items, list):
                raw_items = []

            for item in raw_items:
                if not isinstance(item, dict):
                    continue

                item_name = item.get("item_name") or item.get("commodity_name") or "कांदा (Onion)"
                pishvi = int(item.get("pishvi", 0) or 0)
                vajan = float(item.get("vajan", 0.0) or 0.0)
                bhav = float(item.get("bhav", 0.0) or 0.0)
                
                amount = float(item.get("amount", 0.0) or 0.0)
                if amount == 0.0 and vajan > 0 and bhav > 0:
                    amount = round((vajan * bhav) / 100.0, 2)

                rupaye = int(item.get("rupaye", 0) or int(amount))
                paise = int(item.get("paise", 0) or int(round((amount - rupaye) * 100)))

                items_total_bags += pishvi
                items_total_weight += vajan
                items_total_rupaye += rupaye
                items_total_amount += amount

                row_item_data = [
                    receipt_no,
                    bill_date,
                    farmer_name,
                    item_name,
                    pishvi,
                    vajan,
                    bhav,
                    rupaye,
                    f"{paise:02d}"
                ]
                ws2.append(row_item_data)

                for col_idx in range(1, len(row_item_data) + 1):
                    c = ws2.cell(row=current_row_s2, column=col_idx)
                    c.border = thin_border
                    if col_idx in [1, 2, 9]:
                        c.alignment = center_align
                    elif col_idx in [3, 4]:
                        c.alignment = left_align
                    else:
                        c.alignment = right_align

                    if col_idx == 5:
                        c.number_format = num_format_int
                    elif col_idx in [6, 7]:
                        c.number_format = num_format_weight
                    elif col_idx == 8:
                        c.number_format = num_format_currency

                current_row_s2 += 1

        # Sheet 2: Grand Total Row
        grand_total_row_s2 = [
            "GRAND TOTAL",
            "",
            f"{len(bills)} Bills Total",
            f"{current_row_s2 - 2} Items Total",
            items_total_bags,
            items_total_weight,
            "",
            items_total_rupaye,
            ""
        ]
        ws2.append(grand_total_row_s2)

        for col_idx in range(1, len(grand_total_row_s2) + 1):
            c = ws2.cell(row=current_row_s2, column=col_idx)
            c.fill = total_fill
            c.border = total_border
            c.font = total_font
            if col_idx == 1:
                c.alignment = center_align
            elif col_idx == 5:
                c.alignment = right_align
                c.number_format = num_format_int
            elif col_idx == 6:
                c.alignment = right_align
                c.number_format = num_format_weight
            elif col_idx == 8:
                c.alignment = right_align
                c.number_format = num_format_currency
                c.font = green_total_font

        # Sheet 2: Enable Auto Filter on header row and freeze panes
        ws2.auto_filter.ref = f"A1:{get_column_letter(len(headers_s2))}{current_row_s2 - 1}"
        ws2.freeze_panes = "A2"

        # Sheet 2: Adjust Column Widths
        for col in ws2.columns:
            col_letter = get_column_letter(col[0].column)
            max_len = 0
            for cell in col:
                val_str = str(cell.value or "")
                if len(val_str) > max_len:
                    max_len = len(val_str)
            ws2.column_dimensions[col_letter].width = max(max_len + 4, 12)

        # Output to stream
        output = io.BytesIO()
        wb.save(output)
        output.seek(0)
        return output
