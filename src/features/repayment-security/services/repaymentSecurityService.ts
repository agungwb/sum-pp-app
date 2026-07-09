// src/features/repayment-security/services/repaymentSecurityService.ts
import axios from 'axios';
import { RepaymentSecurity} from '../types/repayment-security.type';
import { ApiResponse } from '../../../types/api.type'
import { RepaymentSecurityCardResponse, RepaymentSecurityDetailResponse, RepaymentSecurityRequest, RepaymentSecuritySummaryResponse } from '../dtos/repayment-security.dto';

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
  getRepaymentSecurityCards: async (): Promise<ApiResponse<RepaymentSecurityCardResponse[]>> => {
    const response = await apiClient.get('/');
    return response.data; 
  },

  // GET: Fetch detail spesifik (Dipanggil oleh RepaymentDetailPage)
  getRepaymentSecurityDetail: async (id: string): Promise<ApiResponse<RepaymentSecurityDetailResponse>> => {
    const response = await apiClient.get(`/${id}`);
    return response.data;
  },

  getRepaymentSecuritySummary: async (id: string): Promise<ApiResponse<RepaymentSecuritySummaryResponse>> => {
    const response = await apiClient.get(`/${id}/summary`);
    return response.data;
  },

  // POST: Tambah data baru
  createRepaymentSecurity: async (data: RepaymentSecurityRequest): Promise<ApiResponse<RepaymentSecurity>> => {
    const response = await apiClient.post('/', data);
    return response.data;
  },

  // PUT: Update data yang ada
  updateRepaymentSecurity: async (id: string, data: RepaymentSecurityRequest): Promise<ApiResponse<RepaymentSecurity>> => {
    const response = await apiClient.put(`/${id}`, data);
    return response.data;
  }

  
};