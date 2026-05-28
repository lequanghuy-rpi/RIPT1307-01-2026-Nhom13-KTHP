import axios from "axios";

const API_URL = process.env.UMI_APP_API_URL || `http://${window.location.hostname}:5000/api`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getTournamentById = async (id: string) => {
  const response = await axios.get(`${API_URL}/tournaments/${id}?_t=${Date.now()}`);
  return response.data.data;
};

export const registerTournament = async (data: any) => {
  const response = await axios.post(`${API_URL}/registrations`, data, getAuthHeaders());
  return response.data;
};

export const getMyRegistrations = async () => {
  const response = await axios.get(`${API_URL}/registrations/my`, getAuthHeaders());
  return response.data.data;
};

export const getAllTournaments = async () => {
  const response = await axios.get(`${API_URL}/tournaments`);
  return response.data;
};