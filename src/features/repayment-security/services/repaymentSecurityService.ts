// src/features/repayment-security/services/repaymentSecurityService.ts
import axios from 'axios';
import { RepaymentSecurity, ApiResponse } from '../types/repayment-security.type';
import { RepaymentSecurityRequest } from '../dtos/repayment-security.dto';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Inisiasi instance Axios untuk mengatur Base URL dan Header secara default
const apiClient = axios.create({
  baseURL: `${BASE_URL}/repayment/securities`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const repaymentSecurityService = {
  // GET: Fetch semua data 
  getAll: async (): Promise<ApiResponse<RepaymentSecurity[]>> => {
    const response = await apiClient.get('/');
    return response.data; 
  },

  // GET: Fetch detail spesifik (Dipanggil oleh RepaymentDetailPage)
  getDetail: async (id: string): Promise<ApiResponse<RepaymentSecurity>> => {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  // POST: Tambah data baru
  create: async (data: RepaymentSecurityRequest): Promise<ApiResponse<RepaymentSecurity>> => {
    const response = await apiClient.post('/', data);
    return response.data;
  },

  // PUT: Update data yang ada
  update: async (id: string, data: RepaymentSecurityRequest): Promise<ApiResponse<RepaymentSecurity>> => {
    const response = await apiClient.put(`/${id}`, data);
    return response.data;
  }

  
};