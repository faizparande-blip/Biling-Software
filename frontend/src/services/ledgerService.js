import api from './api';

export const ledgerService = {
  getEntries: async (partyId) => {
    const res = await api.get('/ledgers', { params: { party_id: partyId } });
    return res.data;
  },
  createEntry: async (data) => {
    const res = await api.post('/ledgers', data);
    return res.data;
  },
};
