// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("API Response:", response); // Debug log
    return response.data;
  },
  (error) => {
    console.error("API Error:", error.response || error);
    throw error;
  }
);

// Ticket Service
export const ticketService = {
  getAll: async () => {
    try {
      const response = await api.get("/tickets");
      console.log("Full API Response:", response);

      // response เป็น array โดยตรง
      if (Array.isArray(response)) {
        return response;
      }

      // response เป็น object ที่มี data เป็น array
      if (response && Array.isArray(response.data)) {
        return response.data;
      }

      // response อยู่ใน response.data.data
      if (response?.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      console.warn("Could not find tickets array in response:", response);
      return [];
    } catch (error) {
      console.error("API error:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch tickets");
    }
  },
  // Create ticket
  create: async (data) => {
    try {
      const response = await api.post("/tickets", data);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to create ticket");
    }
  },

  // Get single ticket
  getById: async (id) => {
    try {
      const response = await api.get(`/tickets/${id}`);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to fetch ticket");
    }
  },

  // Update ticket
  // Update ticket
  update: async (id, data) => {
    try {
      const response = await api.put(`/tickets/${id}`, data);
      return response;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to update ticket");
    }
  },

  // Add comment to ticket
  addComment: async (ticketId, data) => {
    try {
      return await api.post(`/tickets/${ticketId}/comments`, data);
    } catch (error) {
      throw new Error(error.response?.data?.error || "Failed to add comment");
    }
  },

  // Get ticket comments
  getComments: async (ticketId) => {
    try {
      return await api.get(`/tickets/${ticketId}/comments`);
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch comments"
      );
    }
  },

  uploadAttachments: async (ticketId, formData) => {
    try {
        const response = await api.post(
            `/tickets/${ticketId}/attachments`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        // เช็คและส่งกลับข้อมูลให้ถูกต้อง
        if (response && response.data) {
            return response.data;
        }
        throw new Error('Invalid response format');
    } catch (error) {
        console.error('Upload error:', error);
        throw new Error(error.response?.data?.error || 'Failed to upload files');
    }
}
};


export const adminService = {
  getUsers: async () => {
    try {
      const response = await api.get("/admin/users");
      console.log("Service response:", response); // Debug log
      return response; // ส่ง response ทั้งหมดไปให้ component จัดการ
    } catch (error) {
      console.error("API error:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch users");
    }
  },

  getStats: async () => {
    try {
      const response = await api.get("/admin/stats");
      console.log("Stats API response:", response); // Debug log
      return response.data; // ควรส่งกลับ { stats: {...}, trend: [...] }
    } catch (error) {
      console.error("Stats API error:", error);
      throw new Error(error.response?.data?.error || "Failed to fetch stats");
    }
  },

  // Get user details
  getUserDetails: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch user details"
      );
    }
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to update user role"
      );
    }
  },

  // Update user status
  updateUserStatus: async (userId, isActive) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, {
        isActive,
      });
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to update user status"
      );
    }
  },

  // Get user tickets
  getUserTickets: async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}/tickets`);
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch user tickets"
      );
    }
  },

  getStats: async () => {
    try {
      const response = await api.get("/admin/stats");
      return response;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch admin stats"
      );
    }
  },
};

export default api;
