import api from './api';

const LOCAL_STORAGE_KEY = 'mab_traders_saved_bills';

const getLocalBills = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalBills = (bills) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(bills));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
};

export const billService = {
  getNextReceiptNumber: async () => {
    try {
      const res = await api.get('/bills/next-receipt-no');
      return res.data.next_receipt_no;
    } catch (err) {
      console.warn('Backend unavailable, deriving next receipt number from local storage');
      const local = getLocalBills();
      if (local.length === 0) return 1;
      const maxNo = Math.max(...local.map((b) => Number(b.receipt_no) || 0));
      return maxNo + 1;
    }
  },

  getBills: async (params = {}) => {
    try {
      const res = await api.get('/bills', { params });
      // Sync local backup
      if (res.data && Array.isArray(res.data)) {
        saveLocalBills(res.data);
      }
      return res.data;
    } catch (err) {
      console.warn('Backend unavailable, serving bills from local storage');
      let bills = getLocalBills();
      if (params.search) {
        const q = params.search.toLowerCase().trim();
        bills = bills.filter(
          (b) =>
            String(b.receipt_no).includes(q) ||
            (b.farmer_name && b.farmer_name.toLowerCase().includes(q)) ||
            (b.village && b.village.toLowerCase().includes(q))
        );
      }
      if (params.date) {
        bills = bills.filter((b) => b.bill_date === params.date);
      }
      return bills;
    }
  },

  getBillById: async (id) => {
    try {
      const res = await api.get(`/bills/${id}`);
      return res.data;
    } catch (err) {
      const local = getLocalBills();
      return local.find((b) => b.id === id || b.receipt_no === id);
    }
  },

  saveBill: async (billData) => {
    try {
      let res;
      if (billData.id) {
        // Updating existing bill record
        res = await api.put(`/bills/${billData.id}`, billData);
      } else {
        // Creating new bill record
        res = await api.post('/bills', billData);
      }
      // Update local storage
      const saved = res.data;
      const local = getLocalBills();
      const existingIdx = local.findIndex(
        (b) => b.id === saved.id || b.receipt_no === saved.receipt_no
      );
      if (existingIdx >= 0) {
        local[existingIdx] = saved;
      } else {
        local.unshift(saved);
      }
      saveLocalBills(local);
      return saved;
    } catch (err) {
      console.warn('Backend unavailable, saving bill into persistent local storage');
      const local = getLocalBills();
      const isExisting = billData.id !== null && billData.id !== undefined;
      const newBill = {
        ...billData,
        id: isExisting ? billData.id : Date.now(),
        receipt_no:
          billData.receipt_no ||
          (local.length > 0 ? Math.max(...local.map((b) => b.receipt_no || 0)) + 1 : 1),
        updated_at: new Date().toISOString(),
      };
      if (!isExisting) {
        newBill.created_at = new Date().toISOString();
      }

      const existingIdx = local.findIndex(
        (b) => b.id === newBill.id || b.receipt_no === newBill.receipt_no
      );
      if (existingIdx >= 0) {
        local[existingIdx] = newBill;
      } else {
        local.unshift(newBill);
      }
      saveLocalBills(local);
      return newBill;
    }
  },

  deleteBill: async (id) => {
    try {
      await api.delete(`/bills/${id}`);
    } catch (err) {
      console.warn('Backend unavailable, deleting from local storage');
    }
    const local = getLocalBills();
    const filtered = local.filter((b) => b.id !== id && b.receipt_no !== id);
    saveLocalBills(filtered);
    return { status: 'success' };
  },

  exportAllBillsExcel: async (search = '', date = '') => {
    const filename = 'MAB_TRADERS_Billing_History.xlsx';
    try {
      const response = await api.get('/bills/export/excel', {
        params: { search, date },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      console.warn('Backend export failed, attempting direct download URL fallback');
      const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
      window.open(`${baseURL}/bills/export/excel`, '_blank');
      return true;
    }
  },
};
