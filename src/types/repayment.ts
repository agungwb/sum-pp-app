// src/types/repayment.ts

export type ContractStatus = 
  | 'PERFORMING' 
  | 'OBSERVATION' 
  | 'SUBSTANDARD' 
  | 'DOUBTFUL' 
  | 'DEFAULTED' 
  | 'FINISHED';

export type SecurityType = 'Sukuk' | 'Saham';

export interface RepaymentSecurity {
  id: string;
  investeeId: string;
  investeeName: string;
  investeeNameLegal: string;
  securityId: string;
  securityType: SecurityType;
  securityName: string;
  contractDocumentTitle: string;
  contractDocumentNumber: string;
  contractUnderlyingFund: string;
  contractStartDate: string;
  contractEndDate: string;
  contractDurationInMonths: number;
  contractStatus: ContractStatus;
  contractYieldAmount: string;
  contractYieldRateAnnually: string;
  // Field lain dari JSON bisa ditambahkan jika nanti dibutuhkan
}

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}