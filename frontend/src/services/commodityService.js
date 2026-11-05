import api from './api';

export const commodityService = {
  getCommodities: async () => {
    const res = await api.get('/commodities');
    return res.data;
  },
  createCommodity: async (data) => {
    const res = await api.post('/commodities', data);
    return res.data;
  },
};
