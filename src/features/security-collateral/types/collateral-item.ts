export interface CollateralItem {
    id: string;
    repaymentSecurityId: string;
    collateralType: string;
    collateralDescription: string;
    collateralValueEstimated: string;
    collateralStatus: string;
    executionTime: string | null;
    documentUrl: string | null;
    verificationDocumentStatus: string;
    verificationDocumentNotes: string | null;
    verificationFieldStatus: string;
    verificationFieldNotes: string | null;
    verificationLegalStatus: string;
    verificationLegalNotes: string | null;
    verificationValueStatus: string;
    verificationValueNotes: string | null;
    createdAt: string;
  }

  export interface SecurityCollateral {
    id: string;
    repaymentSecurityId: string;
    collateralType: string;
    collateralDescription: string;
    collateralValueEstimated: number;
    collateralStatus: string | null;
    executionTime: string | null;
    documentUrl: string | null;
    verificationDocumentStatus: string | null;
    verificationFieldStatus: string | null;
    verificationLegalStatus: string | null;
    verificationValueStatus: string | null;
  }