import axios from 'axios';
import { ApiResponse } from '../../../types/api.type';
import { RepaymentReceiptFormRequest, RepaymentReceiptEditFormResponse } from '../dtos/repayment-receipt.dto';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const repaymentReceiptService = {
  getByScheduleId: async (scheduleId: string) => {
    // Sesuaikan dengan endpoint backend NestJS Anda
    const response = await axios.get(`${BASE_URL}/repayment/schedules/${scheduleId}/receipts`);
    return response.data;
  },

  createReceipt: async (scheduleId: string, data: RepaymentReceiptFormRequest) => {
    const response = await axios.post(`${BASE_URL}/repayment/schedules/${scheduleId}/receipts`, data);
    return response.data;
  },

  // PUT/PATCH http://localhost:3000/repayment/schedules/:scheduleId/receipts
  updateReceipt: async (receiptId: string, data: Partial<RepaymentReceiptFormRequest>) => {
    const response = await axios.put(`${BASE_URL}/repayment/receipts/${receiptId}`, data);
    return response.data;
  },

  // GET http://localhost:3000/repayment/schedules/:scheduleId/receipts
  getReceiptEditResponse: async (receiptId: string): Promise<ApiResponse<RepaymentReceiptEditFormResponse>> => {
    console.log('[getReceiptEditResponse] receiptId : ',receiptId);
    const response = await axios.get(`${BASE_URL}/repayment/receipts/${receiptId}`);
    
    return response.data;
  }
  
};
