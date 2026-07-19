// src/components/repayment/RepaymentSecurityForm.tsx
import React, { useState, useEffect } from 'react';
import { useSidePanel } from '../../../../contexts/SidePanelContext';
import { RepaymentSecurityEditFormResponse, RepaymentSecurityFormRequest, SecurityLookupResponse } from '../../dtos/repayment-security.dto';
import { toFrontendPercentage, toFrontendPercentageStr } from '../../../../utils/finance';
import { formatDateForInput } from '../../../../utils/date';
import { ContractStatus } from '../../types/repayment-security.enum';
import { Big } from 'big.js'; 
import { NumericInput, FormGroup, ConfirmModal, Select, Input, NumberField, Toggle } from '../../../../components/forms/index';
import { toSafeBig } from '../../../../utils/number';


export interface RepaymentSecurityFormProps {
  mode: 'add' | 'edit' ;
  initialData: RepaymentSecurityFormRequest; // Opsional (jika form bisa dipakai untuk Create juga)
  onSubmit: (data: RepaymentSecurityEditFormResponse) => void | Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

// --- KOMPONEN UTAMA ---
export default function RepaymentSecurityForm ({ mode, initialData, onSubmit, onCancel, isLoading }: RepaymentSecurityFormProps) {
  // export default function RepaymentSecurityForm({ initialData, onSubmit, isLoading, onCancel }: RepaymentSecurityFormProps) {
  const { closePanel } = useSidePanel();
  const [formData, setFormData] = useState<RepaymentSecurityFormRequest>(initialData);
 

  const [securities, setSecurities] = useState<SecurityLookupResponse[]>([]);
  const [selectedLookupId, setSelectedLookupId] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const maxPrecision = 2;
  const maxPrecisionPct = 4;

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
      console.log('[onchangedate] formData.contractStartDate : ',formData.contractStartDate);
      console.log('[onchangedate] formData.contractEndDate : ',formData.contractEndDate);
      console.log('[onchangedate] duration : ',duration);
      if (duration !== formData.contractDurationInMonths) {
        setFormData(prev => {
          const fund = new Big(prev.contractUnderlyingFund || 0);
          const rate = new Big(prev.contractYieldRateAnnually || 0);
          const durationInMonths = Number(duration) || 0;
          const feeMonitoringMonthly = new Big(prev.contractFeeMonitoringMonthly || 0);
          const feeMonitoringMonthlyPercentage = new Big(prev.contractFeeMonitoringPercentageMonthly || 0);
          
          // fund * (rate / 100) * (duration / 12)
          const yieldAmt : Big = fund.times(rate.div(100)).div(12).times(durationInMonths);
          
          return {
            ...prev,
            contractDurationInMonths: durationInMonths,
            contractYieldAmount: yieldAmt.round(maxPrecision).toString(),
            contractFeeMonitoring: feeMonitoringMonthly.times(duration).round(maxPrecision).toString(),
            contractFeeMonitoringPercentage: feeMonitoringMonthlyPercentage.times(duration).round(maxPrecisionPct).toString(),
          };
        });
      }
    }
  }, [formData.contractStartDate, formData.contractEndDate]);

  // GROUP 3 KALKULATOR
  const handleGroup3Change = (field: keyof RepaymentSecurityFormRequest, val: number) => {
    let newData = { ...formData, [field]: val };
    const fundRaw = field === 'contractUnderlyingFund' ? val : formData.contractUnderlyingFund;
    const fund = toSafeBig(fundRaw);
    const duration = toSafeBig(formData.contractDurationInMonths);

    if (['contractUnderlyingFund', 'contractYieldRateAnnually'].includes(field)) {
       const rateRaw = field === 'contractYieldRateAnnually' ? val : formData.contractYieldRateAnnually;
       const rate = toSafeBig(rateRaw);
       newData.contractYieldAmount = fund.times(rate.div(100)).times(duration.div(12)).round(maxPrecision).toString();
    }

    const calculateFee = (nameBase: string) => {
      const feeField = `contractFee${nameBase}` as keyof RepaymentSecurityFormRequest;
      const pctField = `contractFee${nameBase}Percentage` as keyof RepaymentSecurityFormRequest;

      // console.log('feeField : ',feeField);
      // console.log('pctField : ',pctField);

      // Pastikan variabel 'fund' sudah berupa objek Big sebelum masuk ke blok ini
      // Contoh: const fund = new Big(fundRawString);

      if (field === feeField) {
        // Logika Lama: fund > 0 ? (val / fund) * 100 : 0
        // Logika Big.js: Mengonversi val ke string, dibagi fund, dikali 100
        newData[pctField] = fund.gt(0)
          ? toSafeBig(val.toFixed(maxPrecision)).div(fund).times(100).round(maxPrecisionPct).toString() // Menghasilkan string persentase (4 desimal)
          : "0";
          
      } else if (field === pctField) {
        // Logika Lama: (val / 100) * fund
        // Logika Big.js: Mengonversi val ke string, dibagi 100, dikali fund
        newData[feeField] = toSafeBig(val.toFixed(maxPrecisionPct)).div(100).times(fund).round(maxPrecision).toString(); // Menghasilkan string nominal uang (2 desimal)
      }

      
      // if (field === feeField) {
      //   newData[pctField] = fund > 0 ? (val / fund) * 100 : 0 as any;
      // } else if (field === pctField) {
      //   newData[feeField] = (val / 100) * fund as any;
      // }
    };

    calculateFee('Administration');
    calculateFee('Provision');
    calculateFee('Platform');
    calculateFee('Servicing');

// Asumsi persiapan variabel pendukung di luar scope IF:
// const fund = new Big(field === 'contractUnderlyingFund' ? val.toString() : formData.contractUnderlyingFund);
const durationBig = new Big(duration.toString());

  if (field === 'contractFeeMonitoringMonthly') {
    const valBig = new Big(val.toString());
    
    const pctMonthly = fund.gt(0) ? valBig.div(fund).times(100) : new Big('0');
    newData.contractFeeMonitoringPercentageMonthly = pctMonthly.round(maxPrecisionPct).toString();
    const feeMonitoring = valBig.times(durationBig);
    newData.contractFeeMonitoring = feeMonitoring.round(maxPrecision).toString();
    newData.contractFeeMonitoringPercentage = pctMonthly.times(durationBig).round(maxPrecisionPct).toString();
  } else if (field === 'contractFeeMonitoringPercentageMonthly') {
    const valBig = toSafeBig(val.toString());
    const feeMonthly = valBig.div(100).times(fund);
    newData.contractFeeMonitoringMonthly = feeMonthly.round(maxPrecision).toString();
    newData.contractFeeMonitoring = feeMonthly.times(durationBig).round(maxPrecision).toString();
    newData.contractFeeMonitoringPercentage = valBig.times(durationBig).round(maxPrecisionPct).toString()
  }

  if (field === 'contractUnderlyingFund') {
    // Ambil persentase dari formData (string), ubah ke desimal (/100), lalu kalikan dengan fund
    newData.contractFeeAdministration = toSafeBig(formData.contractFeeAdministrationPercentage).div(100).times(fund).round(maxPrecision).toString()
    newData.contractFeeProvision = toSafeBig(formData.contractFeeProvisionPercentage).div(100).times(fund).round(maxPrecision).toString();
    newData.contractFeePlatform = toSafeBig(formData.contractFeePlatformPercentage).div(100).times(fund).round(maxPrecision).toString();
    newData.contractFeeServicing = toSafeBig(formData.contractFeeServicingPercentage).div(100).times(fund).round(maxPrecision).toString();
    const feeMonitoringMonthly = toSafeBig(formData.contractFeeMonitoringPercentageMonthly).div(100).times(fund);
    newData.contractFeeMonitoringMonthly = feeMonitoringMonthly.round(maxPrecision).toString();
    newData.contractFeeMonitoring = feeMonitoringMonthly.times(durationBig).round(maxPrecision).toString();
  }


    // if (field === 'contractFeeMonitoringMonthly') {
    //   newData.contractFeeMonitoringPercentageMonthly = fund > 0 ? (val / fund) * 100 : 0;
    //   newData.contractFeeMonitoring = val * duration;
    //   newData.contractFeeMonitoringPercentage = newData.contractFeeMonitoringPercentageMonthly * duration;
    // } else if (field === 'contractFeeMonitoringPercentageMonthly') {
    //   newData.contractFeeMonitoringMonthly = (val / 100) * fund;
    //   newData.contractFeeMonitoring = newData.contractFeeMonitoringMonthly * duration;
    //   newData.contractFeeMonitoringPercentage = val * duration;
    // }

    // if (field === 'contractUnderlyingFund') {
    //   newData.contractFeeAdministration = (formData.contractFeeAdministrationPercentage / 100) * fund;
    //   newData.contractFeeProvision = (formData.contractFeeProvisionPercentage / 100) * fund;
    //   newData.contractFeePlatform = (formData.contractFeePlatformPercentage / 100) * fund;
    //   newData.contractFeeServicing = (formData.contractFeeServicingPercentage / 100) * fund;
    //   newData.contractFeeMonitoringMonthly = (formData.contractFeeMonitoringPercentageMonthly / 100) * fund;
    //   newData.contractFeeMonitoring = newData.contractFeeMonitoringMonthly * duration;
    // }

    setFormData(newData);
  };

  // VALIDASI FORM
  const isError = (field: keyof RepaymentSecurityFormRequest) => {
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
      const val = formData[field as keyof RepaymentSecurityFormRequest];
      if (val === '' || val === null || val === undefined) isValid = false;
      if (field === 'contractUnderlyingFund' && val === 0) isValid = false;
    }

    if (isValid) setShowConfirmModal(true);
  };

  // const isGroup3Active = formData.contractUnderlyingFund > 0 && formData.contractDurationInMonths > 0;

