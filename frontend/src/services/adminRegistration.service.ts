import axios from "axios";

const API_URL = process.env.UMI_APP_API_URL ? `${process.env.UMI_APP_API_URL}/registrations` : `http://${window.location.hostname}:5000/api/registrations`;
const EXPORT_URL = process.env.UMI_APP_API_URL ? `${process.env.UMI_APP_API_URL}/export` : `http://${window.location.hostname}:5000/api/export`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAdminRegistrations = async (params?: any) => {
  const response = await axios.get(API_URL, {
    params,
    ...getAuthHeaders(),
  });
  return response.data;
};

export const approveRegistration = async (id: string) => {
  const response = await axios.patch(`${API_URL}/${id}/approve`, {}, getAuthHeaders());
  return response.data;
};

export const rejectRegistration = async (id: string, note: string) => {
  const response = await axios.patch(`${API_URL}/${id}/reject`, { note }, getAuthHeaders());
  return response.data;
};

export const exportRegistrationsExcel = async (params?: any) => {
  const response = await axios.get(`${EXPORT_URL}/registrations`, {
    params,
    ...getAuthHeaders(),
    responseType: 'blob', // Quan trọng để tải file
  });
  return response;
};

export const updateSurvivalStats = async (id: string, stats: { points: number; kills: number; top1Count: number }) => {
  const response = await axios.patch(`${API_URL}/${id}/survival-stats`, stats, getAuthHeaders());
  return response.data;
};

export const updateRegistrationInfo = async (id: string, data: { teamName: string; teamLogo?: string; members: { memberName: string; gameId: string }[] }) => {
  const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeaders());
  return response.data;
};
