import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const repaymentReceiptService = {
  getByScheduleId: async (securityId: string) => {
    // Sesuaikan dengan endpoint backend NestJS Anda
    const response = await axios.get(`${BASE_URL}/repayment/schedules/${securityId}/receipts`);
    return response.data;
  }
};