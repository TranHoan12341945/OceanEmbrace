import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Sử dụng proxy với tiền tố /api
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động gắn token vào tất cả các yêu cầu
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
export const fetchArtworks = async (page = 1, pageSize = 10) => { 
  try {
    const response = await api.get('/artwork', {
      params: { Page: page, PageSize: pageSize },
    });
    return response.data; // Trả về toàn bộ phản hồi API
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

// Lấy thông tin tất cả hồ sơ nghệ sĩ (updated)
export const fetchProfile = async () => {
  try {
    const response = await api.get('/profile'); // Assuming this endpoint returns all profiles
    return Array.isArray(response.data) ? response.data : [response.data]; // Ensure it returns an array
  } catch (error) {
    console.error('Error fetching profiles:', error);
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
    const response = await api.put(`/artwork/${artworkId}`, artworkData);
    return response.data;
  } catch (error) {
    console.error("Error updating artwork:", error);
    throw error;
  }
};

export const addArtwork = async (artworkData) => {
  try {
    const response = await api.post('/artwork', artworkData);
    return response.data;
  } catch (error) {
    console.error('Error adding artwork:', error);
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

// Count unique artists from artworks
export const fetchUniqueArtistsCount = async () => {
  try {
    const response = await api.get('/artwork');
    const artworks = response.data.items || [];
    const uniqueArtistIds = new Set(artworks.map(artwork => artwork.artistId));
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

// Lấy danh sách báo cáo
export const fetchReports = async () => {
  try {
    const response = await api.get('/report');
    return response.data;
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const fetchOrderById = async (orderId) => {
  try {
    const response = await api.get(`/order/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const fetchBalanceById = async (userId) => {
  try {
    const response = await api.get(`/balance/${userId}`);
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
