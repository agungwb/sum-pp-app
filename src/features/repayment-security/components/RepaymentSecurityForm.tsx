// src/components/repayment/RepaymentSecurityForm.tsx
import React, { useState, useEffect } from 'react';
import { useSidePanel } from '../../../contexts/SidePanelContext';
import { RepaymentSecurityDTO, SecurityLookupItem } from '../services/repayment-security.dto';
import { NumericInput } from '../../../components/repayment/NumericInput';
import { toFrontendPercentage } from '../../../utils/finance';
import { formatDateForInput } from '../../../utils/date';

const colSpanClasses: Record<string, string> = {
  "1": "col-span-1",
  "2": "col-span-2",
};

// --- KOMPONEN BANTUAN UI ---
const FormGroup = ({ title, children }: any) => (
  <div>
    {/* Warna dan ukuran judul grup disesuaikan menjadi normal dan tidak orange */}
    <h3 className="text-xs font-semibold text-slate-700 mb-4 border-b border-slate-100">{title}</h3>
    <div className="grid grid-cols-2 gap-3">
      {children}
    </div>
  </div>
);

const Select = ({ label, hasError, colSpan = "1", isPercentage = false, ...props }: any) => {
  const baseClass = "w-full px-3 py-2 text-xs border rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors";
  const errorClass = hasError ? "border-red-500 bg-red-50" : "border-slate-200";
  const disabledClass = props.disabled ? "bg-slate-50 text-slate-500 cursor-not-allowed" : "bg-white text-slate-700";

  return (
    <>
      {isPercentage ? (
        <div className="flex items-center justify-end gap-2">
          <div className={`basis-4/5 ${colSpanClasses[colSpan] || ""}`}>
            <label className="block text-[10px] font-semibold text-slate-600 mb-1">{label}</label>
            <select className={`${baseClass} ${errorClass} ${disabledClass}`} {...props}>
              {props.children}
            </select>
          </div>
          <div className="basis-1/5 mt-4">
            <div className="text-slate-400 font-semibold">%</div>
          </div>
        </div>
      ) : (
        <div className={colSpanClasses[colSpan] || ""}>
          <label className="block text-[10px] font-semibold text-slate-600 mb-1">{label}</label>
          <select className={`${baseClass} ${errorClass} ${disabledClass}`} {...props}>
            {props.children}
          </select>
        </div>
      )}
    </>
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

const NumberField = ({ label, hasError, value, onValueChange, colSpan = "1", isPercentage=false, ...props }: any) => (
  <div className={colSpanClasses[colSpan] || ""}>
    <label className="block text-[10px] font-semibold text-slate-600 mb-1">{label}</label>
    
    {isPercentage?
      <div className="flex items-center justify-end gap-2">
        <div className="basis-4/5">
        <NumericInput value={value} onValueChange={onValueChange} hasError={hasError} {...props} />
        </div>
        
        <div className="basis-1/5">
          <div className="text-slate-400">%</div>
        </div>
      </div>
    :
      <NumericInput value={value} onValueChange={onValueChange} hasError={hasError} {...props} />
    }

    
  </div>
);

const Toggle = ({ label, checked, onChange, colSpan = "1", ...props }: any) => (
  <div className={`flex items-center justify-between p-3 rounded-md bg-white ${colSpanClasses[colSpan] || ""}`}>
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
    investeeId: initialData?.investeeId || '',
    investeeName: initialData?.investeeName || '',
    investeeNameLegal: initialData?.investeeNameLegal || '',
    investeeIconUrl: initialData?.investeeIconUrl || '',
    securityId: initialData?.securityId || '',
    securityType: initialData?.securityType || '',
    securityName: initialData?.securityName || '',
    securityCode: initialData?.securityCode || '',
    securitySeries: initialData?.securitySeries || 0,
    securityPhase: initialData?.securityPhase || 0,
    securitySequence: initialData?.securitySequence || 0,
    
    contractStartDate: formatDateForInput(initialData?.contractStartDate) || '',
    contractEndDate: formatDateForInput(initialData?.contractEndDate) || '',
    contractDurationInMonths: initialData?.contractDurationInMonths || 0,
    contractStatus: initialData?.contractStatus || '',
    
    contractUnderlyingFund: initialData?.contractUnderlyingFund || 0,
    contractYieldAmount: initialData?.contractYieldAmount || 0,
    contractYieldRateAnnually: toFrontendPercentage(initialData?.contractYieldRateAnnually) || 0,
    contractFeeAdministration: initialData?.contractFeeAdministration || 0,
    contractFeeAdministrationPercentage: toFrontendPercentage(initialData?.contractFeeAdministrationPercentage) || 0,
    contractFeeProvision: initialData?.contractFeeProvision || 0,
    contractFeeProvisionPercentage: toFrontendPercentage(initialData?.contractFeeProvisionPercentage) || 0,
    contractFeePlatform: initialData?.contractFeePlatform || 0,
    contractFeePlatformPercentage: toFrontendPercentage(initialData?.contractFeePlatformPercentage) || 0,
    contractFeeServicing: initialData?.contractFeeServicing || 0,
    contractFeeServicingPercentage: toFrontendPercentage(initialData?.contractFeeServicingPercentage) || 0,

    
    contractFeeMonitoringPercentageMonthly: toFrontendPercentage(initialData?.contractFeeMonitoringPercentageMonthly) || 0,
    contractFeeMonitoringMonthly: initialData?.contractFeeMonitoringPercentageMonthly * initialData?.contractUnderlyingFund || 0,
    contractFeeMonitoringPercentage: toFrontendPercentage(initialData?.contractFeeMonitoringPercentageMonthly * initialData?.contractDurationInMonths) || 0,
    contractFeeMonitoring: initialData?.contractFeeMonitoring  || 0,
   
    contractTaxPpn: initialData?.contractTaxPpn || '',
    contractTaxFactor: initialData?.contractTaxFactor || '',
    contractTaxYield: initialData?.contractTaxYield || '',
    contractPenaltyPercentageDaily: initialData?.contractPenaltyPercentageDaily || '',
    
    contractEscrowBank: initialData?.contractEscrowBank || '',
    contractEscrowAccount: initialData?.contractEscrowAccount || '',
    contractVaBank: initialData?.contractVaBank || '',
    contractVaNumber: initialData?.contractVaNumber || '',
    contractContactEmail: initialData?.contractContactEmail || '',
    contractContactWhatsapp: initialData?.contractContactWhatsapp || '',
    
    contractDocumentTitle: initialData?.contractDocumentTitle || '',
    contractDocumentNumber: initialData?.contractDocumentNumber || '',
    contractDocumentUrl: null,
    restructOrder: initialData?.restructOrder || null,
    restructParentSecurityId: initialData?.restructParentSecurityId || null,
    restructOriginalSecurityId: initialData?.restructOriginalSecurityId || null,

    scheduleUpfrontFlag: true,
    scheduleUpfrontDate: '',
    scheduleInstallmentFlag: true,
    scheduleInstallmentDate: '',
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
          if (formData.securityCode) {
             const matched = res.data.items.find((s: any) => s.securityCode === formData.securityCode);
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
    if (formData.contractStartDate && formData.contractEndDate) {
      const duration = countMonths(formData.contractStartDate, formData.contractEndDate);
      if (duration !== formData.contractDurationInMonths) {
        setFormData(prev => {
          const fund = prev.contractUnderlyingFund;
          const rate = prev.contractYieldRateAnnually;
          
          const yieldAmt = fund * (rate / 100) * (duration / 12);
          
          return {
            ...prev,
            contractDurationInMonths: duration,
            contractYieldAmount: yieldAmt,
            contractFeeMonitoring: prev.contractFeeMonitoringMonthly * duration,
            contractFeeMonitoringPercentage: prev.contractFeeMonitoringPercentageMonthly * duration
          };
        });
      }
    }
  }, [formData.contractStartDate, formData.contractEndDate]);

  // GROUP 3 KALKULATOR
  const handleGroup3Change = (field: keyof RepaymentSecurityDTO, val: number) => {
    let newData = { ...formData, [field]: val };
    const fund = field === 'contractUnderlyingFund' ? val : formData.contractUnderlyingFund;
    const duration = formData.contractDurationInMonths;

    if (['contractUnderlyingFund', 'contractYieldRateAnnually'].includes(field)) {
       const rate = field === 'contractYieldRateAnnually' ? val : formData.contractYieldRateAnnually;
       newData.contractYieldAmount = fund * (rate / 100) * (duration / 12);
    }

    const calculateFee = (nameBase: string) => {
      const feeField = `contractFee${nameBase}` as keyof RepaymentSecurityDTO;
      const pctField = `contractFee${nameBase}Percentage` as keyof RepaymentSecurityDTO;

      // console.log('feeField : ',feeField);
      // console.log('pctField : ',pctField);
      
      if (field === feeField) {
        newData[pctField] = fund > 0 ? (val / fund) * 100 : 0 as any;
      } else if (field === pctField) {
        newData[feeField] = (val / 100) * fund as any;
      }
    };

    calculateFee('Administration');
    calculateFee('Provision');
    calculateFee('Platform');
    calculateFee('Servicing');

    if (field === 'contractFeeMonitoringMonthly') {
      newData.contractFeeMonitoringPercentageMonthly = fund > 0 ? (val / fund) * 100 : 0;
      newData.contractFeeMonitoring = val * duration;
      newData.contractFeeMonitoringPercentage = newData.contractFeeMonitoringPercentageMonthly * duration;
    } else if (field === 'contractFeeMonitoringPercentageMonthly') {
      newData.contractFeeMonitoringMonthly = (val / 100) * fund;
      newData.contractFeeMonitoring = newData.contractFeeMonitoringMonthly * duration;
      newData.contractFeeMonitoringPercentage = val * duration;
    }

    if (field === 'contractUnderlyingFund') {
      newData.contractFeeAdministration = (formData.contractFeeAdministrationPercentage / 100) * fund;
      newData.contractFeeProvision = (formData.contractFeeProvisionPercentage / 100) * fund;
      newData.contractFeePlatform = (formData.contractFeePlatformPercentage / 100) * fund;
      newData.contractFeeServicing = (formData.contractFeeServicingPercentage / 100) * fund;
      newData.contractFeeMonitoringMonthly = (formData.contractFeeMonitoringPercentageMonthly / 100) * fund;
      newData.contractFeeMonitoring = newData.contractFeeMonitoringMonthly * duration;
    }

    setFormData(newData);
  };

  // VALIDASI FORM
  const isError = (field: keyof RepaymentSecurityDTO) => {
    if (!showErrors) return false;
    const val = formData[field];
    if (val === '' || val === null || val === undefined) return true;
    if (field === 'contractUnderlyingFund' && val === 0) return true;
    return false;
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    
    const required = [
      'securityName', 'contractStartDate', 'contractEndDate', 'contractStatus',
      'contractUnderlyingFund', 'contractTaxPpn', 'contractTaxFactor', 'contractTaxYield',
      'contractPenaltyPercentageDaily', 'contractEscrowBank', 'contractEscrowAccount',
      'contractVaBank', 'contractVaNumber', 'contractContactEmail', 'contractContactWhatsapp'
    ];
    
    let isValid = true;
    for (const field of required) {
      const val = formData[field as keyof RepaymentSecurityDTO];
      if (val === '' || val === null || val === undefined) isValid = false;
      if (field === 'contractUnderlyingFund' && val === 0) isValid = false;
    }

    if (isValid) setShowConfirmModal(true);
  };

  const isGroup3Active = formData.contractUnderlyingFund > 0 && formData.contractDurationInMonths > 0;

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
      <div className="flex-1 overflow-y-auto px-8 pb-8">
        <form className="max-w-6xl mx-auto space-y-8">
          
          {/* HIDDEN FIELD */}
          <input type="hidden" value={formData.id || ''} />
          <input type="hidden" value={formData.investeeId} />
          <input type="hidden" value={formData.securityId} />
          <input type="hidden" value={formData.restructOrder || ''} />
          <input type="hidden" value={formData.restructParentSecurityId || ''} />
          <input type="hidden" value={formData.restructOriginalSecurityId || ''} />

          <FormGroup title="PENERBIT DAN EFEK">
            <Select 
              label="Nama Efek" 
              hasError={isError('securityName')}
              value={selectedLookupId} 
              colSpan="2"
              onChange={(e: any) => {
                const valId = e.target.value;
                setSelectedLookupId(valId);
                const item = securities.find(s => s.id === valId);
                if (item) {
                  setFormData({
                    ...formData,
                    investeeId: item.investeeId,
                    investeeName: item.investeeName,
                    investeeNameLegal: item.investeeNameLegal,
                    investeeIconUrl: item.investeeIconUrl,
                    securityId: item.securityId,
                    securityType: item.securityType,
                    securityName: item.securityName, 
                    securityCode: item.securityCode,
                    securitySeries: item.securitySeries,
                    securityPhase: item.securityPhase,
                    securitySequence: item.securitySequence,
                  });
                } else {
                  setFormData({ ...formData, securityName: '' }); 
                }
              }}
            >
              <option value="">-- Pilih Security Name --</option>
              {securities.map(s => <option key={s.id} value={s.id}>{s.securityName} - {s.securityCode}</option>)}
            </Select>
            <Input label="Investee Name" disabled value={formData.investeeName} />
            <Input label="Investee Name Legal" disabled value={formData.investeeNameLegal} />
            <Input label="Security Code" disabled value={formData.securityCode} />
            <Input label="Security Type" disabled value={formData.securityType} />
            <Input label="Security Sequence" disabled value={formData.securitySequence} />
            <Input label="Security Series" disabled value={formData.securitySeries} />
            <Input label="Security Phase" disabled value={formData.securityPhase} />
            <Input label="Investee Icon URL" disabled value={formData.investeeIconUrl} />
            
          </FormGroup>

          <FormGroup title="JANGKA WAKTU">
            <Input type="date" label="Contract Start Date" hasError={isError('contractStartDate')} value={formData.contractStartDate} onChange={(e: any) => setFormData({...formData, contractStartDate: e.target.value})} />
            <Input type="date" label="Contract End Date" hasError={isError('contractEndDate')} value={formData.contractEndDate} onChange={(e: any) => setFormData({...formData, contractEndDate: e.target.value})} />
            <Input label="Contract Duration (Months)" disabled value={formData.contractDurationInMonths} />
            <Select label="Contract Status" hasError={isError('contractStatus')} value={formData.contractStatus} onChange={(e: any) => setFormData({...formData, contractStatus: e.target.value})}>
              <option value="">-- Pilih Contract Status --</option>
              <option value="PERFORMING">PERFORMING</option>
              <option value="OBSERVATION">OBSERVATION</option>
              <option value="SUBSTANDARD">SUBSTANDARD</option>
              <option value="DOUBTFUL">DOUBTFUL</option>
              <option value="DEFAULTED">DEFAULTED</option>
            </Select>
          </FormGroup>

          <FormGroup title="PENDANAAN, KUPON/DIVIDEDN, & FEE">
            <NumberField label="Underlying Fund" hasError={isError('contractUnderlyingFund')} value={formData.contractUnderlyingFund} onValueChange={(v: number) => handleGroup3Change('contractUnderlyingFund', v)} colSpan="2"/>
            
            <NumberField label="Yield Rate Annually (%)" disabled={!isGroup3Active} value={formData.contractYieldRateAnnually} onValueChange={(v: number) => handleGroup3Change('contractYieldRateAnnually', v)} isPercentage={true}/>
            <NumberField label="Yield Amount" disabled value={formData.contractYieldAmount} onValueChange={() => {}} />

            <NumberField label="Fee Admin (%)" disabled={!isGroup3Active} value={formData.contractFeeAdministrationPercentage} onValueChange={(v: number) => handleGroup3Change('contractFeeAdministrationPercentage', v)} isPercentage={true}/>
            <NumberField label="Fee Administration" disabled={!isGroup3Active} value={formData.contractFeeAdministration} onValueChange={(v: number) => handleGroup3Change('contractFeeAdministration', v)} />
           
            <NumberField label="Fee Provision (%)" disabled={!isGroup3Active} value={formData.contractFeeProvisionPercentage} onValueChange={(v: number) => handleGroup3Change('contractFeeProvisionPercentage', v)} isPercentage={true}/>
            <NumberField label="Fee Provision" disabled={!isGroup3Active} value={formData.contractFeeProvision} onValueChange={(v: number) => handleGroup3Change('contractFeeProvision', v)} />
           
            <NumberField label="Fee Platform (%)" disabled={!isGroup3Active} value={formData.contractFeePlatformPercentage} onValueChange={(v: number) => handleGroup3Change('contractFeePlatformPercentage', v)} isPercentage={true}/>
            <NumberField label="Fee Platform" disabled={!isGroup3Active} value={formData.contractFeePlatform} onValueChange={(v: number) => handleGroup3Change('contractFeePlatform', v)} />
                      
            <NumberField label="Fee Servicing (%)" disabled={!isGroup3Active} value={formData.contractFeeServicingPercentage} onValueChange={(v: number) => handleGroup3Change('contractFeeServicingPercentage', v)} isPercentage={true}/>
            <NumberField label="Fee Servicing" disabled={!isGroup3Active} value={formData.contractFeeServicing} onValueChange={(v: number) => handleGroup3Change('contractFeeServicing', v)} />
            
            <NumberField label="Fee Monitoring Monthly (%)" disabled={!isGroup3Active} value={formData.contractFeeMonitoringPercentageMonthly} onValueChange={(v: number) => handleGroup3Change('contractFeeMonitoringPercentageMonthly', v)} isPercentage={true}/>
            <NumberField label="Fee Monitoring (Monthly)" disabled={!isGroup3Active} value={formData.contractFeeMonitoringMonthly} onValueChange={(v: number) => handleGroup3Change('contractFeeMonitoringMonthly', v)} />
                      
            <NumberField label="Total Fee Monitoring (%)" disabled value={formData.contractFeeMonitoringPercentage} onValueChange={() => {}} isPercentage={true}/>
            <NumberField label="Total Fee Monitoring" disabled value={formData.contractFeeMonitoring} onValueChange={() => {}} />
           </FormGroup>

          <FormGroup title="PAJAK DAN DENDA">
            <Select label="Tax PPN (%)" isPercentage={true} hasError={isError('contractTaxPpn')} value={formData.contractTaxPpn} onChange={(e: any) => setFormData({...formData, contractTaxPpn: e.target.value})}>
              <option value="">-- Pilih Tax PPN --</option>
              <option value="0.1">10</option>
              <option value="0.11">11</option>
              <option value="0.12">12</option>
            </Select>
            <Select label="Tax Factor" hasError={isError('contractTaxFactor')} value={formData.contractTaxFactor} onChange={(e: any) => setFormData({...formData, contractTaxFactor: e.target.value})}>
              <option value="">-- Pilih Tax Factor --</option>
              <option value="1">1</option>
              <option value="0.916667">11/12</option>
            </Select>
            <Select label="Tax Yield (%)" isPercentage={true} hasError={isError('contractTaxYield')} value={formData.contractTaxYield} onChange={(e: any) => setFormData({...formData, contractTaxYield: e.target.value})}>
              <option value="">-- Pilih Tax Yield --</option>
              <option value="0.1">10</option>
              <option value="0.15">15</option>
              <option value="0.2">20</option>
            </Select>
            <Select label="Penalty Percentage Daily" hasError={isError('contractPenaltyPercentageDaily')} value={formData.contractPenaltyPercentageDaily} onChange={(e: any) => setFormData({...formData, contractPenaltyPercentageDaily: e.target.value})}>
              <option value="">-- Pilih Penalty --</option>
              <option value="0.001">1/1000</option>
              <option value="0.002">2/1000</option>
              <option value="0.003">3/1000</option>
            </Select>
          </FormGroup>

          <FormGroup title="PEMBAYARAN DAN KONTAK">
            <Select label="Escrow Bank" hasError={isError('contractEscrowBank')} value={formData.contractEscrowBank} onChange={(e: any) => setFormData({...formData, contractEscrowBank: e.target.value})}>
              <option value="">-- Pilih Escrow Bank --</option>
              <option value="BJB Syariah">BJB Syariah</option>
              <option value="Bank Mega Syariah">Bank Mega Syariah</option>
            </Select>
            <Input label="Escrow Account" hasError={isError('contractEscrowAccount')} value={formData.contractEscrowAccount} onChange={(e: any) => setFormData({...formData, contractEscrowAccount: e.target.value})} />
            <Select label="VA Bank" hasError={isError('contractVaBank')} value={formData.contractVaBank} onChange={(e: any) => setFormData({...formData, contractVaBank: e.target.value})}>
              <option value="">-- Pilih VA Bank --</option>
              <option value="BCA">BCA</option>
              <option value="BNI">BNI</option>
              <option value="BRI">BRI</option>
              <option value="Mandiri">Mandiri</option>
            </Select>
            <Input label="VA Number" hasError={isError('contractVaNumber')} value={formData.contractVaNumber} onChange={(e: any) => setFormData({...formData, contractVaNumber: e.target.value})} />
            <Input type="email" label="Contact Email" hasError={isError('contractContactEmail')} value={formData.contractContactEmail} onChange={(e: any) => setFormData({...formData, contractContactEmail: e.target.value})} />
            <Input type="tel" label="Contact WhatsApp" hasError={isError('contractContactWhatsapp')} value={formData.contractContactWhatsapp} onChange={(e: any) => setFormData({...formData, contractContactWhatsapp: e.target.value})} />
          </FormGroup>

          <FormGroup title="DOKUMEN PERJANJIAN">
            <Input label="Document Number" value={formData.contractDocumentNumber} onChange={(e: any) => setFormData({...formData, contractDocumentNumber: e.target.value})} colSpan="2"/>
            <Input label="Document Title" value={formData.contractDocumentTitle} onChange={(e: any) => setFormData({...formData, contractDocumentTitle: e.target.value})} colSpan="2"/>
            <div className="col-span-2 border-slate-200 px-6 py-4 border-b-2 rounded-lg">
              <label className="block text-[10px] font-semibold text-slate-600 mb-1">Document URL (File Lokal)</label>
              <input type="file" className="w-full text-xs" onChange={(e) => setFormData({...formData, contractDocumentUrl: e.target.files ? e.target.files[0] : null})} />
            </div>
            
          </FormGroup>

          {!isEditMode && (
            <FormGroup title="BUAT JADWAL TAGIHAN?">
              {/* ---- BARIS 1: UPFRONT FEE ---- */}
              <Toggle 
                label="Upfront Fee" 
                checked={formData.scheduleUpfrontFlag} 
                onChange={(val: boolean) => setFormData({...formData, scheduleUpfrontFlag: val})}
              />
              
              {/* Gunakan class 'invisible' saat toggle OFF agar grid kolom tidak rusak & UI tidak melompat */}
              <div className={formData.scheduleUpfrontFlag ? 'visible' : 'invisible'}>
                <Input 
                  type="date" 
                  hasError={isError('scheduleUpfrontDate')} 
                  value={formData.scheduleUpfrontDate} 
                  onChange={(e: any) => setFormData({...formData, scheduleUpfrontDate: e.target.value})} 
                />
              </div>

              {/* ---- BARIS 2: CICILAN ---- */}
              <Toggle 
                label="Cicilan" 
                checked={formData.scheduleInstallmentFlag} 
                onChange={(val: boolean) => setFormData({...formData, scheduleInstallmentFlag: val})}
              />

              <div className={formData.scheduleInstallmentFlag ? 'visible' : 'invisible'}>
                {/* Solusi Tanggal & Bulan: 
                  Karena type="date" wajib pakai tahun, kita ubah ke type="text" dengan placeholder 
                  jika memang benar-benar tidak ingin melihat angka tahun di UI.
                */}
                <Input 
                  type="date" 
                  hasError={isError('scheduleInstallmentDate')} 
                  value={formData.scheduleInstallmentDate} 
                  onChange={(e: any) => setFormData({...formData, scheduleInstallmentDate: e.target.value})} 
                />
              </div>
            </FormGroup>
          )}
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