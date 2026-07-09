import axios from 'axios';
import { ApiResponse } from '../../../types/api.type';
import { RepaymentScheduleRequest, GetRepaymentScheduleApiResponse, RepaymentScheduleItemDto } from '../dtos/repayment-schedule.dto';
import { RepaymentScheduleEditResponse } from '../types/repayment-schedule.type';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Sesuaikan dengan environment variable lo nanti
const API_BASE_URL = 'http://localhost:3000';

export const repaymentScheduleService = {

  getScheduleEditResponse: async (scheduleId: string): Promise<ApiResponse<RepaymentScheduleEditResponse>> => {
    const response = await axios.get(`${API_BASE_URL}/repayment/schedules/${scheduleId}`);
    return response.data;
  },
  
  createSchedule: async (securityId: string, payload: RepaymentScheduleRequest) => {
    const response = await axios.post(`${API_BASE_URL}/repayment/securities/${securityId}/schedules`, payload);
    return response.data;
  },
  
  updateSchedule: async (scheduleId: string, payload: RepaymentScheduleRequest) => {
    const response = await axios.put(`${API_BASE_URL}/repayment/schedules/${scheduleId}`, payload);
    return response.data;
  },

  getBySecurityId: async (securityId: string): Promise<ApiResponse<RepaymentScheduleItemDto>> => {
    const response = await axios.get(`${BASE_URL}/repayment/securities/${securityId}/schedules`);
    return response.data;
  }
  
  // getBySecurityId: async (securityId: string): Promise<RepaymentScheduleItemDto[]> => {
  //   const response = await axios.getPromise<ApiResponse<RepaymentScheduleItemDto>>(`${BASE_URL}/repayment/securities/${securityId}/schedules`);
    
  //   if (!response.data?.data?.items) {
  //     return []; // Kembalikan array kosong jika tidak ada data agar UI tidak crash
  //   }
    
  //   return response.data.data.items;
  // }
};