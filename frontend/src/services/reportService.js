import api from './api';

export const reportService = {
  getDailySummary: async () => {
    const res = await api.get('/reports/summary');
    return res.data;
  },
  downloadSalesExcel: () => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    window.open(`${baseURL}/reports/export/sales-excel`, '_blank');
  },
};
