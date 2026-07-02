// src/components/repayment/RepaymentSecurityForm.tsx
import React, { useState, useEffect } from 'react';
import { useSidePanel } from '../../context/SidePanelContext'; 

interface RepaymentSecurityFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

const defaultFormState = {
  // GROUP 1: Informasi Penerbit dan Efek
  id: '',
  investee_id: '',
  investee_name: '',
  investee_name_legal: '',
  investee_icon_url: '',
  security_id: '',
  security_type: '',
  security_name: '',
  security_code: '',
  security_series: '',
  security_phase: '',
  security_sequence: '',
  
  // GROUP 2: Jangka Waktu
  contract_start_date: '',
  contract_end_date: '',
  contract_duration_in_months: '',
  contract_status: 'PERFORMING',

  // GROUP 3: FUNDING, YIELD & FEE
  contract_underlying_fund: '',
  contract_yield_amount: '',
  contract_yield_rate_annually: '',
  contract_fee_administration: '',
  contract_fee_administration_percentage: '',
  contract_fee_provision: '',
  contract_fee_provision_percentage: '',
  contract_fee_platform: '',
  contract_fee_platform_percentage: '',
  contract_fee_servicing: '',
  contract_fee_servicing_percentage: '',
  contract_fee_monitoring_monthly: '',
  contract_fee_monitoring_percentage_monthly: '',
  contract_fee_monitoring: '',
  contract_fee_monitoring_percentage: '',

  // GROUP 4: TAX and Penalty
  contract_tax_ppn: '',
  contract_tax_factor: '',
  contract_tax_yield: '',
  contract_penalty_percentage_daily: '0.001',

  // GROUP 5: PAYMENT AND CONTACT
  contract_escrow_bank: '',
  contract_escrow_account: '',
  contract_va_bank: '',
  contract_va_number: '',
  contract_contact_email: '',
  contract_contact_whatsapp: '',

  // GROUP 6: DOCUMENT
  contract_document_title: '',
  contract_document_number: '',
  contract_document_url: '',

  // FLAGS & RESTRUCT
  generate_schedule_flag: true,
  restruct_order: '',
  restruct_parent_security_id: '',
  restruct_original_security_id: '',
};

