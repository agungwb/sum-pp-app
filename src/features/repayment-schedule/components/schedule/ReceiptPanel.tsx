// src/pages/repayment/components/ReceiptPanel.tsx
import React, { useState } from 'react';
import FeeWithTax from '../../../../components/ui/FeeWithTax';
import { useGlobalMode } from '../../../../contexts/GlobalModeContext';
import { useSidePanel } from '../../../../contexts/SidePanelContext';
import { InvoiceSummaryWithPenaltyBig } from '../../types/repayment-schedule.type';
import { RepaymentReceiptDetailResponse } from '../../../repayment-receipt/dtos/repayment-receipt.dto';
import RepaymentReceiptCreateWrapper from '../../../repayment-receipt/components/form/RepaymentReceiptCreateWrapper';
import RepaymentReceiptEditWrapper from '../../../repayment-receipt/components/form/RepaymentReceiptEditWrapper';

interface ReceiptPanelProps {
  receipts: RepaymentReceiptDetailResponse[];
  invoiceSummary: InvoiceSummaryWithPenaltyBig;
}

export default function ReceiptPanel({ receipts, invoiceSummary }: ReceiptPanelProps) {
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const { isEditMode } = useGlobalMode();
  const { openPanel } = useSidePanel();

  // Toggle expand/collapse row
  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Formatter Rupiah
  const formatRupiah = (value: string | number) => {
    const numeric = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numeric)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(numeric);
  };

  // Formatter Tanggal
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className="mb-4">
        <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Riwayat Penerimaan Pembayaran (Repayment Receipt)
        </h2>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Daftar kuitansi setoran dana dari penerbit untuk tagihan term ini
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 text-[9px] text-slate-500 uppercase tracking-wider border-y border-slate-200">
              <th className="py-2.5 px-3 w-8"></th>
              <th className="py-2.5 px-3 font-bold text-left">No</th>
              <th className="py-2.5 px-3 font-bold text-left">Tanggal Diterima</th>
              <th className="py-2.5 px-3 font-bold text-center">Metode Pembayaran</th>
              <th className="py-2.5 px-3 font-bold text-center">Notes</th>
              <th className="py-2.5 px-3 font-bold text-right">Jumlah Dana Diterima</th>
              <th className="py-2.5 px-3 font-bold text-center">Status</th>
              {isEditMode && <th className="py-2.5 px-3 font-bold text-center">Edit</th>}
            </tr>
          </thead>

          <tbody className="text-[11px] font-medium text-slate-700 divide-y divide-slate-100">
            {receipts.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-4 px-3 text-center text-slate-500 italic">
                  -- Belum ada riwayat pembayaran --
                </td>
              </tr>
            ) : (
              receipts.map((rcpt, idx) => {
                const isExpanded = expandedRows.includes(rcpt.id);

                return (
                  <React.Fragment key={rcpt.id}>
                    <tr
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                      onClick={() => toggleRow(rcpt.id)}
                    >
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            className={`w-3.5 h-3.5 transition-transform duration-300 ease-in-out ${
                              isExpanded ? 'rotate-45 text-rose-500' : 'text-slate-400'
                            }`}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </div>
                      </td>
                      <td className="py-3 px-3">{idx + 1}</td>
                      <td className="py-3 px-3">{formatDate(rcpt.receiptDate)}</td>
                      <td className="py-3 px-3 text-center">BANK TRANSFER</td>
                      <td className="py-3 px-3 text-center">{rcpt.receiptNotes}</td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600">
                        {formatRupiah(rcpt.receiptTotalWithTax)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase inline-block bg-emerald-50 text-emerald-600 border border-emerald-200">
                          {rcpt.receiptStatus}
                        </span>
                      </td>
                      {isEditMode && (
                        <td className="py-3 px-3 text-left align-top">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openPanel(
                                <RepaymentReceiptEditWrapper receiptId={rcpt.id} invoiceSummary={invoiceSummary}/>
                              );
                            }}
                            className="text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-1 py-1 rounded-lg hover:bg-amber-100 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200 flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                          </button>
                        </td>
                      )}
                    </tr>

                    {/* EXPANDED ROW DETAIL */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={8} className="p-0 border-b border-slate-100 bg-slate-50/50">
                          <div className="py-4 px-6 mr-24 my-2 flex justify-end gap-4 text-[11px] animate-in fade-in duration-300">
                            <div className="w-1/2 bg border-l-2 border-slate-300">
                              {Number(rcpt?.receiptFeeAdministration) > 0 && (
                                <div className="flex justify-between items-center p-2 mb-2 rounded">
                                  <span className="font-normal text-slate-900">Biaya Administrasi</span>
                                  <FeeWithTax
                                    base={Number(rcpt.receiptFeeAdministration)}
                                    tax={Number(rcpt.receiptFeeAdministrationTax)}
                                  />
                                </div>
                              )}

                              {Number(rcpt?.receiptFeeProvision) > 0 && (
                                <div className="flex justify-between items-center p-2 mb-2 rounded">
                                  <span className="font-normal text-slate-900">Biaya Provisi</span>
                                  <FeeWithTax
                                    base={Number(rcpt.receiptFeeProvision)}
                                    tax={Number(rcpt.receiptFeeProvisionTax)}
                                  />
                                </div>
                              )}

                              {Number(rcpt?.receiptFeeServicing) > 0 && (
                                <div className="flex justify-between items-center p-2 mb-2 rounded">
                                  <span className="font-normal text-slate-900">Biaya Servicing</span>
                                  <FeeWithTax
                                    base={Number(rcpt.receiptFeeServicing)}
                                    tax={Number(rcpt.receiptFeeServicingTax)}
                                  />
                                </div>
                              )}

                              {Number(rcpt?.receiptFeeMonitoring) > 0 && (
                                <div className="flex justify-between items-center p-2 mb-2 rounded">
                                  <span className="font-normal text-slate-900">Biaya Monitoring</span>
                                  <FeeWithTax
                                    base={Number(rcpt.receiptFeeMonitoring)}
                                    tax={Number(rcpt.receiptFeeMonitoringTax)}
                                  />
                                </div>
                              )}

                              {Number(rcpt?.receiptFeeOther) > 0 && (
                                <div className="flex justify-between items-center p-2 mb-2 rounded">
                                  <span className="font-normal text-slate-900">Biaya Lain-lain</span>
                                  <FeeWithTax
                                    base={Number(rcpt.receiptFeeOther)}
                                    tax={Number(rcpt.receiptFeeOtherTax)}
                                  />
                                </div>
                              )}

                              {Number(rcpt?.receiptSinkingFund) > 0 && (
                                <div className="flex justify-between items-center p-2 mb-2 rounded">
                                  <span className="font-normal text-slate-900">Cicilan Sinking Fund</span>
                                  <FeeWithTax base={Number(rcpt.receiptSinkingFund)} />
                                </div>
                              )}

                              {Number(rcpt?.receiptYield) > 0 && (
                                <div className="flex justify-between items-center p-2 mb-2 rounded">
                                  <span className="font-normal text-slate-900">Imbal hasil / Kupon</span>
                                  <FeeWithTax base={Number(rcpt.receiptYield)} />
                                </div>
                              )}

                              {Number(rcpt?.receiptPenalty) > 0 && (
                                <div className="flex justify-between items-center p-2 mb-2 rounded">
                                  <span className="font-normal text-slate-900">Denda</span>
                                  <FeeWithTax base={Number(rcpt.receiptPenalty)} />
                                </div>
                              )}

                              {Number(rcpt?.receiptActualLoss) > 0 && (
                                <div className="flex justify-between items-center p-2 mb-2 rounded">
                                  <span className="font-normal text-slate-900">Kerugian Riil</span>
                                  <FeeWithTax base={Number(rcpt.receiptActualLoss)} />
                                </div>
                              )}

                              <div className="flex justify-between items-center p-2 mb-2 rounded">
                                <span className="font-semibold text-slate-900">TOTAL</span>
                                <FeeWithTax
                                  base={Number(rcpt.receiptTotal)}
                                  tax={Number(rcpt.receiptTotalTax)}
                                />
                              </div>

                              <div className="flex justify-between items-center p-2 mb-2 rounded">
                                <span className="font-bold text-slate-900">TOTAL + PAJAK</span>
                                <FeeWithTax base={Number(rcpt.receiptTotalWithTax)} />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}

            {/* Row Tambah Receipt Pembayaran */}
            {isEditMode && (
              <tr>
                <td ></td>
                <td colSpan={6} className="p-0">
                 
                  <button
                      type="button"
                      onClick={() => openPanel(<RepaymentReceiptCreateWrapper invoiceSummary={invoiceSummary} />)}
                      className="w-full flex items-center justify-center gap-2 py-3 border-2 m-4 border-dashed rounded-lg border-amber-200 bg-amber-50/40 hover:bg-amber-100 text-amber-700 transition-all focus:outline-none focus:ring-2 focus:ring-amber-200 group"
                    >
                      <div className="bg-amber-100 p-1 rounded-full group-hover:bg-amber-500 transition-colors">
                        <svg className="w-4 h-4 text-amber-600 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <span className="font-semibold text-xs">Tambah Bukti Pembayaran</span>
                    </button>
                </td>
              </tr>
            )}

            {receipts.length > 0 && (
              <tr className="bg-slate-50/50 border-t border-slate-200 font-bold">
                <td colSpan={5} className="py-2.5 px-3 text-right text-slate-900 text-xs uppercase">
                  Total Pembayaran Diterima
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-emerald-700 text-xs">
                  {formatRupiah(
                    receipts.reduce((sum, item) => sum + Number(item.receiptTotalWithTax || 0), 0)
                  )}
                </td>
                <td colSpan={2}></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}