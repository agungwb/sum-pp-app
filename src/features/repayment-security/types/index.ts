export enum ContractStatus {
    PERFORMING = 'PERFORMING',
    OBSERVATION = 'OBSERVATION',
    SUBSTANDARD = 'SUBSTANDARD',
    DOUBTFUL = 'DOUBTFUL',
    DEFAULTED = 'DEFAULTED',
  }
  
  export enum SecurityType {
    SUKUK = 'SUKUK',
    SAHAM = 'SAHAM',
  }
  
  export interface RepaymentSecurity {
    id: string;
    investeeId: string;
    investeeName: string;
    investeeNameLegal: string;
    investeeIconUrl?: string;
    securityId: string;
    securityType: SecurityType;
    securityName: string;
    securityCode: string;
    securitySeries: number;
    securityPhase: number;
    securitySequence: number;
    contractStartDate: string;
    contractEndDate: string;
    contractDurationInMonths: number;
    contractStatus: ContractStatus;
    // tambahkan sisa field numerik finansial lainnya...
  }
  
  export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
  }