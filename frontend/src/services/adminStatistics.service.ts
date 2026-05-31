import axios from "axios";

const API_URL = process.env.UMI_APP_API_URL ? `${process.env.UMI_APP_API_URL}/stats` : `http://${window.location.hostname}:5000/api/stats`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getOverview = async () => {
  const response = await axios.get(`${API_URL}/overview`, getAuthHeaders());
  return response.data;
};

export const getRegistrationsByDate = async (params?: { startDate?: string; endDate?: string }) => {
  const response = await axios.get(`${API_URL}/registrations-by-date`, {
    params,
    ...getAuthHeaders(),
  });
  return response.data;
};

export const getStatusDistribution = async () => {
  const response = await axios.get(`${API_URL}/status-distribution`, getAuthHeaders());
  return response.data;
};

export const getTopTournaments = async (params?: { startDate?: string; endDate?: string }) => {
  const response = await axios.get(`${API_URL}/top-tournaments`, {
    params,
    ...getAuthHeaders(),
  });
  return response.data;
};
