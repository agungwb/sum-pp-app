import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const repaymentScheduleService = {
  getBySecurityId: async (securityId: string) => {
    // Sesuaikan dengan endpoint backend NestJS Anda
    const response = await axios.get(`${BASE_URL}/repayment/securities/${securityId}/schedules`);
    return response.data;
  }
};