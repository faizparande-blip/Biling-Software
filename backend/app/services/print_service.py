"""HTML/CSS Receipt and Invoice Print Generation Service."""
from jinja2 import Template
from typing import Dict, Any

J_FORM_HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>M.A.B TRADERS - J-Form Receipt</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; color: #222; }
    .receipt-box { max-width: 800px; margin: auto; padding: 24px; border: 1px solid #eee; }
    .header { text-align: center; border-bottom: 2px solid #1E3A8A; padding-bottom: 12px; }
    .header h1 { margin: 0; color: #1E3A8A; font-size: 24px; }
    .header p { margin: 4px 0; font-size: 13px; color: #555; }
    .title { text-align: center; font-weight: bold; font-size: 16px; margin: 12px 0; text-decoration: underline; }
    .meta-table, .items-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
    .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    .items-table th { background-color: #f8fafc; font-weight: 600; }
    .total-row { font-weight: bold; background-color: #f1f5f9; }
    .footer { margin-top: 30px; display: flex; justify-content: space-between; font-size: 12px; }
    @media print {
      body { margin: 0; }
      .receipt-box { border: none; }
    }
  </style>
</head>
<body>
  <div class="receipt-box">
    <div class="header">
      <h1>M.A.B TRADERS</h1>
      <p>Commission Agent & Grain Merchant | APMC Mandi</p>
      <p>Phone: +91 98765 43210 | GSTIN: 08AAAAA0000A1Z5</p>
    </div>
    <div class="title">J-FORM (FARMER SALE RECEIPT)</div>
    <table class="meta-table">
      <tr>
        <td><strong>Receipt No:</strong> {{ bill.bill_number }}</td>
        <td style="text-align: right;"><strong>Date:</strong> {{ bill.bill_date }}</td>
      </tr>
      <tr>
        <td><strong>Farmer Name:</strong> {{ party.name }}</td>
        <td style="text-align: right;"><strong>Village:</strong> {{ party.village_or_city }}</td>
      </tr>
    </table>
    <table class="items-table">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Commodity</th>
          <th>Bags</th>
          <th>Weight (Qtl)</th>
          <th>Rate/Qtl</th>
          <th>Gross Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>{{ item.commodity_name }}</td>
          <td>{{ item.bags }}</td>
          <td>{{ item.weight }}</td>
          <td>₹{{ item.rate }}</td>
          <td>₹{{ item.gross_amount }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="total-row">
          <td colspan="5" style="text-align: right;">Net Payable to Farmer:</td>
          <td>₹{{ bill.net_payable_amount }}</td>
        </tr>
      </tfoot>
    </table>
    <div class="footer">
      <div>Farmer Signature</div>
      <div>For M.A.B TRADERS (Authorized Signatory)</div>
    </div>
  </div>
</body>
</html>
"""


class PrintReceiptService:
    @staticmethod
    def render_j_form_html(context: Dict[str, Any]) -> str:
        """Render standalone HTML ready for print or browser preview."""
        template = Template(J_FORM_HTML_TEMPLATE)
        return template.render(**context)
