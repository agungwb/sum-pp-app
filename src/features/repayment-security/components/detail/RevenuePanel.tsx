
import { Big } from 'big.js';
import React from 'react';
import { formatPercentage, formatRupiah } from '../../../../utils/currency';
import { calculateTax, toFrontendPercentage } from '../../../../utils/finance';
import { RepaymentSecurityWithSinkingFundResponse } from '../../dtos/repayment-security.dto';
import RevenueRow from './RevenueRow';
// Import komponen UI yang dibutuhkan oleh tabel panel summary Anda seperti FeeWithTax, InfoRow, atau formatter

interface RevenueProps {
  repaymentSecurity: RepaymentSecurityWithSinkingFundResponse; // Ganti 'any' dengan tipe data summary yang relevan (RepaymentSecurity, dsb)
}

// export default function CollateralSection({ collaterals, formatRupiah }: CollateralPanelProps) {
export default function RevenuePanel({ repaymentSecurity }: RevenueProps) {

const taxPpn = Big(repaymentSecurity.contractTaxPpn);
const taxFactor = Big(repaymentSecurity.contractTaxFactor);
const duration = Number(repaymentSecurity.contractDurationInMonths)

const feeAdmin = Big(repaymentSecurity.contractFeeAdministration);
const feeAdminPct = Big(repaymentSecurity.contractFeeAdministrationPercentage);
const feeAdminTax = Big(calculateTax(feeAdmin, taxPpn, taxFactor) ?? '0');

const feeProvision = Big(repaymentSecurity.contractFeeProvision);
const feeProvisionPct = Big(repaymentSecurity.contractFeeProvisionPercentage);
const feeProvisionTax = Big(calculateTax(feeProvision, taxPpn, taxFactor) ?? '0');

const feePlatform = Big(repaymentSecurity.contractFeePlatform);
const feePlatformPct = Big(repaymentSecurity.contractFeePlatformPercentage);
const feePlatformTax = Big(calculateTax(feePlatform, taxPpn, taxFactor) ?? '0');

const feeServicing = Big(repaymentSecurity.contractFeeServicing);
const feeServicingPct = Big(repaymentSecurity.contractFeeServicingPercentage);
const feeServicingTax = Big(calculateTax(feeServicing, taxPpn, taxFactor) ?? '0');

const feeMonitoring = Big(repaymentSecurity.contractFeeMonitoring);
const feeMonitoringPctMonthly = Big(repaymentSecurity.contractFeeMonitoringPercentageMonthly);
const feeMonitoringPct = feeMonitoringPctMonthly.times(duration);
const feeMonitoringTax = Big(calculateTax(feeMonitoring, taxPpn, taxFactor) ?? '0');

const totalFee = feeAdmin.plus(feeProvision).plus(feePlatform).plus(feeServicing).plus(feeMonitoring);
const totalPct = feeAdminPct.plus(feeProvisionPct).plus(feePlatformPct).plus(feeServicingPct).plus(feeMonitoringPct);
const totalTax = feeAdminTax.plus(feeProvisionTax).plus(feePlatformTax).plus(feeServicingTax).plus(feeMonitoringTax);

const precision = 2;
const precisionPct = 4;


  return (

      <div className="w-full lg:w-1/2 bg-white rounded-xl border-2 border-slate-200 shadow-sm p-5 flex flex-col">
          <h3 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-4 border-b-2 border-slate-100 pb-2">Rincian Potensi Pendapatan Platform</h3>
          
          <div className="flex-1 flex flex-col gap-3">
             <RevenueRow label="Biaya Administrasi" value={feeAdmin.toFixed(precision)} percentage={feeAdminPct.toFixed(precisionPct)} tax={feeAdminTax.toFixed(precision)}/>
             <RevenueRow label="Biaya Provisi" value={feeProvision.toFixed(precision)} percentage={feeProvisionPct.toFixed(precisionPct)} tax={feeProvisionTax.toFixed(precision)}/>
             <RevenueRow label="Biaya Platform" value={feePlatform.toFixed(precision)} percentage={feePlatformPct.toFixed(precisionPct)} tax={feePlatformTax.toFixed(precision)}/>
             <RevenueRow label={"Biaya Pelayanan (Servicing)"} value={feeServicing.toFixed(precision)} percentage={feeServicingPct.toFixed(precisionPct)} tax={feeServicingTax.toFixed(precision)}/>
             <RevenueRow label={`Biaya Pemantauan ${duration} Bulan`} value={feeMonitoring.toFixed(precision)} percentage={feeMonitoringPct.toFixed(precisionPct)} tax={feeMonitoringTax.toFixed(precision)}/>
          </div>

          <div className="mt-4 pt-4 border-t-2 border-dashed border-slate-300 flex flex-col bg-blue-50 p-4">
          <RevenueRow label='POTENSI REVENUE' value={totalFee.toFixed(precision)} percentage={totalPct.toFixed(precisionPct)} tax={totalTax.toFixed(precision)} size='lg' />
            
             
          </div>
        </div>

  );
};