// JSON Lookup Dummy Sesuai Request
const lookupDummyData = [
  {"id":"c913ad7e-9913-496c-a2f0-30df54d3701f","investee_id":"880f23e3-05e0-493d-9da9-8391d4ac13de","investee_name":"Nusa Farm","investee_name_legal":"PT Pintu Masuk Pangan","investee_icon_url":"google/test/doremi.png","security_id":"c07775ca-aa32-4156-85a3-9dd08e038d49","security_type":"Sukuk","security_name":"Sukuk Ijarah Nusa Farm Tahap I","security_code":"NSFR01X1SCFS","security_series":1,"security_phase":1,"security_sequence":1},
  {"id":"cd38898b-f97d-48ce-971d-40f2e6a38d63","investee_id":"d51c74d3-9a98-4735-9bd6-0d50be173062","investee_name":"Studio Renang","investee_name_legal":"PT Klyra Adhyaksa Sera","investee_icon_url":"google/test/doremi.png","security_id":"221cebb4-4b43-42eb-9f56-06f85483c2a7","security_type":"Saham","security_name":"Studio Renang","security_code":"STDRECF","security_series":1,"security_phase":0,"security_sequence":2},
  {"id":"afd64e5f-50dc-4f94-9345-60acfb54a49e","investee_id":"051ebbcc-ab92-47c3-a3ff-c3e33a76202a","investee_name":"Femurty","investee_name_legal":"PT Femurty Abadi Sentosa","investee_icon_url":"google/test/doremi.png","security_id":"b4ad96c6-c0c4-40df-b749-353c7e3d33b7","security_type":"Sukuk","security_name":"Sukuk Ijarah Femurty Abadi Sentosa Tahap I","security_code":"FMAS01X1SCFS","security_series":1,"security_phase":1,"security_sequence":3},
  {"id":"31e9da09-70fa-4e8c-84e5-1f42da787c6a","investee_id":"5ff6a3b9-a9da-4d78-80de-f632c54bbd9c","investee_name":"ODAC","investee_name_legal":"PT Oranye Kafah Tahta Abadi","investee_icon_url":"google/test/doremi.png","security_id":"0ec70670-4bc6-4b39-b205-b0c085d13759","security_type":"Sukuk","security_name":"Sukuk Ijarah ODAC","security_code":"ODAC01XXSCFS","security_series":1,"security_phase":0,"security_sequence":4},
  {"id":"24d22078-4fbe-49bc-be9c-ce2a45d9c28b","investee_id":"cd674b77-57d4-44c8-95e6-65d7a73c8eed","investee_name":"Dorks","investee_name_legal":"CV Triguna Mitra Abadi","investee_icon_url":"google/test/doremi.png","security_id":"68b7a1d2-63d8-4305-b760-9d15dbb14b54","security_type":"Sukuk","security_name":"Sukuk Ijarah Dorks","security_code":"DORK01XXSCFS","security_series":1,"security_phase":0,"security_sequence":5},
  {"id":"346dff5e-8cf4-4ca9-8743-9713e1a8b74f","investee_id":"9d4178e6-334a-4d92-a005-0397b02f230c","investee_name":"Femurty","investee_name_legal":"PT Femurty Abadi Sentosa","investee_icon_url":"google/test/doremi.png","security_id":"c9192836-6f75-4385-bdb3-87b7e9bc3523","security_type":"Sukuk","security_name":"Sukuk Ijarah Femurty Abadi Sentosa Tahap II","security_code":"FMAS01X2SCFS","security_series":2,"security_phase":2,"security_sequence":6},
  {"id":"55898df4-1cb8-4531-9757-75de0033d1dc","investee_id":"90256c49-d5b0-48a2-a183-2868f563b27e","investee_name":"Studio Renang","investee_name_legal":"PT Meimo Toronta Sera","investee_icon_url":"google/test/doremi.png","security_id":"2c5ee33e-8629-40b3-a3b5-e65d9e493bd1","security_type":"Sukuk","security_name":"Sukuk Ijarah Studio Renang Tahap I","security_code":"METS01X1SCFS","security_series":1,"security_phase":1,"security_sequence":7},
  {"id":"e0fba99e-3984-45b6-b5ff-ed916806d4b9","investee_id":"8eace092-6eea-40ab-8c99-2fe47eda60cf","investee_name":"Studio Renang","investee_name_legal":"PT Meimo Toronta Sera","investee_icon_url":"google/test/doremi.png","security_id":"9d1b1b28-7879-4ccc-ba55-95ed650e3094","security_type":"Sukuk","security_name":"Sukuk Ijarah Studio Renang Tahap I","security_code":"METS01X1SCFS","security_series":2,"security_phase":2,"security_sequence":8},
  {"id":"cdaf50d2-12a7-4b95-bf2c-b71d466b7953","investee_id":"56675177-f62d-446a-9796-84c7271d2ead","investee_name":"Hi Nashville","investee_name_legal":"PT Bohi Integra Tanaya","investee_icon_url":"google/test/doremi.png","security_id":"eccdbc9b-c3ed-4255-9878-a52fcb3c088d","security_type":"Saham","security_name":"Hi Nashville","security_code":"BOHIECF","security_series":1,"security_phase":0,"security_sequence":9},
  {"id":"ee64a35a-5baf-440b-b9aa-f20ff300eaf1","investee_id":"c4117eb5-ef36-452b-8771-d4ad0a415751","investee_name":"IGN Global Network","investee_name_legal":"PT IGN Global Network","investee_icon_url":"google/test/doremi.png","security_id":"baa6d4b7-545d-45d4-9650-26362d785210","security_type":"Sukuk","security_name":"Sukuk Musyarakah IGN Global Network Tahap II","security_code":"IGN04X1SCFS","security_series":5,"security_phase":1,"security_sequence":10},
  {"id":"14d4c645-b43c-4abf-b543-c919f5764f7a","investee_id":"8718cb11-8266-4f0f-905c-51764844e9c0","investee_name":"Temu Sushi","investee_name_legal":"CV Lima Sinergi Group","investee_icon_url":"google/test/doremi.png","security_id":"b9c0f4f2-66c2-43c6-8989-65a3b8644c62","security_type":"Sukuk","security_name":"Sukuk Ijarah Temu Sushi Tahap I","security_code":"TEMU02X1SCFS","security_series":2,"security_phase":1,"security_sequence":11},
  {"id":"21f000cb-f198-4e65-90c6-9a26d1140de2","investee_id":"ab6d158e-2dcc-4241-9549-9a39d960d667","investee_name":"IGN Global Network","investee_name_legal":"PT IGN Global Network","investee_icon_url":"google/test/doremi.png","security_id":"39be8f04-3c06-4eb4-9bd2-64c83d65943f","security_type":"Sukuk","security_name":"Sukuk Musyarakah IGN Global Network Tahap III","security_code":"IGN04X2SCFS","security_series":6,"security_phase":2,"security_sequence":12},
  {"id":"a8961fa8-5d4a-4b4e-bbdf-6912db3ad316","investee_id":"7d5d7240-e864-43c0-873b-e9732204046a","investee_name":"Sari Barokah","investee_name_legal":"PT Sari Barokah Group","investee_icon_url":"google/test/doremi.png","security_id":"d378db94-bfa8-4d82-a781-bd7f182d3192","security_type":"Sukuk","security_name":"Sukuk Ijarah Sari Barokah Group Tahap I","security_code":"SRBR01X1SCFS","security_series":2,"security_phase":1,"security_sequence":13},
  {"id":"4111b2e0-0460-4736-b1be-84f91361beab","investee_id":"89af381d-f425-4de1-838f-c3c3d38ddbbd","investee_name":"Sari Barokah","investee_name_legal":"PT Sari Barokah Group","investee_icon_url":"google/test/doremi.png","security_id":"b775af43-fae5-4076-8bae-6c43d3c1e73b","security_type":"Sukuk","security_name":"Sukuk Ijarah Sari Barokah Group Tahap II","security_code":"SRBR01X2SCFS","security_series":3,"security_phase":2,"security_sequence":14}
];


