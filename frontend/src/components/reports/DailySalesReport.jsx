import React from 'react';
import { reportService } from '../../services/reportService';

export default function DailySalesReport() {
  return (
    <div className="report-card">
      <div className="report-header">
        <h4>Daily Sales & Arrival Summary</h4>
        <button className="btn-secondary" onClick={() => reportService.downloadSalesExcel()}>
          Download Excel (OpenPyXL)
        </button>
      </div>
      <p>Summary report preview (Ready for Phase 2 data feeding).</p>
    </div>
  );
}
