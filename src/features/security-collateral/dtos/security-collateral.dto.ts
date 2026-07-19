// src/modules/security-collateral/dtos/security-collateral.dto.ts

export interface SecurityCollateralDetailResponse {
    id: string;
    repaymentSecurityId: string;
    collateralType: string;
    collateralDescription: string | null;
    collateralValueEstimated: string; // Kolom keuangan dikirim/diterima sebagai string
    collateralStatus: string | null;
    executionTime: string | null;
    documentUrl: string | null;
  
    // Tab Verifikasi Dokumen
    verificationDocumentStatus: string | null;
    verificationDocumentNotes: string | null;
    verificationDocumentBy: string | null;
    verificationDocumentAt: string | null;
  
    // Tab Verifikasi Lapangan (Field)
    verificationFieldStatus: string | null;
    verificationFieldNotes: string | null;
    verificationFieldBy: string | null;
    verificationFieldAt: string | null;
  
    // Tab Verifikasi Legal
    verificationLegalStatus: string | null;
    verificationLegalNotes: string | null;
    verificationLegalBy: string | null;
    verificationLegalAt: string | null;
  
    // Tab Verifikasi Nilai (Value)
    verificationValueStatus: string | null;
    verificationValueNotes: string | null;
    verificationValueBy: string | null;
    verificationValueAt: string | null;
  
    // Audit Trails
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    deletedBy: string | null;
    deletedAt: string | null;
  }
  

export interface SecurityCollateralFormRequest {
    repaymentSecurityId: string;
    collateralType: string;
    collateralDescription: string;
    collateralValueEstimated: string;
    collateralStatus: string;
    executionTime: string | null;
    documentUrl: File | null; 
    
    // Group Dokumen
    verificationDocumentStatus: string;
    verificationDocumentNotes: string;
    verificationDocumentBy: string;
    verificationDocumentAt: string;
    
    // Group Lapangan
    verificationFieldStatus: string;
    verificationFieldNotes: string;
    verificationFieldBy: string;
    verificationFieldAt: string;
    
    // Group Legal
    verificationLegalStatus: string;
    verificationLegalNotes: string;
    verificationLegalBy: string;
    verificationLegalAt: string;
    
    // Group Nilai
    verificationValueStatus: string;
    verificationValueNotes: string;
    verificationValueBy: string;
    verificationValueAt: string;
  }
  
  export interface SecurityCollateralEditFormResponse {
    id: string;
    repaymentSecurityId: string;
    collateralType: string;
    collateralDescription: string;
    collateralValueEstimated: string;
    collateralStatus: string;
    executionTime: string | null;
    documentUrl: string;
  
    verificationDocumentStatus: string;
    verificationDocumentNotes: string;
    verificationDocumentBy: string;
    verificationDocumentAt: string;
    
    verificationFieldStatus: string;
    verificationFieldNotes: string;
    verificationFieldBy: string;
    verificationFieldAt: string;
    
    verificationLegalStatus: string;
    verificationLegalNotes: string;
    verificationLegalBy: string;
    verificationLegalAt: string;
    
    verificationValueStatus: string;
    verificationValueNotes: string;
    verificationValueBy: string;
    verificationValueAt: string;
    
    createdAt: string;
    updatedAt: string;
  }