// src/features/repayment-security/services/repaymentSecurityService.ts
import axios from 'axios';
import { ApiResponse } from '../../../types/api.type'
import { RepaymentSecurityCardResponse, RepaymentSecurityDetailResponse, RepaymentSecurityDetailWithAuditResponse, RepaymentSecurityEditFormResponse, RepaymentSecurityFormRequest, RepaymentSecuritySummaryResponse, RepaymentSecurityWithSinkingFundResponse, SecurityLookupResponse } from '../dtos/repayment-security.dto';
import * as Big from 'big.js';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const REPAYMENT_SECURITY_URL = 'repayment/securities';

// Inisiasi instance Axios untuk mengatur Base URL dan Header secara default
const apiClient = axios.create({
  baseURL: `${BASE_URL}/${REPAYMENT_SECURITY_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type RepaymentMode = 'detail' | 'summary' | 'detail-with-sf'; 

export const repaymentSecurityService = {
  // SECURITY LOOKUP
  getRepaymentSecurityLookup: async (): Promise<ApiResponse<SecurityLookupResponse>> => {
    const response = await apiClient.get('/lookup');
    return response.data;
  },

  // DETAIL
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

  // LIST
  getRepaymentSecurityCards: async (): Promise<ApiResponse<RepaymentSecurityCardResponse>> => {
    const response = await apiClient.get('/');
    return response.data; 
  },

  // CREATE
  createRepaymentSecurity: async (payload: RepaymentSecurityFormRequest): Promise<RepaymentSecurityDetailWithAuditResponse> => {
    const response = await apiClient.post('/', payload);
    return response.data;
  },

  // UPDATE
  updateRepaymentSecurity: async (id: string, payload: RepaymentSecurityFormRequest): Promise<RepaymentSecurityDetailWithAuditResponse> => {
    const response = await apiClient.put(`/${id}`, payload);
    return response.data;
  },

  mapRepaymentSecuritySummaryFromDetail : (
    detail: RepaymentSecurityDetailResponse | RepaymentSecurityWithSinkingFundResponse
  ): RepaymentSecuritySummaryResponse => {
    return {
      id: detail.id,
      investeeId: detail.investeeId,
      investeeName: detail.investeeName,
      investeeNameLegal: detail.investeeNameLegal,
      investeeIconUrl: detail.investeeIconUrl, 
      securityId: detail.securityId,
      securityType: detail.securityType, 
      securityName: detail.securityName,
      securityCode: detail.securityCode,
      securitySeries: detail.securitySeries,
      securityPhase: detail.securityPhase,
      securitySequence: detail.securitySequence,
      contractStatus: detail.contractStatus || null,
    };
  },


  
};