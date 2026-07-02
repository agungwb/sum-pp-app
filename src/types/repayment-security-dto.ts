export interface SecurityLookupItem {
    id: string;
    investeeId: string;
    investeeName: string;
    investeeNameLegal: string;
    investeeIconUrl: string;
    securityId: string;
    securityType: string;
    securityName: string;
    securityCode: string;
    securitySeries: number;
    securityPhase: number;
    securitySequence: number;
  }
  
  export interface RepaymentSecurityDTO {
    id: string | null;
    investee_id: string;
    investee_name: string;
    investee_name_legal: string;
    investee_icon_url: string;
    security_id: string;
    security_type: string;
    security_name: string;
    security_code: string;
    security_series: number;
    security_phase: number;
    security_sequence: number;
  
    contract_start_date: string;
    contract_end_date: string;
    contract_duration_in_months: number;
    contract_status: string;
  
    contract_underlying_fund: number;
    contract_yield_amount: number;
    contract_yield_rate_annually: number;
    contract_fee_administration: number;
    contract_fee_administration_percentage: number;
    contract_fee_provision: number;
    contract_fee_provision_percentage: number;
    contract_fee_platform: number;
    contract_fee_platform_percentage: number;
    contract_fee_servicing: number;
    contract_fee_servicing_percentage: number;
    contract_fee_monitoring_monthly: number;
    contract_fee_monitoring_percentage_monthly: number;
    contract_fee_monitoring: number;
    contract_fee_monitoring_percentage: number;
  
    contract_tax_ppn: string;
    contract_tax_factor: string;
    contract_tax_yield: string;
    contract_penalty_percentage_daily: string;
  
    contract_escrow_bank: string;
    contract_escrow_account: string;
    contract_va_bank: string;
    contract_va_number: string;
    contract_contact_email: string;
    contract_contact_whatsapp: string;
  
    contract_document_title: string;
    contract_document_number: string;
    contract_document_url: File | null;
    generate_schedule_flag: boolean;
    restruct_order: number | null;
    restruct_parent_security_id: string | null;
    restruct_original_security_id: string | null;
  }