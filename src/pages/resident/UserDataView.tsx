// components/UserDataView.tsx
import React from 'react';
import { BiSolidReport } from 'react-icons/bi';
import { useAuth } from '../../contexts/auth/AuthContext';
import { API_BASE_URL } from '../../api/endpoint';

interface FinancialReportData {
  report_type: string;
  user_id: number;
  user_name: string;
  user_email: string;
  year: number;
  summary: {
    total_paid: number;
    total_unpaid: number;
    total_expected: number;
    total_bills: number;
    paid_bills_count: number;
    unpaid_bills_count: number;
    average_payment: number;
    payment_completion: string;
    average_monthly_payment: number;
    // Add expense fields
    security_fee: number;
    maintenance_fee: number;
    amenities_fee: number;
    yearly_total_fees: number;
    total_expenses: number;
    total_monthly_obligation: number; 
  };
  monthly_breakdown: Array<{
    month: string;
    month_number: number;
    amount_paid: number;
    amount_unpaid: number;
    amount_expected: number;
    bill_count: number;
    monthly_completion: string;
    percentage_of_year: number;
    charges_applied: boolean;
  }>;
  detailed_breakdown?: {
    by_unit: Array<{
      unit_name: string;
      building: string;
      rent_amount: number;
      total_paid: number;
      total_unpaid: number;
      total_expected: number;
      bill_count: number;
      paid_bills: number;
      unpaid_bills: number;
      average_payment: number;
      unit_completion: string;
      months_with_payments: number;
      percentage_of_total: number;
      // Add unit-specific expenses
      security_fee: number;
      maintenance_fee: number;
      amenities_fee: number;
      total_monthly_fees: number;
    }>;
  };
}

// Philippine Peso formatter
const formatPhilippinePeso = (amount: number): string => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

// Compact number formatter (removes decimal for whole numbers)
const formatCompactPeso = (amount: number): string => {
  if (amount % 1 === 0) {
    return `₱${amount.toLocaleString('en-PH')}`;
  }
  return formatPhilippinePeso(amount);
};

