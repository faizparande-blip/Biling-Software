import api from './api';

export const partyService = {
  getParties: async (partyType) => {
    const res = await api.get('/parties', { params: { party_type: partyType } });
    return res.data;
  },
  createParty: async (data) => {
    const res = await api.post('/parties', data);
    return res.data;
  },
};
