// src/components/repayment/RepaymentSecurityEditWrapper.tsx
import React, { useState, useEffect } from 'react';
import RepaymentSecurityForm from './RepaymentSecurityForm';
import { useSidePanel } from '../../context/SidePanelContext';

interface EditWrapperProps {
  repaymentId: string;
}

export default function RepaymentSecurityEditWrapper({ repaymentId }: EditWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  useEffect(() => {
    // Simulasi Fetching API menggunakan Dummy Data yang lengkap
    const fetchDummyData = async () => {
      // Tunggu setengah detik biar berasa loading fetch API beneran
      await new Promise(resolve => setTimeout(resolve, 500)); 
      
      setInitialData({
        investee_id: 'inv-a1b2-c3d4',
        investee_name: 'PT Solusi Teknologi Digital',
        investee_name_legal: 'PT Solusi Teknologi Digital, Tbk.',
        security_id: 'sec-9876-5432',
        security_type: 'SUKUK',
        security_name: 'Sukuk Ijarah Tahap I',
        contract_document_title: 'Perjanjian Penerbitan Sukuk Ijarah',
        contract_document_number: 'DOC-SKK-2026/001',
        contract_document_url: 'https://storage.fundex.id/contracts/doc-skk-001.pdf',
        contract_underlying_fund: '5000000000', // 5 Miliar
        contract_start_date: '2026-01-01',
        contract_end_date: '2026-12-31',
        contract_duration_in_months: '12',
        contract_status: 'PERFORMING',
        contract_yield_amount: '600000000', // 600 Juta
        contract_yield_rate_annually: '12.00',
        contract_fee_administration: '2500000',
        contract_fee_provision: '50000000',
        contract_fee_platform: '10000000',
        contract_fee_servicing: '5000000',
        contract_fee_servicing_percentage: '0.10',
        contract_fee_monitoring: '3000000',
        contract_fee_monitoring_percentage_monthly: '0.06',
        contract_penalty_percentage_daily: '0.10',
        contract_tax_ppn: '1100000',
        contract_tax_yield: '90000000'
      });
    };

    fetchDummyData();
  }, [repaymentId]);

  const handleEditSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Logic hit API PUT/PATCH lo ntar disini
      console.log('Update Data ID:', repaymentId, 'Payload:', formData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulasi network delay
      
      closePanel();
    } catch (error) {
      console.error("Gagal update data", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Skeleton loading sederhana selama data dummy diproses
  if (!initialData) {
    return (
      <div className="flex items-center justify-center h-full p-6 text-slate-500 text-sm animate-pulse">
        Sedang memuat data kontrak...
      </div>
    );
  }

  return (
    <RepaymentSecurityForm 
      initialData={initialData}
      onSubmit={handleEditSubmit} 
      isLoading={isSubmitting} 
    />
  );
}