const UserDataView: React.FC = () => {
  const {user} = useAuth();
  const fetchFinancialReport = async (): Promise<FinancialReportData | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/bills/financial-reports/user/${user?.id}/?period=yearly`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching financial report:', error);
      alert('Error fetching financial data. Please try again.');
      return null;
    }
  };

  
  const handleViewAsPDF = async (): Promise<void> => {
    try {
      // Fetch actual financial data from API
      const reportData = await fetchFinancialReport();
      if (!reportData) return;

      const { jsPDF } = await import('jspdf');
      const html2canvas = await import('html2canvas').then(module => module.default);
      
      // Create HTML template - ULTRA COMPACT for single page
      const pdfContent = document.createElement('div');
      pdfContent.style.width = '195mm'; // Reduced width
      pdfContent.style.minHeight = '270mm'; // Reduced height to fit A4
      pdfContent.style.padding = '8mm'; // Minimal padding
      pdfContent.style.background = 'white';
      pdfContent.style.fontFamily = 'Arial, sans-serif';
      pdfContent.style.color = '#333';
      pdfContent.style.lineHeight = '1.2'; // Very tight line height
      pdfContent.style.fontSize = '8px'; // Very small base font
      pdfContent.style.letterSpacing = '0.2px'; // Slight letter spacing for readability
      
      const summary = reportData.summary;

      pdfContent.innerHTML = `
        <!-- ULTRA COMPACT Header -->
        <div style="text-align: center; margin-bottom: 10px; border-bottom: 1.5px solid #344CB7; padding-bottom: 8px;">
          <h1 style="color: #344CB7; margin-top: 2px; font-size: 18px; font-weight: bold; letter-spacing: 0.5px;">DWELLA FINANCIAL STATEMENT</h1>
          <p style="color: #666; margin: 2px 0 0 0; font-size: 9px;">${reportData.year} • Tenant: ${reportData.user_name}</p>
          <p style="color: #999; margin: 1px 0 0 0; font-size: 7px;">Generated ${new Date().toLocaleDateString('en-PH')} • ID: USR-${reportData.user_id}</p>
        </div>

        <!-- EXPENSES SECTION - EXTREMELY COMPACT -->
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <h2 style="color: #344CB7; font-size: 10px; font-weight: bold; margin: 0;">MONTHLY EXPENSES</h2>
            <div style="font-size: 11px; font-weight: bold; color: #721c24; text-align: right;">
              ${formatCompactPeso(summary.total_expenses || 7500)}<br>
              <span style="font-size: 6px; color: #999; font-weight: normal;">Total Monthly</span>
            </div>
          </div>
          
          <!-- Expenses Grid - Ultra Compact -->
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; margin-bottom: 8px;">
            <!-- Security -->
            <div style="background: linear-gradient(to right, #e8f5e8, #ffffff); padding: 6px; border-radius: 4px; border-left: 2px solid #28a745; min-height: 35px;">
              <div style="font-size: 7px; color: #666; margin-bottom: 1px;">Security</div>
              <div style="font-size: 9px; font-weight: bold; color: #28a745; margin-bottom: 1px;">${formatCompactPeso(summary.security_fee || 2500)}</div>
              <div style="font-size: 5px; color: #666; line-height: 1.1;">
                CCTV • Guards • Access
              </div>
            </div>
            
            <!-- Maintenance -->
            <div style="background: linear-gradient(to right, #e8f4f8, #ffffff); padding: 6px; border-radius: 4px; border-left: 2px solid #17a2b8; min-height: 35px;">
              <div style="font-size: 7px; color: #666; margin-bottom: 1px;">Maintenance</div>
              <div style="font-size: 9px; font-weight: bold; color: #17a2b8; margin-bottom: 1px;">${formatCompactPeso(summary.maintenance_fee || 2000)}</div>
              <div style="font-size: 5px; color: #666; line-height: 1.1;">
                Cleaning • Repairs • Pest
              </div>
            </div>
            
            <!-- Amenities -->
            <div style="background: linear-gradient(to right, #fff3cd, #ffffff); padding: 6px; border-radius: 4px; border-left: 2px solid #ffc107; min-height: 35px;">
              <div style="font-size: 7px; color: #666; margin-bottom: 1px;">Amenities</div>
              <div style="font-size: 9px; font-weight: bold; color: #856404; margin-bottom: 1px;">${formatCompactPeso(summary.amenities_fee || 3000)}</div>
              <div style="font-size: 5px; color: #666; line-height: 1.1;">
                Gym • Pool • Wi-Fi
              </div>
            </div>
          </div>
          
          <!-- Expense Legend -->
          <div style="background: #f8f9fa; padding: 4px; border-radius: 3px; border: 1px solid #e9ecef; font-size: 5px; color: #666;">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; text-align: center;">
              <span>• 24/7 Security & Fire Safety</span>
              <span>• Plumbing & Electrical Repairs</span>
              <span>• Gym, Pool, Function Hall</span>
            </div>
          </div>
        </div>

        <!-- FINANCIAL SUMMARY - VERY COMPACT -->
        <div style="margin-bottom: 12px;">
          <h2 style="color: #344CB7; font-size: 10px; font-weight: bold; margin: 0 0 6px 0; border-bottom: 1px solid #dee2e6; padding-bottom: 3px;">FINANCIAL SUMMARY</h2>
          
          <!-- Main Financial Cards -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin-bottom: 6px;">
            <!-- Paid -->
            <div style="background: linear-gradient(135deg, #e8f5e8, #d4edda); padding: 6px; border-radius: 4px; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
              <div style="font-size: 6px; color: #666; margin-bottom: 1px; font-weight: bold;">PAID</div>
              <div style="font-size: 9px; font-weight: bold; color: #28a745;">${formatCompactPeso(summary.total_paid)}</div>
              <div style="font-size: 5px; color: #666; margin-top: 1px;">${summary.paid_bills_count} bills</div>
            </div>
            
            <!-- Outstanding -->
            <div style="background: linear-gradient(135deg, #fde8e8, #f8d7da); padding: 6px; border-radius: 4px; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
              <div style="font-size: 6px; color: #666; margin-bottom: 1px; font-weight: bold;">OUTSTANDING</div>
              <div style="font-size: 9px; font-weight: bold; color: #dc3545;">${formatCompactPeso(summary.total_unpaid)}</div>
              <div style="font-size: 5px; color: #666; margin-top: 1px;">${summary.unpaid_bills_count} bills</div>
            </div>
            
            <!-- Total Due -->
            <div style="background: linear-gradient(135deg, #e8f4f8, #d1ecf1); padding: 6px; border-radius: 4px; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
              <div style="font-size: 6px; color: #666; margin-bottom: 1px; font-weight: bold;">TOTAL DUE</div>
              <div style="font-size: 9px; font-weight: bold; color: #344CB7;">${formatCompactPeso(summary.total_expected)}</div>
              <div style="font-size: 5px; color: #666; margin-top: 1px;">${summary.total_bills} bills</div>
            </div>
            
            <!-- Completion -->
            <div style="background: linear-gradient(135deg, #fff3cd, #fff3cd); padding: 6px; border-radius: 4px; text-align: center; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
              <div style="font-size: 6px; color: #666; margin-bottom: 1px; font-weight: bold;">COMPLETION</div>
              <div style="font-size: 10px; font-weight: bold; color: #856404;">${summary.payment_completion}</div>
              <div style="font-size: 5px; color: #666; margin-top: 1px;">Payment Rate</div>
            </div>
          </div>
        </div>

        <!-- MONTHLY BREAKDOWN - ULTRA COMPACT TABLE -->
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <h2 style="color: #344CB7; font-size: 10px; font-weight: bold; margin: 0;">MONTHLY PAYMENTS</h2>
            <div style="font-size: 6px; color: #666;">(Amounts in ₱)</div>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 6px; border: 1px solid #dee2e6; margin-bottom: 5px;">
            <thead>
              <tr style="background: linear-gradient(to right, #344CB7, #2a3d99); color: white;">
                <th style="padding: 4px 2px; text-align: left; border: 1px solid #2a3d99; width: 14%; font-weight: bold; font-size: 6px;">Month</th>
                <th style="padding: 4px 2px; text-align: right; border: 1px solid #2a3d99; width: 16%; font-weight: bold; font-size: 6px;">Paid</th>
                <th style="padding: 4px 2px; text-align: right; border: 1px solid #2a3d99; width: 16%; font-weight: bold; font-size: 6px;">Unpaid</th>
                <th style="padding: 4px 2px; text-align: right; border: 1px solid #2a3d99; width: 16%; font-weight: bold; font-size: 6px;">Due</th>
                <th style="padding: 4px 2px; text-align: right; border: 1px solid #2a3d99; width: 16%; font-weight: bold; font-size: 6px;">Expenses</th>
                <th style="padding: 4px 2px; text-align: center; border: 1px solid #2a3d99; width: 12%; font-weight: bold; font-size: 6px;">Bills</th>
                <th style="padding: 4px 2px; text-align: center; border: 1px solid #2a3d99; width: 10%; font-weight: bold; font-size: 6px;">%</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.monthly_breakdown.map((month, index) => {
                const monthlyExpenses = summary.total_expenses || 7500;
                const completion = parseFloat(month.monthly_completion) || 0;

                return `
                  <tr style="${index % 2 === 0 ? 'background: #f8f9fa;' : 'background: white;'} height: 18px;">
                    <td style="padding: 3px 2px; border: 1px solid #dee2e6; font-weight: bold; font-size: 6px; color: #333;">${month.month.substring(0, 3)}</td>
                    <td style="padding: 3px 2px; border: 1px solid #dee2e6; text-align: right; font-weight: bold; font-size: 6px; color: #28a745;">${formatCompactPeso(month.amount_paid)}</td>
                    <td style="padding: 3px 2px; border: 1px solid #dee2e6; text-align: right; font-weight: bold; font-size: 6px; color: #dc3545;">${formatCompactPeso(month.amount_unpaid)}</td>
                    <td style="padding: 3px 2px; border: 1px solid #dee2e6; text-align: right; font-weight: bold; font-size: 6px; color: #495057;">${formatCompactPeso(month.amount_expected)}</td>
                    <td style="padding: 3px 2px; border: 1px solid #dee2e6; text-align: right; font-weight: bold; font-size: 6px; color: #6c757d;">${month.charges_applied ? formatCompactPeso(monthlyExpenses) : formatCompactPeso(0)}</td>
                    <td style="padding: 3px 2px; border: 1px solid #dee2e6; text-align: center; font-size: 6px; color: #333;">${month.bill_count}</td>
                    <td style="padding: 3px 2px; border: 1px solid #dee2e6; text-align: center; font-size: 6px; font-weight: bold; 
                      color: ${completion === 100 ? '#28a745' : completion >= 80 ? '#ffc107' : '#dc3545'};
                      background: ${completion === 100 ? '#e8f5e8' : completion >= 80 ? '#fff3cd' : '#fde8e8'};">
                      ${completion}%
                    </td>
                  </tr>
                `;
              }).join('')}
              
              <!-- TOTAL ROW -->
              <tr style="background: linear-gradient(to right, #f8f9fa, #e9ecef); border-top: 2px solid #344CB7;">
                <td style="padding: 4px 2px; border: 1px solid #dee2e6; font-weight: bold; font-size: 7px; color: #333;">TOTAL</td>
                <td style="padding: 4px 2px; border: 1px solid #dee2e6; text-align: right; font-weight: bold; font-size: 7px; color: #28a745;">${formatCompactPeso(summary.total_paid)}</td>
                <td style="padding: 4px 2px; border: 1px solid #dee2e6; text-align: right; font-weight: bold; font-size: 7px; color: #dc3545;">${formatCompactPeso(summary.total_unpaid)}</td>
                <td style="padding: 4px 2px; border: 1px solid #dee2e6; text-align: right; font-weight: bold; font-size: 7px; color: #495057;">${formatCompactPeso(summary.total_expected)}</td>
                <td style="padding: 4px 2px; border: 1px solid #dee2e6; text-align: right; font-weight: bold; font-size: 7px; color: #721c24;">${formatCompactPeso((summary.yearly_total_fees))}</td>
                <td style="padding: 4px 2px; border: 1px solid #dee2e6; text-align: center; font-weight: bold; font-size: 7px; color: #333;">${summary.total_bills}</td>
                <td style="padding: 4px 2px; border: 1px solid #dee2e6; text-align: center; font-weight: bold; font-size: 7px; color: #856404; background: #fff3cd;">
                  ${summary.payment_completion}
                </td>
              </tr>
            </tbody>
          </table>
          
          <!-- Legend -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px; font-size: 5px; color: #666; margin-top: 4px;">
            <div><span style="color: #28a745; font-weight: bold;">●</span> Paid Amount</div>
            <div><span style="color: #dc3545; font-weight: bold;">●</span> Outstanding</div>
            <div><span style="color: #495057; font-weight: bold;">●</span> Total Due</div>
            <div><span style="color: #721c24; font-weight: bold;">●</span> Yearly Expenses</div>
          </div>
        </div>

        <!-- UNIT BREAKDOWN - CONDENSED -->
        ${reportData.detailed_breakdown?.by_unit && reportData.detailed_breakdown.by_unit.length > 0 ? `
          <div style="margin-bottom: 12px;">
            <h2 style="color: #344CB7; font-size: 10px; font-weight: bold; margin: 0 0 5px 0; border-bottom: 1px solid #dee2e6; padding-bottom: 3px;">UNIT SUMMARY</h2>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 6px; border: 1px solid #dee2e6;">
              <thead>
                <tr style="background: linear-gradient(to right, #6c757d, #5a6268); color: white;">
                  <th style="padding: 4px 2px; text-align: left; border: 1px solid #5a6268; width: 18%; font-weight: bold; font-size: 6px;">Unit</th>
                  <th style="padding: 4px 2px; text-align: left; border: 1px solid #5a6268; width: 12%; font-weight: bold; font-size: 6px;">Bldg</th>
                  <th style="padding: 4px 2px; text-align: right; border: 1px solid #5a6268; width: 20%; font-weight: bold; font-size: 6px;">Paid</th>
                  <th style="padding: 4px 2px; text-align: right; border: 1px solid #5a6268; width: 20%; font-weight: bold; font-size: 6px;">Unpaid</th>
                  <th style="padding: 4px 2px; text-align: center; border: 1px solid #5a6268; width: 18%; font-weight: bold; font-size: 6px;">Completion</th>
                  <th style="padding: 4px 2px; text-align: center; border: 1px solid #5a6268; width: 12%; font-weight: bold; font-size: 6px;">Bills</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.detailed_breakdown.by_unit.map((unit, index) => {
                  const completion = parseFloat(unit.unit_completion) || 0;
                  return `
                    <tr style="${index % 2 === 0 ? 'background: #f8f9fa;' : 'background: white;'} height: 18px;">
                      <td style="padding: 3px 2px; border: 1px solid #dee2e6; font-weight: bold; font-size: 6px; color: #333;">${unit.unit_name}</td>
                      <td style="padding: 3px 2px; border: 1px solid #dee2e6; font-size: 6px; color: #666;">${unit.building}</td>
                      <td style="padding: 3px 2px; border: 1px solid #dee2e6; text-align: right; font-weight: bold; font-size: 6px; color: #28a745;">${formatCompactPeso(unit.total_paid)}</td>
                      <td style="padding: 3px 2px; border: 1px solid #dee2e6; text-align: right; font-weight: bold; font-size: 6px; color: #dc3545;">${formatCompactPeso(unit.total_unpaid)}</td>
                      <td style="padding: 3px 2px; border: 1px solid #dee2e6; text-align: center; font-weight: bold; font-size: 6px;
                        color: ${completion === 100 ? '#28a745' : completion >= 80 ? '#ffc107' : '#dc3545'};
                        background: ${completion === 100 ? '#e8f5e8' : completion >= 80 ? '#fff3cd' : '#fde8e8'};
                        border-radius: 2px;">
                        ${completion}%
                      </td>
                      <td style="padding: 3px 2px; border: 1px solid #dee2e6; text-align: center; font-size: 6px; color: #333;">${unit.bill_count}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <!-- EXPENSE DETAILS - CONDENSED -->
        <div style="margin-bottom: 12px;">
          <h2 style="color: #344CB7; font-size: 10px; font-weight: bold; margin: 0 0 5px 0; border-bottom: 1px solid #dee2e6; padding-bottom: 3px;">EXPENSE DETAILS</h2>
          
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px;">
            <!-- Security Details -->
            <div style="background: #f8f9fa; padding: 5px; border-radius: 3px; border-left: 2px solid #28a745; font-size: 6px;">
              <div style="font-weight: bold; color: #28a745; margin-bottom: 2px; font-size: 7px;">SECURITY</div>
              <div style="color: #666; line-height: 1.1;">
                <div style="margin-bottom: 1px;">• 24/7 Security Guards</div>
                <div style="margin-bottom: 1px;">• CCTV Surveillance</div>
                <div style="margin-bottom: 1px;">• Access Control</div>
                <div style="margin-bottom: 1px;">• Fire Safety Equipment</div>
                <div>• Emergency Response</div>
              </div>
            </div>
            
            <!-- Maintenance Details -->
            <div style="background: #f8f9fa; padding: 5px; border-radius: 3px; border-left: 2px solid #17a2b8; font-size: 6px;">
              <div style="font-weight: bold; color: #17a2b8; margin-bottom: 2px; font-size: 7px;">MAINTENANCE</div>
              <div style="color: #666; line-height: 1.1;">
                <div style="margin-bottom: 1px;">• Garbage Collection</div>
                <div style="margin-bottom: 1px;">• Plumbing Repairs</div>
                <div style="margin-bottom: 1px;">• Electrical Maintenance</div>
                <div style="margin-bottom: 1px;">• Common Area Cleaning</div>
                <div>• HVAC Maintenance</div>
              </div>
            </div>
            
            <!-- Amenities Details -->
            <div style="background: #f8f9fa; padding: 5px; border-radius: 3px; border-left: 2px solid #ffc107; font-size: 6px;">
              <div style="font-weight: bold; color: #856404; margin-bottom: 2px; font-size: 7px;">AMENITIES</div>
              <div style="color: #666; line-height: 1.1;">
                <div style="margin-bottom: 1px;">• Parking Facility</div>
                <div style="margin-bottom: 1px;">• Gym Access</div>
                <div style="margin-bottom: 1px;">• Swimming Pool</div>
                <div style="margin-bottom: 1px;">• Function Hall</div>
                <div>• Wi-Fi Areas</div>
              </div>
            </div>
          </div>
          
          <!-- Expense Summary -->
          <div style="background: linear-gradient(to right, #f8f9fa, #e9ecef); padding: 6px; border-radius: 3px; border: 1px solid #dee2e6; margin-top: 5px;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; font-size: 6px;">
              <div>
                <div style="font-weight: bold; color: #666; margin-bottom: 1px;">Monthly Base Expenses:</div>
                <div style="color: #721c24; font-weight: bold;">${formatCompactPeso(summary.total_expenses || 7500)}</div>
              </div>
              <div>
                <div style="font-weight: bold; color: #666; margin-bottom: 1px;">Yearly Expense Total:</div>
                <div style="color: #721c24; font-weight: bold;">${formatCompactPeso((summary.yearly_total_fees || 7500))}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- COMPACT FOOTER -->
        <div style="border-top: 1px solid #dee2e6; padding-top: 6px; margin-top: 10px;">
          <div style="text-align: center;">
            <div style="font-size: 6px; color: #666; line-height: 1.2; margin-bottom: 3px;">
              <strong>Disclaimer:</strong> This is an auto-generated financial statement for reference purposes only.
            </div>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; font-size: 5px; color: #999;">
              <div>Report ID: DOC-${reportData.user_id}-${reportData.year}</div>
              <div>Generated: ${new Date().toLocaleString('en-PH')}</div>
              <div>Currency: Philippine Peso (₱)</div>
            </div>
            <div style="font-size: 5px; color: #6c757d; margin-top: 3px; font-style: italic;">
              *All monthly expenses are fixed: Security ₱2,500, Maintenance ₱2,000, Amenities ₱3,000
            </div>
          </div>
        </div>
      `;

      // Append to body for rendering
      document.body.appendChild(pdfContent);

      // Convert to PDF with higher scale for better quality despite small fonts
      const canvas = await html2canvas(pdfContent, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: pdfContent.offsetWidth,
        height: pdfContent.offsetHeight
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      // Ensure content fits on one page
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        // Scale down if still too tall
        const scaleFactor = pdf.internal.pageSize.getHeight() / pdfHeight;
        const scaledWidth = pdfWidth * scaleFactor;
        const scaledHeight = pdfHeight * scaleFactor;
        const x = (pdfWidth - scaledWidth) / 2;
        const y = (pdf.internal.pageSize.getHeight() - scaledHeight) / 2;
        pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
      } else {
        // Center vertically
        const y = (pdf.internal.pageSize.getHeight() - pdfHeight) / 2;
        pdf.addImage(imgData, 'PNG', 0, y, pdfWidth, pdfHeight);
      }

      // Generate PDF and open
      const pdfBlob = pdf.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');

      // Clean up
      document.body.removeChild(pdfContent);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <div 
      onClick={handleViewAsPDF}
      className="d-flex align-items-center justify-content-center gap-2 p-3 rounded-3"
      style={{ backgroundColor: "#344CB7", cursor: "pointer" }}
    >
      <BiSolidReport size={25} color="white"/>
      <p className="text-decoration-none text-center text-light m-0 fw-bold">Generate Financial Statement</p>
    </div>
  );
};

export default UserDataView;