export default function RepaymentSecurityForm({ initialData, onSubmit, isLoading }: RepaymentSecurityFormProps) {
  const { closePanel } = useSidePanel();
  const [formData, setFormData] = useState(defaultFormState);
  const [lookupData, setLookupData] = useState<any[]>([]);

  const isEditMode = !!initialData?.id;
  
  // Status Grup 3: Aktif jika Nilai Pendanaan dan Durasi ada nilainya
  const fundVal = Number(formData.contract_underlying_fund) || 0;
  const durationVal = Number(formData.contract_duration_in_months) || 0;
  const isGroup3Active = fundVal > 0 && durationVal > 0;

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  useEffect(() => {
    // Simulasi Fetching dari API Endpoint Lookup
    // aslinya: fetch('http://localhost:3000/repayment/securities/lookup')
    setLookupData(lookupDummyData);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let finalValue = value;
    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked as any;
    }
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  // Kalkulasi Otomatis Durasi dari Tanggal
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };
    
    if (newFormData.contract_start_date && newFormData.contract_end_date) {
      const d1 = new Date(newFormData.contract_start_date);
      const d2 = new Date(newFormData.contract_end_date);
      const months = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
      newFormData.contract_duration_in_months = months > 0 ? String(months) : '0';
      
      // Jika durasi berubah, trigger ulang kalkulasi grup 3
      newFormData = recalculateGroup3(newFormData);
    }
    setFormData(newFormData);
  };

  // Saat Dropdown Lookup Dipilih
  const handleLookupSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const item = lookupData.find(d => d.security_id === selectedId);
    
    if (item) {
      setFormData(prev => ({
        ...prev,
        security_name: item.security_name,
        investee_id: item.investee_id,
        investee_name: item.investee_name,
        investee_name_legal: item.investee_name_legal,
        investee_icon_url: item.investee_icon_url,
        security_id: item.security_id,
        security_type: item.security_type.toUpperCase(),
        security_code: item.security_code,
        security_series: String(item.security_series),
        security_phase: String(item.security_phase),
        security_sequence: String(item.security_sequence)
      }));
    } else {
      setFormData(prev => ({ ...prev, security_id: '', investee_id: '' }));
    }
  };

  // Helper fungsi untuk menghitung semua dependensi di Group 3
  const recalculateGroup3 = (data: typeof defaultFormState) => {
    const fund = Number(data.contract_underlying_fund) || 0;
    const duration = Number(data.contract_duration_in_months) || 0;

    if (fund > 0) {
      data.contract_fee_administration = String((Number(data.contract_fee_administration_percentage) || 0) / 100 * fund);
      data.contract_fee_provision = String((Number(data.contract_fee_provision_percentage) || 0) / 100 * fund);
      data.contract_fee_platform = String((Number(data.contract_fee_platform_percentage) || 0) / 100 * fund);
      data.contract_fee_servicing = String((Number(data.contract_fee_servicing_percentage) || 0) / 100 * fund);
      data.contract_fee_monitoring_monthly = String((Number(data.contract_fee_monitoring_percentage_monthly) || 0) / 100 * fund);
    }
    
    if (duration > 0 && fund > 0) {
      data.contract_fee_monitoring = String((Number(data.contract_fee_monitoring_monthly) || 0) * duration);
      data.contract_fee_monitoring_percentage = String((Number(data.contract_fee_monitoring_percentage_monthly) || 0) * duration);
      
      const rate = Number(data.contract_yield_rate_annually) || 0;
      data.contract_yield_amount = String((rate / 100) * fund * (duration / 12));
    }
    
    return data;
  };

  // Handler interaktif khusus untuk input di Group 3
  const handleGroup3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let newFormData = { ...formData, [name]: value };
    const fund = Number(newFormData.contract_underlying_fund) || 0;
    const val = Number(value) || 0;
    const duration = Number(newFormData.contract_duration_in_months) || 0;
    
    if (fund > 0) {
      if (name === 'contract_fee_administration') {
        newFormData.contract_fee_administration_percentage = String((val / fund) * 100);
      } else if (name === 'contract_fee_administration_percentage') {
        newFormData.contract_fee_administration = String((val / 100) * fund);
      } 
      else if (name === 'contract_fee_provision') {
        newFormData.contract_fee_provision_percentage = String((val / fund) * 100);
      } else if (name === 'contract_fee_provision_percentage') {
        newFormData.contract_fee_provision = String((val / 100) * fund);
      }
      else if (name === 'contract_fee_platform') {
        newFormData.contract_fee_platform_percentage = String((val / fund) * 100);
      } else if (name === 'contract_fee_platform_percentage') {
        newFormData.contract_fee_platform = String((val / 100) * fund);
      }
      else if (name === 'contract_fee_servicing') {
        newFormData.contract_fee_servicing_percentage = String((val / fund) * 100);
      } else if (name === 'contract_fee_servicing_percentage') {
        newFormData.contract_fee_servicing = String((val / 100) * fund);
      }
      else if (name === 'contract_fee_monitoring_monthly') {
        const pct = (val / fund) * 100;
        newFormData.contract_fee_monitoring_percentage_monthly = String(pct);
        newFormData.contract_fee_monitoring = String(val * duration);
        newFormData.contract_fee_monitoring_percentage = String(pct * duration);
      } else if (name === 'contract_fee_monitoring_percentage_monthly') {
        const monthlyFee = (val / 100) * fund;
        newFormData.contract_fee_monitoring_monthly = String(monthlyFee);
        newFormData.contract_fee_monitoring = String(monthlyFee * duration);
        newFormData.contract_fee_monitoring_percentage = String(val * duration);
      }
      else if (name === 'contract_yield_rate_annually') {
         newFormData.contract_yield_amount = String((val / 100) * fund * (duration / 12));
      }
      else if (name === 'contract_underlying_fund') {
         newFormData = recalculateGroup3(newFormData);
      }
    }
    
    setFormData(newFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      id: isEditMode ? formData.id : null, 
      restruct_order: formData.restruct_order || null,
      restruct_parent_security_id: formData.restruct_parent_security_id || null,
      restruct_original_security_id: formData.restruct_original_security_id || null,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full bg-white">
      {/* Header Form */}
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

      {/* Body Scrollable */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        
        {/* GROUP 1: Informasi Penerbit dan Efek */}
        <section>
          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">
            1. Informasi Penerbit & Efek
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Nama Efek (Lookup API)" name="security_name" value={formData.security_id} onChange={handleLookupSelect} className="col-span-2">
              <option value="">-- Pilih Efek dari Database --</option>
              {lookupData.map(item => (
                <option key={item.id} value={item.security_id}>{item.security_name}</option>
              ))}
            </Select>

            <Input label="Nama Penerbit" name="investee_name" value={formData.investee_name} disabled />
            <Input label="Nama Legal Penerbit" name="investee_name_legal" value={formData.investee_name_legal} disabled />
            <Input label="URL Icon Penerbit" name="investee_icon_url" value={formData.investee_icon_url} disabled />
            <Select label="Tipe Efek" name="security_type" value={formData.security_type} onChange={handleChange}>
              <option value="">-</option>
              <option value="SAHAM">SAHAM</option>
              <option value="SUKUK">SUKUK</option>
            </Select>
            <Input label="Kode Efek" name="security_code" value={formData.security_code} disabled />
            <Input label="Seri" name="security_series" type="number" value={formData.security_series} disabled />
            <Input label="Tahap" name="security_phase" type="number" value={formData.security_phase} disabled />
            <Input label="Sequence" name="security_sequence" type="number" value={formData.security_sequence} disabled />
          </div>
        </section>

        {/* GROUP 2: Jangka Waktu */}
        <section>
           <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">
             2. Jangka Waktu & Status
           </h3>
           <div className="grid grid-cols-2 gap-3">
              <Input label="Tanggal Mulai Kontrak" name="contract_start_date" type="date" value={formData.contract_start_date} onChange={handleDateChange} />
              <Input label="Tanggal Akhir Kontrak" name="contract_end_date" type="date" value={formData.contract_end_date} onChange={handleDateChange} />
              <Input label="Durasi (Bulan)" name="contract_duration_in_months" type="number" value={formData.contract_duration_in_months} disabled />
              <Select label="Status Pembayaran" name="contract_status" value={formData.contract_status} onChange={handleChange}>
                <option value="">-- Pilih Status Pembayaran --</option>
                <option value="PERFORMING">PERFORMING</option>
                <option value="OBSERVATION">OBSERVATION</option>
                <option value="SUBSTANDARD">SUBSTANDARD</option>
                <option value="DOUBTFUL">DOUBTFUL</option>
                <option value="DEFAULTED">DEFAULTED</option>
              </Select>
           </div>
        </section>

        {/* GROUP 3: FUNDING, YIELD & FEE */}
        <section>
           <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-1 flex items-center justify-between">
             <span>3. Funding, Yield & Fee</span>
             {!isGroup3Active && <span className="text-[9px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full normal-case font-medium">Isi Pendanaan & Durasi untuk mengaktifkan</span>}
           </h3>
           
           <div className="grid grid-cols-2 gap-3">
             <Input label="Jumlah Pendanaan (Underlying Fund)" name="contract_underlying_fund" type="number" value={formData.contract_underlying_fund} onChange={handleGroup3Change} className="col-span-2" />
             
             <Input label="Rate Yield (p.a %)" name="contract_yield_rate_annually" type="number" step="0.01" value={formData.contract_yield_rate_annually} onChange={handleGroup3Change} disabled={!isGroup3Active} />
             <Input label="Nilai Yield (Total)" name="contract_yield_amount" type="number" value={formData.contract_yield_amount} disabled />

             {/* Fee Inputs */}
             <div className="col-span-2 grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-md border border-slate-100 mt-2">
                <Input label="Admin Fee (Rp)" name="contract_fee_administration" type="number" value={formData.contract_fee_administration} onChange={handleGroup3Change} disabled={!isGroup3Active} />
                <Input label="Admin Fee (%)" name="contract_fee_administration_percentage" type="number" step="0.01" value={formData.contract_fee_administration_percentage} onChange={handleGroup3Change} disabled={!isGroup3Active} />
                
                <Input label="Provision Fee (Rp)" name="contract_fee_provision" type="number" value={formData.contract_fee_provision} onChange={handleGroup3Change} disabled={!isGroup3Active} />
                <Input label="Provision Fee (%)" name="contract_fee_provision_percentage" type="number" step="0.01" value={formData.contract_fee_provision_percentage} onChange={handleGroup3Change} disabled={!isGroup3Active} />
                
                <Input label="Platform Fee (Rp)" name="contract_fee_platform" type="number" value={formData.contract_fee_platform} onChange={handleGroup3Change} disabled={!isGroup3Active} />
                <Input label="Platform Fee (%)" name="contract_fee_platform_percentage" type="number" step="0.01" value={formData.contract_fee_platform_percentage} onChange={handleGroup3Change} disabled={!isGroup3Active} />
                
                <Input label="Servicing Fee (Rp)" name="contract_fee_servicing" type="number" value={formData.contract_fee_servicing} onChange={handleGroup3Change} disabled={!isGroup3Active} />
                <Input label="Servicing Fee (%)" name="contract_fee_servicing_percentage" type="number" step="0.01" value={formData.contract_fee_servicing_percentage} onChange={handleGroup3Change} disabled={!isGroup3Active} />
             </div>

             {/* Monitoring Fee */}
             <div className="col-span-2 grid grid-cols-2 gap-3 p-3 bg-indigo-50/50 rounded-md border border-indigo-100 mt-2">
                <Input label="Monitoring Fee Bulanan (Rp)" name="contract_fee_monitoring_monthly" type="number" value={formData.contract_fee_monitoring_monthly} onChange={handleGroup3Change} disabled={!isGroup3Active} />
                <Input label="Monitoring Fee Bulanan (%)" name="contract_fee_monitoring_percentage_monthly" type="number" step="0.01" value={formData.contract_fee_monitoring_percentage_monthly} onChange={handleGroup3Change} disabled={!isGroup3Active} />
                
                <Input label="Total Monitoring Fee (Rp)" name="contract_fee_monitoring" type="number" value={formData.contract_fee_monitoring} disabled />
                <Input label="Total Monitoring Fee (%)" name="contract_fee_monitoring_percentage" type="number" step="0.01" value={formData.contract_fee_monitoring_percentage} disabled />
             </div>
           </div>
        </section>

        {/* GROUP 4: TAX and Penalty */}
        <section>
           <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">
             4. Pajak & Penalti
           </h3>
           <div className="grid grid-cols-2 gap-3">
             <Select label="PPN (%)" name="contract_tax_ppn" value={formData.contract_tax_ppn} onChange={handleChange}>
                <option value="">-- Pilih Pajak PPN --</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
             </Select>
             <Select label="Faktor Pajak" name="contract_tax_factor" value={formData.contract_tax_factor} onChange={handleChange}>
                <option value="1">-- Pilih Faktor Pengali Pajak --</option>
                <option value="1">1</option>
                <option value="0.91666667">11/12</option>
             </Select>
             <Select label="Pajak Yield (%)" name="contract_tax_yield" value={formData.contract_tax_yield} onChange={handleChange}>
                <option value="">-- Pilih Pajak Yield --</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
             </Select>
             <Select label="Penalti Keterlambatan Harian" name="contract_penalty_percentage_daily" value={formData.contract_penalty_percentage_daily} onChange={handleChange}>
                <option value="">-- Pilih Denda per Hari --</option>
                <option value="0.001">1/1000 (0.1%)</option>
                <option value="0.002">2/1000 (0.2%)</option>
                <option value="0.003">3/1000 (0.3%)</option>
             </Select>
           </div>
        </section>

        {/* GROUP 5: PAYMENT AND CONTACT */}
        <section>
           <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">
             5. Pembayaran & Kontak
           </h3>
           <div className="grid grid-cols-2 gap-3">
             <Select label="Escrow Bank" name="contract_escrow_bank" value={formData.contract_escrow_bank} onChange={handleChange}>
                <option value="">-- Pilih Bank Escrow --</option>
                <option value="BJB Syariah">BJB Syariah</option>
                <option value="Mega Syariah">Bank Mega Syariah</option>
             </Select>
             <Input label="Escrow Account" name="contract_escrow_account" value={formData.contract_escrow_account} onChange={handleChange} />
             <Select label="Virtual Account (VA) Bank" name="contract_va_bank" value={formData.contract_va_bank} onChange={handleChange}>
                <option value="">-- Pilih Bank VA --</option>
                <option value="BJB Syariah">BCA</option>
                <option value="Mega Syariah">BNI</option>
                <option value="Mega Syariah">Mandiri</option>
                <option value="Mega Syariah">BSI</option>
             </Select>
             <Input label="VA Number" name="contract_va_number" value={formData.contract_va_number} onChange={handleChange} />
             <Input label="Email PIC Kontak" name="contract_contact_email" type="email" value={formData.contract_contact_email} onChange={handleChange} />
             <Input label="WhatsApp PIC Kontak" name="contract_contact_whatsapp" type="tel" value={formData.contract_contact_whatsapp} onChange={handleChange} />
           </div>
        </section>

        {/* GROUP 6: DOCUMENT */}
        <section>
           <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-3 border-b border-slate-100 pb-1">
             6. Dokumen Legalitas
           </h3>
           <div className="grid grid-cols-2 gap-3">
             <Input label="Judul Dokumen" name="contract_document_title" value={formData.contract_document_title} onChange={handleChange} />
             <Input label="Nomor Dokumen" name="contract_document_number" value={formData.contract_document_number} onChange={handleChange} />
             <Input label="URL / File Dokumen" name="contract_document_url" type="text" value={formData.contract_document_url} onChange={handleChange} className="col-span-2" />
           </div>
        </section>

        {/* Pengaturan Tambahan */}
        <div className="flex items-center gap-2 p-3 bg-amber-50/50 border border-amber-200 border-dashed rounded-md">
          <input 
            type="checkbox" 
            id="generate_schedule_flag" 
            name="generate_schedule_flag" 
            checked={formData.generate_schedule_flag} 
            onChange={handleChange}
            className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
          />
          <label htmlFor="generate_schedule_flag" className="text-[11px] font-medium text-slate-700">
            Aktifkan / Generate Jadwal Pembayaran (Generate Schedule Flag)
          </label>
        </div>

      </div>

      {/* Footer (Fixed Bawah) */}
      <div className="shrink-0 border-t border-slate-200 p-4 bg-slate-50 flex justify-end gap-3">
        <button 
          type="button" 
          onClick={closePanel}
          className="px-4 py-2 text-xs font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors"
        >
          Batal
        </button>
        <button 
          type="submit" 
          disabled={isLoading}
          className="px-4 py-2 text-xs font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Menyimpan...' : (isEditMode ? 'Simpan Perubahan' : 'Tambahkan Data')}
        </button>
      </div>
    </form>
  );
}

// Komponen Pembantu Mini (Reusable & Compact)
const Input = ({ label, className = "", disabled = false, ...props }: any) => (
  <div className={className}>
    <label className="block text-[10px] font-semibold text-slate-600 mb-1">{label}</label>
    <input
      disabled={disabled}
      className={`w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
        disabled ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-700'
      }`}
      {...props}
    />
  </div>
);

const Select = ({ label, className = "", disabled = false, children, ...props }: any) => (
  <div className={className}>
    <label className="block text-[10px] font-semibold text-slate-600 mb-1">{label}</label>
    <select
      disabled={disabled}
      className={`w-full px-3 py-2 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-colors ${
        disabled ? 'bg-slate-50 text-slate-500 cursor-not-allowed' : 'bg-white text-slate-700'
      }`}
      {...props}
    >
      {children}
    </select>
  </div>
);