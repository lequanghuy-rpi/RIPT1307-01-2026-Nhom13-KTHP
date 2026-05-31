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

// 1. Lấy danh sách thông báo (phân trang)
export async function getMyNotifications(params: { page: number; limit: number; status?: string }) {
  const response = await axios.get(`${API_URL}/notifications/my`, {
    params,
    ...getAuthHeaders(),
  });
  return response.data;
}

// 2. Lấy số lượng chưa đọc
export async function getUnreadCount() {
  const response = await axios.get(`${API_URL}/notifications/unread-count`, getAuthHeaders());
  return response.data;
}

// 3. Đánh dấu 1 thông báo đã đọc
export async function markAsRead(id: string) {
  const response = await axios.patch(`${API_URL}/notifications/${id}/read`, {}, getAuthHeaders());
  return response.data;
}

// 4. Đánh dấu tất cả đã đọc
export async function markAllAsRead() {
  const response = await axios.patch(`${API_URL}/notifications/read-all`, {}, getAuthHeaders());
  return response.data;
}

// 5. Gửi thông báo broadcast (Chỉ Admin)
export async function broadcastNotification(payload: { title: string; message: string }) {
  const response = await axios.post(`${API_URL}/notifications/broadcast`, payload, getAuthHeaders());
  return response.data;
}