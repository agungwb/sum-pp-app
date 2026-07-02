// src/components/repayment/RepaymentSecurityForm.tsx
import React, { useState, useEffect } from 'react';
import { useSidePanel } from '../../context/SidePanelContext';
import { RepaymentSecurityDTO, SecurityLookupItem } from '../../types/repayment-security-dto';
import { NumericInput } from './NumericInput';

const colSpanClasses: Record<string, string> = {
  "1": "col-span-1",
  "2": "col-span-2",
};

// --- KOMPONEN BANTUAN UI ---
const FormGroup = ({ title, children }: any) => (
  <div className="mb-2 ">
    {/* Warna dan ukuran judul grup disesuaikan menjadi normal dan tidak orange */}
    <h3 className="text-xs font-semibold text-slate-700 mb-4 pb-2 border-b border-slate-100">{title}</h3>
    <div className="grid grid-cols-2 gap-3">
      {children}
    </div>
  </div>
);

const Select = ({ label, hasError, colSpan = "1", ...props }: any) => {
  const baseClass = "w-full px-3 py-2 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors";
  const errorClass = hasError ? "border-red-500 bg-red-50" : "border-slate-200";
  const disabledClass = props.disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "bg-white text-slate-700";

  return (
    <div className={colSpanClasses[colSpan] || ""}>
      <label className="block text-[10px] font-semibold text-slate-600 mb-1">{label}</label>
      <select className={`${baseClass} ${errorClass} ${disabledClass}`} {...props}>
        {props.children}
      </select>
    </div>
  );
};

const Input = ({ label, hasError, colSpan = "1", ...props }: any) => {
  const baseClass = "w-full px-3 py-2 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors";
  const errorClass = hasError ? "border-red-500 bg-red-50" : "border-slate-200";
  const disabledClass = props.disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "bg-white text-slate-700";

  return (
    <div className={colSpanClasses[colSpan] || ""}>
      <label className="block text-[10px] font-semibold text-slate-600 mb-1">{label}</label>
      <input className={`${baseClass} ${errorClass} ${disabledClass}`} {...props} />
    </div>
  );
};

const NumberField = ({ label, hasError, value, onValueChange, colSpan = "1", ...props }: any) => (
  <div className={colSpanClasses[colSpan] || ""}>
    <label className="block text-[10px] font-semibold text-slate-600 mb-1">{label}</label>
    <NumericInput value={value} onValueChange={onValueChange} hasError={hasError} {...props} />
  </div>
);

