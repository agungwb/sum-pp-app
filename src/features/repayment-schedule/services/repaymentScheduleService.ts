import axios from 'axios';
import { ApiResponse } from '../../../types/api.type';
import { RepaymentScheduleFormRequest, RepaymentScheduleItemWithPenaltyResponse, RepaymentScheduleEditFormResponse, RepaymentScheduleDetailWithAuditResponse, RepaymentScheduleDetailResponse } from '../dtos/repayment-schedule.dto';


const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const REPAYMENT_SCHEDULE_URL = 'repayment/schedules';
const REPAYMENT_SECURITY_URL = 'repayment/securities';

const apiClient = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const repaymentScheduleService = {

  //DETAIL
  getRepaymentScheduleDetail: async (scheduleId: string): Promise<ApiResponse<RepaymentScheduleDetailResponse>> => {
    const response = await apiClient.get(`/${REPAYMENT_SCHEDULE_URL}/${scheduleId}`);
    return response.data;
  },

  getRepaymentScheduleEditForm: async (scheduleId: string): Promise<ApiResponse<RepaymentScheduleEditFormResponse>> => {
    const response = await apiClient.get(`/${REPAYMENT_SCHEDULE_URL}/${scheduleId}`);
    return response.data;
  },

  getRepaymentScheduleWithPenalty: async (scheduleId: string): Promise<ApiResponse<RepaymentScheduleItemWithPenaltyResponse>> => {
    const response = await apiClient.get(`/${REPAYMENT_SCHEDULE_URL}/${scheduleId}`);
    return response.data;
  },

  //LIST
  getRepaymentSchedulesWithPenalty: async (securityId: string): Promise<ApiResponse<RepaymentScheduleItemWithPenaltyResponse>> => {
    // const response = await axios.get(`${BASE_URL}/repayment/securities/${securityId}/schedules`);
    const response = await apiClient.get(`/${REPAYMENT_SECURITY_URL}/${securityId}/schedules`);
    return response.data;
  },
  
  //CREATE
  createRepaymentSchedule: async (securityId: string, payload: RepaymentScheduleFormRequest): Promise<RepaymentScheduleDetailWithAuditResponse> => {
    // const response = await axios.post(`${BASE_URL}/repayment/securities/${securityId}/schedules`, payload);
    const response = await apiClient.post(`/${REPAYMENT_SECURITY_URL}/${securityId}/schedules`, payload);
    return response.data;
  },
  
  //UPDATE
  updateRepaymentSchedule: async (scheduleId: string, payload: RepaymentScheduleFormRequest): Promise<RepaymentScheduleDetailWithAuditResponse> => {
    // const response = await axios.put(`${API_BASE_URL}/repayment/schedules/${scheduleId}`, payload);
    const response = await apiClient.put(`/${REPAYMENT_SCHEDULE_URL}/${scheduleId}`, payload);
    return response.data;
  },

};