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

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  VOID = 'VOID',
  WRITE_OFF = 'WRITE_OFF',
}