const Toggle = ({ label, checked, onChange, colSpan = "1", ...props }: any) => (
  <div className={`flex items-center justify-between p-3 border rounded-md border-slate-200 bg-white ${colSpanClasses[colSpan] || ""}`}>
    <span className="text-xs font-semibold text-slate-700">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-10 h-5 rounded-full transition-colors relative ${checked ? 'bg-amber-500' : 'bg-slate-300'}`} {...props} 
    >
      <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  </div>
);

const ConfirmModal = ({ isOpen, onClose, onConfirm }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 text-center">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Konfirmasi</h3>
        <p className="text-sm text-slate-600 mb-6">Apakah data yang disubmit sudah sesuai?</p>
        <div className="flex justify-center gap-4">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">Batal</button>
          <button type="button" onClick={onConfirm} className="px-4 py-2 text-sm font-semibold text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors">Ya, Submit</button>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA ---
export default function RepaymentSecurityForm ({ initialData, onSubmit, onCancel, isLoading }: any) {
  // export default function RepaymentSecurityForm({ initialData, onSubmit, isLoading, onCancel }: RepaymentSecurityFormProps) {
  const { closePanel } = useSidePanel();
  const isEditMode = !!initialData?.id;

  const [formData, setFormData] = useState<RepaymentSecurityDTO>({
    id: initialData?.id || null, // hidden, null/0 if add mode
    investee_id: initialData?.investee_id || '',
    investee_name: initialData?.investee_name || '',
    investee_name_legal: initialData?.investee_name_legal || '',
    investee_icon_url: initialData?.investee_icon_url || '',
    security_id: initialData?.security_id || '',
    security_type: initialData?.security_type || '',
    security_name: initialData?.security_name || '',
    security_code: initialData?.security_code || '',
    security_series: initialData?.security_series || 0,
    security_phase: initialData?.security_phase || 0,
    security_sequence: initialData?.security_sequence || 0,
    
    contract_start_date: initialData?.contract_start_date || '',
    contract_end_date: initialData?.contract_end_date || '',
    contract_duration_in_months: initialData?.contract_duration_in_months || 0,
    contract_status: initialData?.contract_status || '',
    
    contract_underlying_fund: initialData?.contract_underlying_fund || 0,
    contract_yield_amount: initialData?.contract_yield_amount || 0,
    contract_yield_rate_annually: initialData?.contract_yield_rate_annually || 0,
    contract_fee_administration: initialData?.contract_fee_administration || 0,
    contract_fee_administration_percentage: initialData?.contract_fee_administration_percentage || 0,
    contract_fee_provision: initialData?.contract_fee_provision || 0,
    contract_fee_provision_percentage: initialData?.contract_fee_provision_percentage || 0,
    contract_fee_platform: initialData?.contract_fee_platform || 0,
    contract_fee_platform_percentage: initialData?.contract_fee_platform_percentage || 0,
    contract_fee_servicing: initialData?.contract_fee_servicing || 0,
    contract_fee_servicing_percentage: initialData?.contract_fee_servicing_percentage || 0,
    contract_fee_monitoring_monthly: initialData?.contract_fee_monitoring_monthly || 0,
    contract_fee_monitoring_percentage_monthly: initialData?.contract_fee_monitoring_percentage_monthly || 0,
    contract_fee_monitoring: initialData?.contract_fee_monitoring || 0,
    contract_fee_monitoring_percentage: initialData?.contract_fee_monitoring_percentage || 0,
    
    contract_tax_ppn: initialData?.contract_tax_ppn || '',
    contract_tax_factor: initialData?.contract_tax_factor || '',
    contract_tax_yield: initialData?.contract_tax_yield || '',
    contract_penalty_percentage_daily: initialData?.contract_penalty_percentage_daily || '',
    
    contract_escrow_bank: initialData?.contract_escrow_bank || '',
    contract_escrow_account: initialData?.contract_escrow_account || '',
    contract_va_bank: initialData?.contract_va_bank || '',
    contract_va_number: initialData?.contract_va_number || '',
    contract_contact_email: initialData?.contract_contact_email || '',
    contract_contact_whatsapp: initialData?.contract_contact_whatsapp || '',
    
    contract_document_title: initialData?.contract_document_title || '',
    contract_document_number: initialData?.contract_document_number || '',
    contract_document_url: null,
    generate_schedule_flag: initialData?.generate_schedule_flag !== undefined ? initialData.generate_schedule_flag : true,
    restruct_order: initialData?.restruct_order || null,
    restruct_parent_security_id: initialData?.restruct_parent_security_id || null,
    restruct_original_security_id: initialData?.restruct_original_security_id || null,
  });

  const [securities, setSecurities] = useState<SecurityLookupItem[]>([]);
  const [selectedLookupId, setSelectedLookupId] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // FETCH Data Security
  useEffect(() => {
    fetch('http://localhost:3000/repayment/securities/lookup')
      .then(res => res.json())
      .then(res => {
        if (res.statusCode === 200) {
          setSecurities(res.data.items);
          // Set lookup default ID if editing
          if (formData.security_code) {
             const matched = res.data.items.find((s: any) => s.securityCode === formData.security_code);
             if (matched) setSelectedLookupId(matched.id);
          }
        }
      })
      .catch(err => console.error("Failed fetching lookup", err));
  }, []);

  // AUTO CALCULATE DURATION
  const countMonths = (start: string, end: string) => {
    if (!start || !end) return 0;
    const d1 = new Date(start);
    const d2 = new Date(end);
    let months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  };

  useEffect(() => {
    if (formData.contract_start_date && formData.contract_end_date) {
      const duration = countMonths(formData.contract_start_date, formData.contract_end_date);
      if (duration !== formData.contract_duration_in_months) {
        setFormData(prev => {
          const fund = prev.contract_underlying_fund;
          const rate = prev.contract_yield_rate_annually;
          
          const yieldAmt = fund * (rate / 100) * (duration / 12);
          
          return {
            ...prev,
            contract_duration_in_months: duration,
            contract_yield_amount: yieldAmt,
            contract_fee_monitoring: prev.contract_fee_monitoring_monthly * duration,
            contract_fee_monitoring_percentage: prev.contract_fee_monitoring_percentage_monthly * duration
          };
        });
      }
    }
  }, [formData.contract_start_date, formData.contract_end_date]);

  // GROUP 3 KALKULATOR
  const handleGroup3Change = (field: keyof RepaymentSecurityDTO, val: number) => {
    let newData = { ...formData, [field]: val };
    const fund = field === 'contract_underlying_fund' ? val : formData.contract_underlying_fund;
    const duration = formData.contract_duration_in_months;

    if (['contract_underlying_fund', 'contract_yield_rate_annually'].includes(field)) {
       const rate = field === 'contract_yield_rate_annually' ? val : formData.contract_yield_rate_annually;
       newData.contract_yield_amount = fund * (rate / 100) * (duration / 12);
    }

    const calculateFee = (nameBase: string) => {
      const feeField = `contract_fee_${nameBase}` as keyof RepaymentSecurityDTO;
      const pctField = `contract_fee_${nameBase}_percentage` as keyof RepaymentSecurityDTO;
      
      if (field === feeField) {
        newData[pctField] = fund > 0 ? (val / fund) * 100 : 0 as any;
      } else if (field === pctField) {
        newData[feeField] = (val / 100) * fund as any;
      }
    };

    calculateFee('administration');
    calculateFee('provision');
    calculateFee('platform');
    calculateFee('servicing');

    if (field === 'contract_fee_monitoring_monthly') {
      newData.contract_fee_monitoring_percentage_monthly = fund > 0 ? (val / fund) * 100 : 0;
      newData.contract_fee_monitoring = val * duration;
      newData.contract_fee_monitoring_percentage = newData.contract_fee_monitoring_percentage_monthly * duration;
    } else if (field === 'contract_fee_monitoring_percentage_monthly') {
      newData.contract_fee_monitoring_monthly = (val / 100) * fund;
      newData.contract_fee_monitoring = newData.contract_fee_monitoring_monthly * duration;
      newData.contract_fee_monitoring_percentage = val * duration;
    }

    if (field === 'contract_underlying_fund') {
      newData.contract_fee_administration = (formData.contract_fee_administration_percentage / 100) * fund;
      newData.contract_fee_provision = (formData.contract_fee_provision_percentage / 100) * fund;
      newData.contract_fee_platform = (formData.contract_fee_platform_percentage / 100) * fund;
      newData.contract_fee_servicing = (formData.contract_fee_servicing_percentage / 100) * fund;
      newData.contract_fee_monitoring_monthly = (formData.contract_fee_monitoring_percentage_monthly / 100) * fund;
      newData.contract_fee_monitoring = newData.contract_fee_monitoring_monthly * duration;
    }

    setFormData(newData);
  };

  // VALIDASI FORM
  const isError = (field: keyof RepaymentSecurityDTO) => {
    if (!showErrors) return false;
    const val = formData[field];
    if (val === '' || val === null || val === undefined) return true;
    if (field === 'contract_underlying_fund' && val === 0) return true;
    return false;
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    
    const required = [
      'security_name', 'contract_start_date', 'contract_end_date', 'contract_status',
      'contract_underlying_fund', 'contract_tax_ppn', 'contract_tax_factor', 'contract_tax_yield',
      'contract_penalty_percentage_daily', 'contract_escrow_bank', 'contract_escrow_account',
      'contract_va_bank', 'contract_va_number', 'contract_contact_email', 'contract_contact_whatsapp'
    ];
    
    let isValid = true;
    for (const field of required) {
      const val = formData[field as keyof RepaymentSecurityDTO];
      if (val === '' || val === null || val === undefined) isValid = false;
      if (field === 'contract_underlying_fund' && val === 0) isValid = false;
    }

    if (isValid) setShowConfirmModal(true);
  };

  const isGroup3Active = formData.contract_underlying_fund > 0 && formData.contract_duration_in_months > 0;

  return (
    // Struktur flex-col dengan height penuh agar header dan footer menempel (fixed position / sticky)
    <div className="flex flex-col h-full bg-slate-white relative">
      
      {/* HEADER: Fixed di Atas */}
      <div className="shrink-0 border-b border-slate-200 px-5 py-4 bg-white flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            {isEditMode ? 'Ubah Repayment Security' : 'Tambah Repayment Security'}
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Lengkapi data formulir di bawah ini dengan akurat.
          </p>
        </div>
      </div>

      <ConfirmModal 
        isOpen={showConfirmModal} 
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          onSubmit(formData);
        }}
      />

      {/* BODY FORM: Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 pb-20">
        <form className="max-w-6xl mx-auto space-y-4">
          
          {/* HIDDEN FIELD */}
          <input type="hidden" value={formData.id || ''} />
          <input type="hidden" value={formData.investee_id} />
          <input type="hidden" value={formData.security_id} />
          <input type="hidden" value={formData.restruct_order || ''} />
          <input type="hidden" value={formData.restruct_parent_security_id || ''} />
          <input type="hidden" value={formData.restruct_original_security_id || ''} />

          <FormGroup title="GROUP 1: Informasi Penerbit dan Efek">
            <Select 
              label="Nama Efek" 
              hasError={isError('security_name')}
              value={selectedLookupId} 
              colSpan="2"
              onChange={(e: any) => {
                const valId = e.target.value;
                setSelectedLookupId(valId);
                const item = securities.find(s => s.id === valId);
                if (item) {
                  setFormData({
                    ...formData,
                    investee_id: item.investeeId,
                    investee_name: item.investeeName,
                    investee_name_legal: item.investeeNameLegal,
                    investee_icon_url: item.investeeIconUrl,
                    security_id: item.securityId,
                    security_type: item.securityType,
                    security_name: item.securityName, 
                    security_code: item.securityCode,
                    security_series: item.securitySeries,
                    security_phase: item.securityPhase,
                    security_sequence: item.securitySequence,
                  });
                } else {
                  setFormData({ ...formData, security_name: '' }); 
                }
              }}
            >
              <option value="">-- Pilih Security Name --</option>
              {securities.map(s => <option key={s.id} value={s.id}>{s.securityName} - {s.securityCode}</option>)}
            </Select>
            <Input label="Investee Name" disabled value={formData.investee_name} />
            <Input label="Investee Name Legal" disabled value={formData.investee_name_legal} />
            <Input label="Investee Icon URL" disabled value={formData.investee_icon_url} />
            <Input label="Security Type" disabled value={formData.security_type} />
            <Input label="Security Code" disabled value={formData.security_code} />
            <Input label="Security Series" disabled value={formData.security_series} />
            <Input label="Security Phase" disabled value={formData.security_phase} />
            <Input label="Security Sequence" disabled value={formData.security_sequence} />
          </FormGroup>

          <FormGroup title="GROUP 2: Jangka Waktu">
            <Input type="date" label="Contract Start Date" hasError={isError('contract_start_date')} value={formData.contract_start_date} onChange={(e: any) => setFormData({...formData, contract_start_date: e.target.value})} />
            <Input type="date" label="Contract End Date" hasError={isError('contract_end_date')} value={formData.contract_end_date} onChange={(e: any) => setFormData({...formData, contract_end_date: e.target.value})} />
            <Input label="Contract Duration (Months)" disabled value={formData.contract_duration_in_months} />
            <Select label="Contract Status" hasError={isError('contract_status')} value={formData.contract_status} onChange={(e: any) => setFormData({...formData, contract_status: e.target.value})}>
              <option value="">-- Pilih Contract Status --</option>
              <option value="PERFORMING">PERFORMING</option>
              <option value="OBSERVATION">OBSERVATION</option>
              <option value="SUBSTANDARD">SUBSTANDARD</option>
              <option value="DOUBTFUL">DOUBTFUL</option>
              <option value="DEFAULTED">DEFAULTED</option>
            </Select>
          </FormGroup>

          <FormGroup title="GROUP 3: FUNDING, YIELD & FEE">
            <NumberField label="Underlying Fund" hasError={isError('contract_underlying_fund')} value={formData.contract_underlying_fund} onValueChange={(v: number) => handleGroup3Change('contract_underlying_fund', v)} colSpan="2"/>
            <NumberField label="Yield Rate Annually (%)" disabled={!isGroup3Active} value={formData.contract_yield_rate_annually} onValueChange={(v: number) => handleGroup3Change('contract_yield_rate_annually', v)} />
            <NumberField label="Yield Amount" disabled value={formData.contract_yield_amount} onValueChange={() => {}} />

            <NumberField label="Fee Administration" disabled={!isGroup3Active} value={formData.contract_fee_administration} onValueChange={(v: number) => handleGroup3Change('contract_fee_administration', v)} />
            <NumberField label="Fee Admin (%)" disabled={!isGroup3Active} value={formData.contract_fee_administration_percentage} onValueChange={(v: number) => handleGroup3Change('contract_fee_administration_percentage', v)} />

            <NumberField label="Fee Provision" disabled={!isGroup3Active} value={formData.contract_fee_provision} onValueChange={(v: number) => handleGroup3Change('contract_fee_provision', v)} />
            <NumberField label="Fee Provision (%)" disabled={!isGroup3Active} value={formData.contract_fee_provision_percentage} onValueChange={(v: number) => handleGroup3Change('contract_fee_provision_percentage', v)} />

            <NumberField label="Fee Platform" disabled={!isGroup3Active} value={formData.contract_fee_platform} onValueChange={(v: number) => handleGroup3Change('contract_fee_platform', v)} />
            <NumberField label="Fee Platform (%)" disabled={!isGroup3Active} value={formData.contract_fee_platform_percentage} onValueChange={(v: number) => handleGroup3Change('contract_fee_platform_percentage', v)} />

            <NumberField label="Fee Servicing" disabled={!isGroup3Active} value={formData.contract_fee_servicing} onValueChange={(v: number) => handleGroup3Change('contract_fee_servicing', v)} />
            <NumberField label="Fee Servicing (%)" disabled={!isGroup3Active} value={formData.contract_fee_servicing_percentage} onValueChange={(v: number) => handleGroup3Change('contract_fee_servicing_percentage', v)} />

            <NumberField label="Fee Monitoring (Monthly)" disabled={!isGroup3Active} value={formData.contract_fee_monitoring_monthly} onValueChange={(v: number) => handleGroup3Change('contract_fee_monitoring_monthly', v)} />
            <NumberField label="Fee Monitoring Monthly (%)" disabled={!isGroup3Active} value={formData.contract_fee_monitoring_percentage_monthly} onValueChange={(v: number) => handleGroup3Change('contract_fee_monitoring_percentage_monthly', v)} />

            <NumberField label="Total Fee Monitoring" disabled value={formData.contract_fee_monitoring} onValueChange={() => {}} />
            <NumberField label="Total Fee Monitoring (%)" disabled value={formData.contract_fee_monitoring_percentage} onValueChange={() => {}} />
          </FormGroup>

          <FormGroup title="GROUP 4: TAX and Penalty">
            <Select label="Tax PPN (%)" hasError={isError('contract_tax_ppn')} value={formData.contract_tax_ppn} onChange={(e: any) => setFormData({...formData, contract_tax_ppn: e.target.value})}>
              <option value="">-- Pilih Tax PPN --</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
            </Select>
            <Select label="Tax Factor" hasError={isError('contract_tax_factor')} value={formData.contract_tax_factor} onChange={(e: any) => setFormData({...formData, contract_tax_factor: e.target.value})}>
              <option value="">-- Pilih Tax Factor --</option>
              <option value="1">1</option>
              <option value="11/12">11/12</option>
            </Select>
            <Select label="Tax Yield (%)" hasError={isError('contract_tax_yield')} value={formData.contract_tax_yield} onChange={(e: any) => setFormData({...formData, contract_tax_yield: e.target.value})}>
              <option value="">-- Pilih Tax Yield --</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </Select>
            <Select label="Penalty Percentage Daily" hasError={isError('contract_penalty_percentage_daily')} value={formData.contract_penalty_percentage_daily} onChange={(e: any) => setFormData({...formData, contract_penalty_percentage_daily: e.target.value})}>
              <option value="">-- Pilih Penalty --</option>
              <option value="0.001">1/1000</option>
              <option value="0.002">2/1000</option>
              <option value="0.003">3/1000</option>
            </Select>
          </FormGroup>

          <FormGroup title="GROUP 5: PAYMENT AND CONTACT">
            <Select label="Escrow Bank" hasError={isError('contract_escrow_bank')} value={formData.contract_escrow_bank} onChange={(e: any) => setFormData({...formData, contract_escrow_bank: e.target.value})}>
              <option value="">-- Pilih Escrow Bank --</option>
              <option value="BJB Syariah">BJB Syariah</option>
              <option value="Bank Mega Syariah">Bank Mega Syariah</option>
            </Select>
            <Input label="Escrow Account" hasError={isError('contract_escrow_account')} value={formData.contract_escrow_account} onChange={(e: any) => setFormData({...formData, contract_escrow_account: e.target.value})} />
            <Select label="VA Bank" hasError={isError('contract_va_bank')} value={formData.contract_va_bank} onChange={(e: any) => setFormData({...formData, contract_va_bank: e.target.value})}>
              <option value="">-- Pilih VA Bank --</option>
              <option value="BCA">BCA</option>
              <option value="BNI">BNI</option>
              <option value="BRI">BRI</option>
              <option value="Mandiri">Mandiri</option>
            </Select>
            <Input label="VA Number" hasError={isError('contract_va_number')} value={formData.contract_va_number} onChange={(e: any) => setFormData({...formData, contract_va_number: e.target.value})} />
            <Input type="email" label="Contact Email" hasError={isError('contract_contact_email')} value={formData.contract_contact_email} onChange={(e: any) => setFormData({...formData, contract_contact_email: e.target.value})} />
            <Input type="tel" label="Contact WhatsApp" hasError={isError('contract_contact_whatsapp')} value={formData.contract_contact_whatsapp} onChange={(e: any) => setFormData({...formData, contract_contact_whatsapp: e.target.value})} />
          </FormGroup>

          <FormGroup title="GROUP 6: DOCUMENT">
            <Input label="Document Title" value={formData.contract_document_title} onChange={(e: any) => setFormData({...formData, contract_document_title: e.target.value})} />
            <Input label="Document Number" value={formData.contract_document_number} onChange={(e: any) => setFormData({...formData, contract_document_number: e.target.value})} />
            <div className="col-span-2 border-slate-200 px-6 py-4 border-b-2 rounded-lg">
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Document URL (File Lokal)</label>
              <input type="file" className="w-full text-xs" onChange={(e) => setFormData({...formData, contract_document_url: e.target.files ? e.target.files[0] : null})} />
            </div>
            
          </FormGroup>

          <FormGroup>
            <Toggle label="Generate Jadwal Pembayaran" checked={formData.generate_schedule_flag} onChange={(val: boolean) => setFormData({...formData, generate_schedule_flag: val})} colSpan="2" />
          </FormGroup>
        </form>
      </div>

      {/* FOOTER: Fixed di Bawah */}
      <div className="sticky bottom-0 z-50 bg-white border-t border-slate-200 px-6 py-4 flex justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      
        <button 
          type="button" 
          onClick={closePanel}
          className="px-4 py-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handlePreSubmit}
          disabled={isLoading}
          className="px-6 py-2 text-xs font-bold text-white bg-amber-600 rounded-md shadow hover:bg-amber-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Tambahkan Data')}
        </button>
      </div>

    </div>
  );
};