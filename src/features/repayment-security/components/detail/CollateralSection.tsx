import React from 'react';

interface CollateralListProps {
  collaterals: any[];
  formatRupiah: (numStr: string | number) => string;
}

export default function CollateralSection({ collaterals, formatRupiah }: CollateralListProps) {
  // Helper internal jika ingin mengubah bentuk format string
  const formatStatus = (status: string) => status ? status.replace(/_/g, ' ') : '-';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mt-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Daftar Agunan / Kolateral</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
            <tr>
              <th className="px-4 py-3">Tipe Agunan</th>
              <th className="px-4 py-3">Pemilik Agunan</th>
              <th className="px-4 py-3">Estimasi Nilai</th>
              <th className="px-4 py-3">Status Verifikasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {collaterals.length > 0 ? (
              collaterals.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-700">{item.collateralType}</td>
                  <td className="px-4 py-3">{item.collateralOwnerName}</td>
                  <td className="px-4 py-3">{formatRupiah(item.collateralValueEstimated)}</td>
                  <td className="px-4 py-3">
                     <span className="px-2 py-1 text-[10px] font-bold rounded uppercase bg-blue-50 text-blue-700 border border-blue-200">
                       {formatStatus(item.verificationStatus)}
                     </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-500 italic">
                  Tidak ada data agunan yang tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}