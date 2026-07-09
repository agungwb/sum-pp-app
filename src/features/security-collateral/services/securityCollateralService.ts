import axios from 'axios';
import { ApiResponse } from '../../../types/api.type'; // Sesuaikan path dengan lokasi api.type.ts Anda
import { SecurityCollateralDetailResponse, SecurityCollateralRequest, SecurityCollateralResponse } from '../dtos/security-collateral.dto';

const BASE_URL = 'http://localhost:3000';

export const securityCollateralService = {
  createCollateral: async (securityId: string, payload: SecurityCollateralRequest): Promise<ApiResponse<SecurityCollateralResponse>> => {
    const response = await axios.post(`${BASE_URL}/repayment/securities/${securityId}/collaterals`, payload);
    return response.data;
  },

  updateCollateral: async (collateralId: string, payload: SecurityCollateralRequest): Promise<ApiResponse<SecurityCollateralResponse>> => {
    const response = await axios.put(`${BASE_URL}/security/collaterals/${collateralId}`, payload);
    return response.data;
  },

  // getCollateralsBySecurityId: async (securityId: string): Promise<ApiResponse<SecurityCollateralResponse>> => {
  //   const response = await axios.get(`${BASE_URL}/repayment/securities/${securityId}/collaterals`);
  //   return response.data;
  // },

  getBySecurityId: async (securityId: string) => {
    const response = await axios.get(`${BASE_URL}/repayment/securities/${securityId}/collaterals`);
    return response.data; // Mengembalikan ApiResponse<SecurityCollateral[]>
  },

  getCollateralsBySecurityId: async (
    securityId: string
  ): Promise<ApiResponse<SecurityCollateralDetailResponse>> => {
    const response = await axios.get(
      `${BASE_URL}/repayment/securities/${securityId}/collaterals`
    );
    return response.data;
  },

  /**
   * Mengambil detail tunggal spesifik collateral berdasarkan collateral ID
   */
  getCollateralById: async (
    collateralId: string
  ): Promise<ApiResponse<SecurityCollateralDetailResponse>> => {
    const response = await axios.get(
      `${BASE_URL}/security/collaterals/${collateralId}`
    );
    return response.data;
  }
};