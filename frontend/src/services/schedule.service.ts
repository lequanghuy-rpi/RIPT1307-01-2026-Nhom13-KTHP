import axios from 'axios';

const API_URL = process.env.UMI_APP_API_URL || `http://${window.location.hostname}:5000/api`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getMatchesByTournament = async (tournamentId: string) => {
  const response = await axios.get(`${API_URL}/matches/${tournamentId}`);
  return response.data;
};

export const createMatch = async (data: { tournamentId: string; team1Id: string; team2Id: string; round?: string; startTime?: string }) => {
  const response = await axios.post(`${API_URL}/matches`, data, getAuthHeaders());
  return response.data;
};

export const updateMatchScore = async (id: string, data: { team1Score?: number; team2Score?: number; status?: string }) => {
  const response = await axios.put(`${API_URL}/matches/${id}/score`, data, getAuthHeaders());
  return response.data;
};

export const deleteMatch = async (id: string) => {
  const response = await axios.delete(`${API_URL}/matches/${id}`, getAuthHeaders());
  return response.data;
};

export const uploadMatchEvidence = async (id: string, evidenceImage: string) => {
  const response = await axios.put(`${API_URL}/matches/${id}/evidence`, { evidenceImage }, getAuthHeaders());
  return response.data;
};
