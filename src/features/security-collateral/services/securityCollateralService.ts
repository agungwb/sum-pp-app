import axios from 'axios';
import { SecurityCollateral } from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const securityCollateralService = {
  getBySecurityId: async (securityId: string) => {
    const response = await axios.get(`${BASE_URL}/repayment/securities/${securityId}/collaterals`);
    return response.data; // Mengembalikan ApiResponse<SecurityCollateral[]>
  }
};