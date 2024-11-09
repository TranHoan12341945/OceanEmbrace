import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Sử dụng proxy với tiền tố /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động gắn token vào tất cả các yêu cầu
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// API đăng ký
export const register = async (password, confirmPassword, fullName, email) => {
  try {
    const response = await api.post('/register', {
      password,
      confirmPassword,
      fullName,
      emailAddress: email,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

// API đăng nhập
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', {
      emailAddress: email,
      accountPassword: password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

// Lấy danh sách artwork
export const fetchArtworks = async (page = 1, pageSize = 50) => {
  try {
    const response = await api.get('/artwork', {
      params: { Page: page, PageSize: pageSize },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
};

// Lấy danh sách genres
export const fetchGenres = async () => {
  try {
    const response = await api.get('/genres');
    return response.data;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

// Lấy thông tin hồ sơ nghệ sĩ theo ID
export const fetchProfileById = async (id) => {
  try {
    const response = await api.get(`/profile/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }
};

// Lấy thông tin tài khoản bằng email
export const fetchAccountDetails = async (email) => {
  try {
    const response = await api.get('/admin/account', {
      params: { userEmail: email },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching account details:', error);
    throw error;
  }
};

export const updateArtwork = async (artworkId, artworkData) => {
  try {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage nếu cần thiết
    const response = await api.put(`/artwork/${artworkId}`, artworkData, {
      headers: {
        Authorization: `Bearer ${token}`, // Gửi token trong phần header nếu API yêu cầu
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating artwork:", error);
    throw error;
  }
};

export const addArtwork = async (artworkData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.post('/artwork', artworkData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding artwork:', error);
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

export const fetchUniqueArtistsCount = async () => {
  try {
    const response = await api.get('/artwork'); // Gọi API artwork như bình thường
    const artworks = response.data.items;
    const uniqueArtistIds = new Set(artworks.map(artwork => artwork.artistId)); // Đếm số artistId độc nhất
    return uniqueArtistIds.size;
  } catch (error) {
    console.error('Error fetching unique artists count:', error);
    throw error;
  }
};

export const deleteArtwork = async (artworkId) => {
  try {
    const response = await api.delete(`/artwork/${artworkId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting artwork:', error);
    throw error;
  }
};

export const createReport = async (reportData) => {
  try {
    const response = await api.post('/report', reportData);
    return response.data;
  } catch (error) {
    console.error('Error creating report:', error);
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

// Hàm gọi API để lấy danh sách báo cáo
export const fetchReports = async () => {
  try {
    const response = await api.get('/report', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const fetchOrderById = async (orderId) => {
  try {
    const response = await api.get(`/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const fetchBalanceById = async (userId) => {
  try {
    const response = await api.get(`/balance/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure the token is included
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching balance:", error);
    throw error.response ? error.response.data : new Error("Network Error");
  }
};

export const fetchBalanceHistory = async (accountId, transactionType, fromDate, toDate) => {
  try {
    const response = await api.post('/balance/history', {
      accountId,
      transactionType,
      fromDate,
      toDate,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching balance history:', error);
    throw error;
  }
};

// Nạp tiền vào tài khoản
export const depositBalance = async (accountId, amount) => {
  try {
    const response = await api.post('/balance/deposit', { accountId, amount });
    return response.data;
  } catch (error) {
    console.error('Error depositing balance:', error);
    throw error;
  }
};

// Rút tiền từ tài khoản
export const withdrawBalance = async (accountId, amount) => {
  try {
    const response = await api.post('/balance/withdraw', { accountId, amount });
    return response.data;
  } catch (error) {
    console.error('Error withdrawing balance:', error);
    throw error;
  }
};

export default api;
