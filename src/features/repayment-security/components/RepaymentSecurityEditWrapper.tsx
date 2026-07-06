import React, { useState, useEffect } from 'react';
import RepaymentSecurityForm from './RepaymentSecurityForm';
import { useSidePanel } from '../../../contexts/SidePanelContext';
import { repaymentSecurityService } from '../services/repaymentSecurityService'; // Sesuaikan path

interface EditWrapperProps {
  repaymentId: string;
}

export default function RepaymentSecurityEditWrapper({ repaymentId }: EditWrapperProps) {
  const { closePanel } = useSidePanel();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);
  const [errorFetch, setErrorFetch] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setErrorFetch(null);
        // Memanggil API GET lewat Service
        const responseData = await repaymentSecurityService.getDetail(repaymentId);
        
        // Sesuaikan dengan struktur response dari NestJS Anda
        setInitialData(responseData.data.item);
      } catch (error: any) {
        console.error("Gagal memuat detail kontrak:", error);
        setErrorFetch(error?.response?.data?.message || "Gagal memuat data dari server.");
      }
    };

    if (repaymentId) {
      fetchData();
    }
  }, [repaymentId]);

  const handleEditSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Memanggil API PUT lewat Service
      await repaymentSecurityService.update(repaymentId, formData);
      
      closePanel();
    } catch (error: any) {
      console.error("Gagal update data", error);
      alert(error?.response?.data?.message || "Terjadi kesalahan saat menyimpan perubahan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ... (Logika error handling dan skeleton loading tetap sama seperti sebelumnya)

  if (!initialData) return <div>Loading...</div>;

  return (
    <RepaymentSecurityForm
      initialData={initialData}
      onSubmit={handleEditSubmit}
      isSubmitting={isSubmitting}
      isEditMode={true}
    />
  );
}