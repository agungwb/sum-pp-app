import { useEffect } from 'react';
import { useBreadcrumb } from '../contexts/BreadcrumbContext'; // Atau dari store Zustand lu

interface BreadcrumbItem {
  label: string;
  path?: string;
}

export const usePageBreadcrumb = (items: BreadcrumbItem[]) => {
  const { setBreadcrumbs } = useBreadcrumb();

  useEffect(() => {
    // Otomatis set saat halaman dibuka
    setBreadcrumbs(items);

    // Opsional: Bersihkan saat halaman ditutup/pindah
    return () => {
      setBreadcrumbs([]);
    };
  }, [setBreadcrumbs]); // array dependencies aman
};