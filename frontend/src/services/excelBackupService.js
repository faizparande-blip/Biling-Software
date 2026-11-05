import ExcelJS from 'exceljs';

/**
 * Client-Side Excel Backup & Restore Service for M.A.B TRADERS
 * Powered by ExcelJS - Runs 100% in Browser, Zero Server Dependency
 */

export const excelBackupService = {
  /**
   * Export complete billing database into structured .xlsx file
   * Contains 3 sheets: Bills, Items, Expenses
   */
  async exportBackup(bills = []) {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'M.A.B TRADERS, Solapur';
    workbook.lastModifiedBy = 'MAB Billing System';
    workbook.created = new Date();
    workbook.modified = new Date();

    const headerFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E3A8A' }, // Deep Mandi Navy
    };
    const headerFont = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };

    const totalFill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFEF3C7' }, // Soft Amber
    };
    const totalFont = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF92400E' } };
    const greenTotalFont = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FF166534' } };

    const thinBorder = {
      top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    };

    const doubleBottomBorder = {
      top: { style: 'thin', color: { argb: 'FF4B5563' } },
      left: { style: 'thin', color: { argb: 'FFD1D5DB' } },
      bottom: { style: 'double', color: { argb: 'FF1F2937' } },
      right: { style: 'thin', color: { argb: 'FFD1D5DB' } },
    };

    // =========================================================================
    // SHEET 1: Bills (Summary of all bills)
    // =========================================================================
    const wsBills = workbook.addWorksheet('Bills', {
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    wsBills.columns = [
      { header: 'Receipt Number', key: 'receipt_no', width: 16 },
      { header: 'Date', key: 'bill_date', width: 14 },
      { header: 'Farmer Name', key: 'farmer_name', width: 32 },
      { header: 'Account Number', key: 'account_no', width: 16 },
      { header: 'Village', key: 'village', width: 22 },
      { header: 'Total Bags', key: 'total_pishvi', width: 14 },
      { header: 'Total Weight (KG)', key: 'total_vajan', width: 18 },
      { header: 'Gross Amount (₹)', key: 'gross_amount', width: 18 },
      { header: 'Total Deductions (₹)', key: 'total_deductions', width: 18 },
      { header: 'Net Payable Amount (₹)', key: 'net_payable', width: 22 },
      { header: 'Notes', key: 'notes', width: 26 },
      { header: 'Created At', key: 'created_at', width: 22 },
    ];

    wsBills.getRow(1).eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    let sumBags = 0;
    let sumWeight = 0.0;
    let sumGross = 0.0;
    let sumDeductions = 0.0;
    let sumNet = 0.0;

    bills.forEach((b) => {
      const bags = Number(b.total_pishvi) || 0;
      const weight = Number(b.total_vajan) || 0.0;
      const gross = Number(b.gross_amount) || 0.0;
      const deductions = Number(b.total_deductions) || 0.0;
      const net = Number(b.net_payable) || 0.0;

      sumBags += bags;
      sumWeight += weight;
      sumGross += gross;
      sumDeductions += deductions;
      sumNet += net;

      const row = wsBills.addRow({
        receipt_no: b.receipt_no,
        bill_date: b.bill_date,
        farmer_name: b.farmer_name,
        account_no: b.account_no || '',
        village: b.village || '',
        total_pishvi: bags,
        total_vajan: weight,
        gross_amount: gross,
        total_deductions: deductions,
        net_payable: net,
        notes: b.notes || '',
        created_at: b.created_at || '',
      });

      row.eachCell((cell, colNumber) => {
        cell.border = thinBorder;
        if ([1, 2, 4].includes(colNumber)) {
          cell.alignment = { horizontal: 'center' };
        } else if ([6, 7, 8, 9, 10].includes(colNumber)) {
          cell.alignment = { horizontal: 'right' };
          if (colNumber === 6) cell.numFmt = '#,##0';
          if (colNumber === 7) cell.numFmt = '#,##0.00';
          if (colNumber >= 8) cell.numFmt = '"₹"#,##0.00';
        }
      });
    });

    // Grand Total Row in Bills Sheet
    const totalRowBills = wsBills.addRow({
      receipt_no: 'GRAND TOTAL',
      bill_date: '',
      farmer_name: `${bills.length} Bills Total`,
      account_no: '',
      village: '',
      total_pishvi: sumBags,
      total_vajan: sumWeight,
      gross_amount: sumGross,
      total_deductions: sumDeductions,
      net_payable: sumNet,
      notes: '',
      created_at: '',
    });

    totalRowBills.eachCell((cell, colNumber) => {
      cell.fill = totalFill;
      cell.font = colNumber === 10 ? greenTotalFont : totalFont;
      cell.border = doubleBottomBorder;
      if (colNumber === 6) {
        cell.alignment = { horizontal: 'right' };
        cell.numFmt = '#,##0';
      } else if (colNumber === 7) {
        cell.alignment = { horizontal: 'right' };
        cell.numFmt = '#,##0.00';
      } else if (colNumber >= 8 && colNumber <= 10) {
        cell.alignment = { horizontal: 'right' };
        cell.numFmt = '"₹"#,##0.00';
      }
    });

    // =========================================================================
    // SHEET 2: Items (Detailed produce line items)
    // =========================================================================
    const wsItems = workbook.addWorksheet('Items', {
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    wsItems.columns = [
      { header: 'Receipt Number', key: 'receipt_no', width: 16 },
      { header: 'Date', key: 'bill_date', width: 14 },
      { header: 'Farmer Name', key: 'farmer_name', width: 32 },
      { header: 'Item Name', key: 'item_name', width: 22 },
      { header: 'Bags (पिशवी)', key: 'pishvi', width: 14 },
      { header: 'Weight (KG)', key: 'vajan', width: 16 },
      { header: 'Rate (Per Qtl)', key: 'bhav', width: 16 },
      { header: 'Amount (Rupees)', key: 'rupaye', width: 18 },
      { header: 'Paise', key: 'paise', width: 10 },
    ];

    wsItems.getRow(1).eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    let itemsTotalBags = 0;
    let itemsTotalWeight = 0.0;
    let itemsTotalRupaye = 0;

    bills.forEach((b) => {
      const items = b.items || [];
      items.forEach((item) => {
        const bags = Number(item.pishvi) || 0;
        const weight = Number(item.vajan) || 0.0;
        const rate = Number(item.bhav) || 0.0;
        const rupaye = Number(item.rupaye) || Math.floor(Number(item.amount) || 0);
        const paise = item.paise !== undefined ? item.paise : '00';

        itemsTotalBags += bags;
        itemsTotalWeight += weight;
        itemsTotalRupaye += rupaye;

        const row = wsItems.addRow({
          receipt_no: b.receipt_no,
          bill_date: b.bill_date,
          farmer_name: b.farmer_name,
          item_name: item.item_name || 'कांदा (Onion)',
          pishvi: bags,
          vajan: weight,
          bhav: rate,
          rupaye: rupaye,
          paise: String(paise).padStart(2, '0'),
        });

        row.eachCell((cell, colNumber) => {
          cell.border = thinBorder;
          if ([1, 2, 9].includes(colNumber)) {
            cell.alignment = { horizontal: 'center' };
          } else if ([5, 6, 7, 8].includes(colNumber)) {
            cell.alignment = { horizontal: 'right' };
            if (colNumber === 5) cell.numFmt = '#,##0';
            if ([6, 7].includes(colNumber)) cell.numFmt = '#,##0.00';
            if (colNumber === 8) cell.numFmt = '"₹"#,##0';
          }
        });
      });
    });

    // Grand Total Row in Items Sheet
    const totalRowItems = wsItems.addRow({
      receipt_no: 'GRAND TOTAL',
      bill_date: '',
      farmer_name: `${bills.length} Bills Total`,
      item_name: 'All Items Total',
      pishvi: itemsTotalBags,
      vajan: itemsTotalWeight,
      bhav: '',
      rupaye: itemsTotalRupaye,
      paise: '',
    });

    totalRowItems.eachCell((cell, colNumber) => {
      cell.fill = totalFill;
      cell.font = totalFont;
      cell.border = doubleBottomBorder;
      if (colNumber === 5) {
        cell.alignment = { horizontal: 'right' };
        cell.numFmt = '#,##0';
      } else if (colNumber === 6) {
        cell.alignment = { horizontal: 'right' };
        cell.numFmt = '#,##0.00';
      } else if (colNumber === 8) {
        cell.alignment = { horizontal: 'right' };
        cell.numFmt = '"₹"#,##0';
      }
    });

    // =========================================================================
    // SHEET 3: Expenses (Deduction breakdown per bill)
    // =========================================================================
    const wsExpenses = workbook.addWorksheet('Expenses', {
      views: [{ state: 'frozen', ySplit: 1 }],
    });

    wsExpenses.columns = [
      { header: 'Receipt Number', key: 'receipt_no', width: 16 },
      { header: 'Date', key: 'bill_date', width: 14 },
      { header: 'Farmer Name', key: 'farmer_name', width: 30 },
      { header: 'Adat (अडत)', key: 'adat', width: 15 },
      { header: 'Hamali (हमाली)', key: 'hamali', width: 15 },
      { header: 'Tolai (तोलाई)', key: 'tolai', width: 15 },
      { header: 'Stri Hamali (स्त्री ह.)', key: 'stri_hamali', width: 16 },
      { header: 'Levy (लेव्ही)', key: 'levy', width: 15 },
      { header: 'Transport (मो. भाडा)', key: 'motor_bhada', width: 16 },
      { header: 'Warni (वारणी)', key: 'warani', width: 15 },
      { header: 'Cash Advance (रोख उचल)', key: 'rokh_uchal', width: 18 },
      { header: 'Bardana (बारदाना)', key: 'bardana', width: 15 },
      { header: 'Other (इतर)', key: 'itar', width: 15 },
      { header: 'Total Deductions', key: 'total_deductions', width: 18 },
    ];

    wsExpenses.getRow(1).eachCell((cell) => {
      cell.fill = headerFill;
      cell.font = headerFont;
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    bills.forEach((b) => {
      const exp = b.expenses || {};
      const row = wsExpenses.addRow({
        receipt_no: b.receipt_no,
        bill_date: b.bill_date,
        farmer_name: b.farmer_name,
        adat: Number(exp.adat) || 0,
        hamali: Number(exp.hamali) || 0,
        tolai: Number(exp.tolai) || 0,
        stri_hamali: Number(exp.stri_hamali) || 0,
        levy: Number(exp.levy) || 0,
        motor_bhada: Number(exp.motor_bhada) || 0,
        warani: Number(exp.warani) || 0,
        rokh_uchal: Number(exp.rokh_uchal) || 0,
        bardana: Number(exp.bardana) || 0,
        itar: Number(exp.itar) || 0,
        total_deductions: Number(b.total_deductions) || 0,
      });

      row.eachCell((cell, colNumber) => {
        cell.border = thinBorder;
        if ([1, 2].includes(colNumber)) {
          cell.alignment = { horizontal: 'center' };
        } else if (colNumber >= 4) {
          cell.alignment = { horizontal: 'right' };
          cell.numFmt = '"₹"#,##0.00';
        }
      });
    });

    // Write buffer and trigger browser download
    const buffer = await workbook.xlsx.writeBuffer();
    const todayStr = new Date().toISOString().split('T')[0];
    const filename = `MAB_TRADERS_Backup_${todayStr}.xlsx`;

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    return { success: true, filename, count: bills.length };
  },

  /**
   * Restore billing database from an uploaded .xlsx backup file
   */
  async restoreBackup(file) {
    if (!file) throw new Error('Please select an Excel file.');

    const arrayBuffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    // Validate sheets
    const wsBills = workbook.getWorksheet('Bills');
    const wsItems = workbook.getWorksheet('Items');
    const wsExpenses = workbook.getWorksheet('Expenses');

    if (!wsBills) {
      throw new Error(
        "Invalid file structure: 'Bills' worksheet not found. Please upload a valid M.A.B TRADERS backup file."
      );
    }

    // 1. Parse Bills Sheet
    const billsMap = new Map();

    wsBills.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header
      const receiptNoVal = row.getCell(1).value;
      if (!receiptNoVal || String(receiptNoVal).includes('GRAND TOTAL')) return;

      const receipt_no = Number(receiptNoVal);
      const bill = {
        receipt_no,
        bill_date: String(row.getCell(2).value || ''),
        farmer_name: String(row.getCell(3).value || ''),
        account_no: String(row.getCell(4).value || ''),
        village: String(row.getCell(5).value || ''),
        total_pishvi: Number(row.getCell(6).value) || 0,
        total_vajan: Number(row.getCell(7).value) || 0,
        gross_amount: Number(row.getCell(8).value) || 0,
        total_deductions: Number(row.getCell(9).value) || 0,
        net_payable: Number(row.getCell(10).value) || 0,
        notes: String(row.getCell(11).value || ''),
        created_at: String(row.getCell(12).value || new Date().toISOString()),
        items: [],
        expenses: {
          adat: 0,
          hamali: 0,
          tolai: 0,
          stri_hamali: 0,
          levy: 0,
          motor_bhada: 0,
          warani: 0,
          rokh_uchal: 0,
          bardana: 0,
          itar: 0,
        },
      };
      billsMap.set(receipt_no, bill);
    });

    // 2. Parse Items Sheet
    if (wsItems) {
      wsItems.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const receiptNoVal = row.getCell(1).value;
        if (!receiptNoVal || String(receiptNoVal).includes('GRAND TOTAL')) return;

        const receipt_no = Number(receiptNoVal);
        const bill = billsMap.get(receipt_no);
        if (bill) {
          const pishvi = Number(row.getCell(5).value) || 0;
          const vajan = Number(row.getCell(6).value) || 0;
          const bhav = Number(row.getCell(7).value) || 0;
          const rupaye = Number(row.getCell(8).value) || 0;
          const paise = Number(row.getCell(9).value) || 0;

          bill.items.push({
            id: `item-${receipt_no}-${bill.items.length + 1}`,
            item_name: String(row.getCell(4).value || 'कांदा'),
            pishvi,
            vajan,
            bhav,
            rupaye,
            paise,
            amount: rupaye + paise / 100,
          });
        }
      });
    }

    // 3. Parse Expenses Sheet
    if (wsExpenses) {
      wsExpenses.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const receiptNoVal = row.getCell(1).value;
        if (!receiptNoVal) return;

        const receipt_no = Number(receiptNoVal);
        const bill = billsMap.get(receipt_no);
        if (bill) {
          bill.expenses = {
            adat: Number(row.getCell(4).value) || 0,
            hamali: Number(row.getCell(5).value) || 0,
            tolai: Number(row.getCell(6).value) || 0,
            stri_hamali: Number(row.getCell(7).value) || 0,
            levy: Number(row.getCell(8).value) || 0,
            motor_bhada: Number(row.getCell(9).value) || 0,
            warani: Number(row.getCell(10).value) || 0,
            rokh_uchal: Number(row.getCell(11).value) || 0,
            bardana: Number(row.getCell(12).value) || 0,
            itar: Number(row.getCell(13).value) || 0,
          };
        }
      });
    }

    const restoredList = Array.from(billsMap.values());
    if (restoredList.length === 0) {
      throw new Error('No bills found in this file.');
    }

    return restoredList;
  },
};
