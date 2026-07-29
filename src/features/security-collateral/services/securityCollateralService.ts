import axios from 'axios';
import { ApiResponse } from '../../../types/api.type'; // Sesuaikan path dengan lokasi api.type.ts Anda
import { SecurityCollateralDetailResponse, SecurityCollateralFormRequest, SecurityCollateralEditFormResponse } from '../dtos/security-collateral.dto';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const REPAYMENT_SECURITY_URL = 'repayment/securities';
const SECURITY_COLLATERAL_URL = 'security/collaterals';

const apiClient = axios.create({
  baseURL: `${BASE_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const securityCollateralService = {

  // getCollateralsBySecurityId: async (securityId: string): Promise<ApiResponse<SecurityCollateralResponse>> => {
  //   const response = await axios.get(`${BASE_URL}/repayment/securities/${securityId}/collaterals`);
  //   return response.data;
  // },

  // getBySecurityId: async (securityId: string) => {
  //   const response = await axios.get(`${BASE_URL}/repayment/securities/${securityId}/collaterals`);
  //   return response.data; // Mengembalikan ApiResponse<SecurityCollateral[]>
  // },

  

  /* DETAIL */
  getCollateralById: async (collateralId: string): Promise<ApiResponse<SecurityCollateralDetailResponse>> => {
    // const response = await axios.get(
    //   `${BASE_URL}/security/collaterals/${collateralId}`
    // );
    const response = await apiClient.get(`/${SECURITY_COLLATERAL_URL}/${collateralId}`);
    return response.data;
  },

  /* LIST */
  getCollateralsByRepaymentSecurityId: async (repaymentSecurityId: string): Promise<ApiResponse<SecurityCollateralDetailResponse>> => {
    // const response = await axios.get(
    //   `${BASE_URL}/repayment/securities/${repaymentSecurityId}/collaterals`
    // );
    const response = await apiClient.get(`/${REPAYMENT_SECURITY_URL}/${repaymentSecurityId}`);
    return response.data;
  },

  /* CREATE */
  createCollateral: async (repaymentSecurityId: string, payload: SecurityCollateralFormRequest | FormData): Promise<SecurityCollateralDetailResponse> => {
    // const response = await axios.post(`${BASE_URL}/repayment/securities/${securityId}/collaterals`, payload);
    
    let response;

    if (payload instanceof FormData) {
      response = await apiClient.post(`/${REPAYMENT_SECURITY_URL}/${repaymentSecurityId}/collaterals`, payload, {
        // Kita timpa headers-nya khusus untuk request ini saja
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      response = await apiClient.post(`/${REPAYMENT_SECURITY_URL}/${repaymentSecurityId}/collaterals`, payload);
    }
    
    return response.data;
  },

  /* UPDATE */
  updateCollateral: async (collateralId: string, payload: SecurityCollateralFormRequest | FormData): Promise<SecurityCollateralDetailResponse>  => {
    // const response = await axios.put(`${BASE_URL}/security/collaterals/${collateralId}`, payload);

    let response;

    if (payload instanceof FormData) {
      response = await apiClient.put(`/${SECURITY_COLLATERAL_URL}/${collateralId}`, payload, {
        // Kita timpa headers-nya khusus untuk request ini saja
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      response = await apiClient.put(`/${SECURITY_COLLATERAL_URL}/${collateralId}`, payload);
    }

    return response.data;
  },
  
};