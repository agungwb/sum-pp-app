import axios from 'axios';
import { RepaymentScheduleRequest, GetRepaymentScheduleApiResponse } from '../dtos/repayment-schedule.dto';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';



// Sesuaikan dengan environment variable lo nanti
const API_BASE_URL = 'http://localhost:3000';

export const repaymentScheduleService = {
  getSchedule: async (scheduleId: string) => {
    const response = await axios.get<GetRepaymentScheduleApiResponse>(`${API_BASE_URL}/repayment/schedules/${scheduleId}`);
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

  getBySecurityId: async (securityId: string) => {
    const response = await axios.get(`${BASE_URL}/repayment/securities/${securityId}/schedules`);
    return response.data;
  }
};