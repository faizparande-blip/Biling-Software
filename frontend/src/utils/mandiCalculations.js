/**
 * Traditional Maharashtra APMC Mandi Billing Calculation Engine
 * for M.A.B TRADERS, Solapur.
 *
 * Core rule:
 * Rate is entered per quintal (100 KG) and weight is entered in KG.
 * Line Amount = (Weight in KG * Rate per Quintal) / 100
 */

export const calculateLineItemAmount = (vajan, bhav) => {
  const weight = Number(vajan) || 0;
  const rate = Number(bhav) || 0;

  if (weight <= 0 || rate <= 0) {
    return { amount: 0, rupaye: 0, paise: 0 };
  }

  // Exact mandi calculation: weight * rate / 100
  const exactAmount = (weight * rate) / 100.0;
  const roundedAmount = Math.round(exactAmount * 100) / 100;
  const rupaye = Math.floor(roundedAmount);
  const paise = Math.round((roundedAmount - rupaye) * 100);

  return {
    amount: roundedAmount,
    rupaye,
    paise,
  };
};

export const recalculateCompleteBill = (currentBill) => {
  const items = currentBill.items || [];
  const expenses = currentBill.expenses || {};

  let totalPishvi = 0;
  let totalVajan = 0;
  let grossAmount = 0;

  const recalculatedItems = items.map((item) => {
    const pishvi = Number(item.pishvi) || 0;
    const vajan = Number(item.vajan) || 0;
    const bhav = Number(item.bhav) || 0;

    const { amount, rupaye, paise } = calculateLineItemAmount(vajan, bhav);

    totalPishvi += pishvi;
    totalVajan += vajan;
    grossAmount += amount;

    return {
      ...item,
      pishvi,
      vajan,
      bhav,
      amount,
      rupaye,
      paise,
    };
  });

  totalVajan = Math.round(totalVajan * 100) / 100;
  grossAmount = Math.round(grossAmount * 100) / 100;

  // Calculate sum of all expenses (वजा खर्च)
  let totalDeductions = 0;
  Object.keys(expenses).forEach((key) => {
    const val = Number(expenses[key]) || 0;
    totalDeductions += val;
  });
  totalDeductions = Math.round(totalDeductions * 100) / 100;

  // Net payable = Gross - Deductions
  const rawNetPayable = grossAmount - totalDeductions;
  const netPayable = Math.max(0, Math.round(rawNetPayable * 100) / 100);

  return {
    ...currentBill,
    items: recalculatedItems,
    total_pishvi: totalPishvi,
    total_vajan: totalVajan,
    gross_amount: grossAmount,
    total_deductions: totalDeductions,
    net_payable: netPayable,
  };
};

export const getInitialEmptyBill = (nextReceiptNo = 1) => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const initialItems = [
    {
      id: 'row-1',
      pishvi: 50,
      vajan: 2500,
      bhav: 2800,
      amount: 70000,
      rupaye: 70000,
      paise: 0,
    },
  ];

  const initialExpenses = {
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
  };

  const initialBill = {
    id: null,
    receipt_no: nextReceiptNo,
    bill_date: formattedDate,
    farmer_name: '',
    account_no: '',
    village: '',
    items: initialItems,
    expenses: initialExpenses,
    total_pishvi: 0,
    total_vajan: 0,
    gross_amount: 0,
    total_deductions: 0,
    net_payable: 0,
    notes: '',
  };

  return recalculateCompleteBill(initialBill);
};
