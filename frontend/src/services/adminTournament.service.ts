import axios from "axios";

const API_URL = process.env.UMI_APP_API_URL ? `${process.env.UMI_APP_API_URL}/tournaments` : `http://${window.location.hostname}:5000/api/tournaments`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getTournaments = async (params?: any) => {
  const response = await axios.get(API_URL, {
    params,
    ...getAuthHeaders(),
  });
  return response.data;
};

export const createTournament = async (data: any) => {
  const response = await axios.post(API_URL, data, getAuthHeaders());
  return response.data;
};

export const updateTournament = async (id: string, data: any) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
  return response.data;
};

export const deleteTournament = async (id: string) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};