// Pastikan datanya valid sebelum dibungkus (mencegah error jika string kosong atau null)
  const fundStr = formData.contractUnderlyingFund || '0';
  const durationStr = formData.contractDurationInMonths || '0';

  const isGroup3Active = new Big(fundStr).gt(0) && new Big(durationStr).gt(0);


  return (
    // Struktur flex-col dengan height penuh agar header dan footer menempel (fixed position / sticky)
    <div className="flex flex-col h-full bg-slate-white relative">
      
      {/* HEADER: Fixed di Atas */}
      <div className="shrink-0 border-b border-slate-200 px-5 py-4 bg-white flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            {mode==='edit' ? 'Ubah Repayment Security' : 'Tambah Repayment Security'}
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
          <input type="hidden" value={formData.restructOrder || 0} />
          <input type="hidden" value={formData.restructParentSecurityId || ''} />
          <input type="hidden" value={formData.restructOriginalSecurityId || ''} />

          <FormGroup title="PENERBIT DAN EFEK">
            <Select 
              label="Nama Efek" 
              hasError={isError('securityName')}
              value={selectedLookupId} 
              colSpan="2"
              disabled={mode==='edit'}
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
                    securityType: item?.securityType || '',
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
            <Input type="date" label="Contract Start Date" disabled={mode==='edit'} hasError={isError('contractStartDate')} value={formData.contractStartDate} onChange={(e: any) => setFormData({...formData, contractStartDate: e.target.value})} />
            <Input type="date" label="Contract End Date" disabled={mode==='edit'} hasError={isError('contractEndDate')} value={formData.contractEndDate} onChange={(e: any) => setFormData({...formData, contractEndDate: e.target.value})} />
            <Input label="Contract Duration (Months)" disabled value={formData.contractDurationInMonths === 0 ? "" : formData.contractDurationInMonths} />
            <Select label="Contract Status" hasError={isError('contractStatus')} value={formData.contractStatus} onChange={(e: any) => setFormData({...formData, contractStatus: e.target.value})}>
              <option value="">-- Pilih Contract Status --</option>
              <option value={ContractStatus.PERFORMING}>Performing</option>
              <option value={ContractStatus.OBSERVATION}>Observation</option>
              <option value={ContractStatus.SUBSTANDARD}>Substandard</option>
              <option value={ContractStatus.DOUBTFUL}>Doubtful</option>
              <option value={ContractStatus.DEFAULTED}>Defaulted</option>
            </Select>
          </FormGroup>

          <FormGroup title="PENDANAAN, KUPON/DIVIDEDN, & FEE">
            <NumberField label="Underlying Fund" disabled={mode==='edit'} hasError={isError('contractUnderlyingFund')} value={formData.contractUnderlyingFund} onValueChange={(v: number) => handleGroup3Change('contractUnderlyingFund', v)} colSpan="2"/>
            
            <NumberField label="Yield Rate Annually (%)" disabled={!isGroup3Active || mode==='edit'} value={formData.contractYieldRateAnnually} onValueChange={(v: number) => handleGroup3Change('contractYieldRateAnnually', v)} isPercentage={true}/>
            <NumberField label="Yield Amount" disabled value={formData.contractYieldAmount} onValueChange={() => {}} />

            <NumberField label="Fee Admin (%)" disabled={!isGroup3Active || mode==='edit'} value={formData.contractFeeAdministrationPercentage} onValueChange={(v: number) => handleGroup3Change('contractFeeAdministrationPercentage', v)} isPercentage={true}/>
            <NumberField label="Fee Administration" disabled={!isGroup3Active || mode==='edit'} value={formData.contractFeeAdministration} onValueChange={(v: number) => handleGroup3Change('contractFeeAdministration', v)} />
           
            <NumberField label="Fee Provision (%)" disabled={!isGroup3Active || mode==='edit'} value={formData.contractFeeProvisionPercentage} onValueChange={(v: number) => handleGroup3Change('contractFeeProvisionPercentage', v)} isPercentage={true}/>
            <NumberField label="Fee Provision" disabled={!isGroup3Active || mode==='edit'} value={formData.contractFeeProvision} onValueChange={(v: number) => handleGroup3Change('contractFeeProvision', v)} />
           
            <NumberField label="Fee Platform (%)" disabled={!isGroup3Active || mode==='edit'} value={formData.contractFeePlatformPercentage} onValueChange={(v: number) => handleGroup3Change('contractFeePlatformPercentage', v)} isPercentage={true}/>
            <NumberField label="Fee Platform" disabled={!isGroup3Active} value={formData.contractFeePlatform} onValueChange={(v: number) => handleGroup3Change('contractFeePlatform', v)} />
                      
            <NumberField label="Fee Servicing (%)" disabled={!isGroup3Active || mode==='edit'} value={formData.contractFeeServicingPercentage} onValueChange={(v: number) => handleGroup3Change('contractFeeServicingPercentage', v)} isPercentage={true}/>
            <NumberField label="Fee Servicing" disabled={!isGroup3Active || mode==='edit'} value={formData.contractFeeServicing} onValueChange={(v: number) => handleGroup3Change('contractFeeServicing', v)} />
            
            <NumberField label="Fee Monitoring Monthly (%)" disabled={!isGroup3Active || mode==='edit'} value={formData.contractFeeMonitoringPercentageMonthly} onValueChange={(v: number) => handleGroup3Change('contractFeeMonitoringPercentageMonthly', v)} isPercentage={true}/>
            <NumberField label="Fee Monitoring (Monthly)" disabled={!isGroup3Active || mode==='edit'} value={formData.contractFeeMonitoringMonthly} onValueChange={(v: number) => handleGroup3Change('contractFeeMonitoringMonthly', v)} />
                      
            <NumberField label="Total Fee Monitoring (%)" disabled value={formData.contractFeeMonitoringPercentage} onValueChange={() => {}} isPercentage={true}/>
            <NumberField label="Total Fee Monitoring" disabled value={formData.contractFeeMonitoring} onValueChange={() => {}} />
           </FormGroup>

          <FormGroup title="PAJAK DAN DENDA">
            <Select label="Tax PPN (%)" disabled={mode==='edit'} isPercentage={true} hasError={isError('contractTaxPpn')} value={formData.contractTaxPpn} onChange={(e: any) => setFormData({...formData, contractTaxPpn: e.target.value})}>
              <option value="">-- Pilih Tax PPN --</option>
              <option value="0.1">10</option>
              <option value="0.11">11</option>
              <option value="0.12">12</option>
            </Select>
            <Select label="Tax Factor" disabled={mode==='edit'} hasError={isError('contractTaxFactor')} value={formData.contractTaxFactor} onChange={(e: any) => setFormData({...formData, contractTaxFactor: e.target.value})}>
              <option value="">-- Pilih Tax Factor --</option>
              <option value="1">1</option>
              <option value="0.916667">11/12</option>
            </Select>
            <Select label="Tax Yield (%)" disabled={mode==='edit'} isPercentage={true} hasError={isError('contractTaxYield')} value={formData.contractTaxYield} onChange={(e: any) => setFormData({...formData, contractTaxYield: e.target.value})}>
              <option value="">-- Pilih Tax Yield --</option>
              <option value="0.1">10</option>
              <option value="0.15">15</option>
              <option value="0.2">20</option>
            </Select>
            <Select label="Penalty Percentage Daily" disabled={mode==='edit'} hasError={isError('contractPenaltyPercentageDaily')} value={formData.contractPenaltyPercentageDaily} onChange={(e: any) => setFormData({...formData, contractPenaltyPercentageDaily: e.target.value})}>
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

          {mode !== 'edit' && (
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
          {isLoading ? 'Menyimpan...' : (mode==='edit' ? 'Simpan Perubahan' : 'Tambahkan Data')}
        </button>
      </div>

    </div>
  );
};