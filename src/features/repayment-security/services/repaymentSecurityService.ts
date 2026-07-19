// src/features/repayment-security/services/repaymentSecurityService.ts
import axios from 'axios';
import { RepaymentSecurity} from '../types/repayment-security.type';
import { ApiResponse } from '../../../types/api.type'
import { RepaymentSecurityCardResponse, RepaymentSecurityDetailResponse, RepaymentSecurityEditFormResponse, RepaymentSecurityFormRequest, RepaymentSecuritySummaryResponse, RepaymentSecurityWithSinkingFundResponse } from '../dtos/repayment-security.dto';
import * as Big from 'big.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Inisiasi instance Axios untuk mengatur Base URL dan Header secara default
const apiClient = axios.create({
  baseURL: `${BASE_URL}/repayment/securities`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type RepaymentMode = 'detail' | 'summary' | 'detail-with-sf'; 

export const repaymentSecurityService = {
  // GET: Fetch semua data 
  getRepaymentSecurityCards: async (): Promise<ApiResponse<RepaymentSecurityCardResponse>> => {
    const response = await apiClient.get('/');
    return response.data; 
  },

  // GET: Fetch detail spesifik (Dipanggil oleh RepaymentDetailPage)
  getRepaymentSecurityDetail: async (id: string): Promise<ApiResponse<RepaymentSecurityDetailResponse>> => {
    const response = await apiClient.get(`/${id}`, {
      params: {
        mode: 'detail', 
      },
    });
    return response.data;
  },

  getRepaymentSecurityEditForm: async (id: string): Promise<ApiResponse<RepaymentSecurityEditFormResponse>> => {
    const response = await apiClient.get(`/${id}`, {
      params: {
        mode: 'detail', 
      },
    });
    return response.data;
  },

  getRepaymentSecurityWithSinkingFund: async (id: string): Promise<ApiResponse<RepaymentSecurityWithSinkingFundResponse>> => {
    const response = await apiClient.get(`/${id}`, {
      params: {
        mode: 'detail-with-sf', 
      },
    });
    return response.data;
  },

  getRepaymentSecuritySummary2: async (id: string): Promise<ApiResponse<RepaymentSecuritySummaryResponse>> => {
    const response = await apiClient.get(`/${id}`, {
      params: {
        mode: 'summary', 
      },
    });
    return response.data;
  },

  getRepaymentSecuritySummary: async (id: string): Promise<ApiResponse<RepaymentSecuritySummaryResponse>> => {
    const response = await apiClient.get(`/${id}/summary`);
    return response.data;
  },

  // POST: Tambah data baru
  createRepaymentSecurity: async (data: RepaymentSecurityFormRequest): Promise<ApiResponse<RepaymentSecurity>> => {
    const response = await apiClient.post('/', data);
    return response.data;
  },

  // PUT: Update data yang ada
  updateRepaymentSecurity: async (id: string, data: RepaymentSecurityFormRequest): Promise<ApiResponse<RepaymentSecurity>> => {
    const response = await apiClient.put(`/${id}`, data);
    return response.data;
  },

  mapRepaymentSecuritySummaryFromDetail : (
    detail: RepaymentSecurityDetailResponse
  ): RepaymentSecuritySummaryResponse => {
    return {
      id: detail.id,
      investeeId: detail.investeeId,
      investeeName: detail.investeeName,
      investeeNameLegal: detail.investeeNameLegal,
      // Menyelaraskan perbedaan key 'investeeIconUrl' ke 'investeIconUrl' sesuai interface summary Anda
      investeeIconUrl: detail.investeeIconUrl, 
      securityId: detail.securityId,
      // Melakukan type casting ke string/SecurityType agar aman dari sintaks error
      securityType: detail.securityType, 
      securityName: detail.securityName,
      securityCode: detail.securityCode,
      securitySeries: detail.securitySeries,
      securityPhase: detail.securityPhase,
      securitySequence: detail.securitySequence,
      contractStatus: detail.contractStatus || null,
    };
  },


  // calculateRevenue: (repaymentSecurity: RepaymentSecurityWithSinkingFundResponse): string => {
  //   // 1. Antisipasi jika data belum selesai di-fetch dari API
  //   if (!data) return '0';

  //   try {
  //     const duration = Number(repaymentSecurity.contractDurationInMonths)
  
  //     const feeAdmin = Big(repaymentSecurity.contractFeeAdministration);
  //     const feeAdminPct = Big(repaymentSecurity.contractFeeAdministrationPercentage);
      
  //     const feeProvision = Big(repaymentSecurity.contractFeeProvision);
  //     const feeProvisionPct = Big(repaymentSecurity.contractFeeProvisionPercentage);
      
  //     const feePlatform = Big(repaymentSecurity.contractFeePlatform);
  //     const feePlatformPct = Big(repaymentSecurity.contractFeePlatformPercentage);
      
  //     const feeServicing = Big(repaymentSecurity.contractFeeServicing);
  //     const feeServicingPct = Big(repaymentSecurity.contractFeeServicingPercentage);
      
  //     const feeMonitoring = Big(repaymentSecurity.contractFeeMonitoring);
  //     const feeMonitoringPctMonthly = Big(repaymentSecurity.contractFeeMonitoringPercentageMonthly);
  //     const feeMonitoringPct = feeMonitoringPctMonthly.times(duration);
      
  //     const totalRevenue = feeAdmin.plus(feeProvision).plus(feePlatform).plus(feeServicing).plus(feeMonitoring);
  //     const totalRevenuePercentage = feeAdminPct.plus(feeProvisionPct).plus(feePlatformPct).plus(feeServicingPct).plus(feeMonitoringPct);
  //   } catch (error) {
  //     console.error('Gagal menghitung revenue:', error);
  //     return '0'; // Return '0' sebagai fallback aman jika data korup
  //   }
  // } 

  
};