import axios from 'axios';
import { ApiResponse } from '../../../types/api.type';
import { RepaymentReceiptFormRequest, RepaymentReceiptEditFormResponse, RepaymentReceiptDetailWithAuditResponse } from '../dtos/repayment-receipt.dto';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const REPAYMENT_SCHEDULE_URL = 'repayment/schedules';
const REPAYMENT_RECEIPT_URL = 'repayment/receipts';

const apiClient = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const repaymentReceiptService = {

  // DETAIL
  getRepaymentReceiptEditForm: async (receiptId: string): Promise<ApiResponse<RepaymentReceiptEditFormResponse>> => {
    // const response = await axios.get(`${BASE_URL}/repayment/receipts/${receiptId}`);
    const response = await apiClient.get(`/${REPAYMENT_RECEIPT_URL}/${receiptId}`);
    return response.data;
  },
  
  //LIST
  getRepaymentReceipts: async (scheduleId: string) => {
    // const response = await axios.get(`${BASE_URL}/repayment/schedules/${scheduleId}/receipts`);
    const response = await apiClient.get(`/${REPAYMENT_SCHEDULE_URL}/${scheduleId}/receipts`);
    return response.data;
  },

  // CREATE
  createRepaymentReceipt: async (scheduleId: string, payload: RepaymentReceiptFormRequest): Promise<RepaymentReceiptDetailWithAuditResponse> => {
    // const response = await axios.post(`${BASE_URL}/repayment/schedules/${scheduleId}/receipts`, data);
    const response = await apiClient.post(`/${REPAYMENT_SCHEDULE_URL}/${scheduleId}/receipts`, payload);
    return response.data;
  },

  // UPDATE
  updateRepaymentReceipt: async (receiptId: string, payload: RepaymentReceiptFormRequest): Promise<RepaymentReceiptDetailWithAuditResponse> => {
    // const response = await axios.put(`${BASE_URL}/repayment/receipts/${receiptId}`, data);
    const response = await apiClient.put(`/${REPAYMENT_RECEIPT_URL}/${receiptId}`, payload);
    return response.data;
  },

  
};
