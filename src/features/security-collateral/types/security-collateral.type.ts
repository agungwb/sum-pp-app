import { CollateralStatus, CollateralType, VerificationStatus } from './security-collateral.enum';

export interface SecurityCollateral {
  // Identifiers & Relations
  id: string; // UUID
  repaymentSecurityId: string; // UUID

  // Core Collateral Info
  collateralType: CollateralType;
  collateralDescription: string | null;
  collateralValueEstimated: number; // Appraiser estimation
  collateralStatus: CollateralStatus | null;
  executionTime: string | null; // ISO Datetime string
  documentUrl: string | null;

  // Administrative: Document Verification
  verificationDocumentStatus: VerificationStatus | null;
  verificationDocumentNotes: string | null;
  verificationDocumentBy: string | null;
  verificationDocumentAt: string | null; // ISO Datetime string

  // Administrative: Field/On-Site Verification
  verificationFieldStatus: VerificationStatus | null;
  verificationFieldNotes: string | null;
  verificationFieldBy: string | null;
  verificationFieldAt: string | null; // ISO Datetime string

  // Administrative: Legal & Notary Verification
  verificationLegalStatus: VerificationStatus | null;
  verificationLegalNotes: string | null;
  verificationLegalBy: string | null;
  verificationLegalAt: string | null; // ISO Datetime string

  // Administrative: Appraisal & Value Verification
  verificationValueStatus: VerificationStatus | null;
  verificationValueNotes: string | null;
  verificationValueBy: string | null;
  verificationValueAt: string | null; // ISO Datetime string

  // Audit Trails
  createdBy: string;
  createdAt: string; // ISO Datetime string
  updatedBy: string;
  updatedAt: string; // ISO Datetime string
  deletedBy: string | null;
  deletedAt: string | null; // ISO Datetime string
}

export interface SecurityCollateralItem {
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

export interface SecurityCollateralSummary {
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