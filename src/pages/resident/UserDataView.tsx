// components/UserDataView.tsx
import React from 'react';
import { BiSolidReport } from 'react-icons/bi';
import { useAuth } from '../../contexts/auth/AuthContext';

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
      const response = await fetch(`http://localhost:8000/api/bills/financial-reports/user/${user?.id}/?period=yearly`);
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

      // Create HTML template - COMPACT VERSION
      const pdfContent = document.createElement('div');
      pdfContent.style.width = '200mm'; // Slightly smaller to fit better
      pdfContent.style.minHeight = '280mm'; // Reduced height
      pdfContent.style.padding = '15mm'; // Reduced padding
      pdfContent.style.background = 'white';
      pdfContent.style.fontFamily = 'Arial, sans-serif';
      pdfContent.style.color = '#333';
      pdfContent.style.lineHeight = '1.3'; // Tighter line height
      pdfContent.style.fontSize = '10px'; // Base font size

      const summary = reportData.summary;

      pdfContent.innerHTML = `
        <!-- Compact Header -->
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #344CB7; padding-bottom: 15px;">
          <h1 style="color: #344CB7; margin-top: 10px; font-size: 25px; font-weight: bold;">DWELLA</h1>
          <h1 style="color: #344CB7; margin: 0; font-size: 20px; font-weight: bold;">FINANCIAL STATEMENT ${reportData.year}</h1>
          <p style="color: #666; margin: 5px 0 0 0; font-size: 11px;">Generated on ${new Date().toLocaleDateString('en-PH')} • ID: USR-${reportData.user_id}</p>
        </div>

        <!-- Ultra Compact Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 20px;">
          <div style="background: #e8f5e8; padding: 10px; border-radius: 6px; text-align: center; border-left: 3px solid #28a745;">
            <div style="font-size: 11px; color: #666; margin-bottom: 3px;">Paid</div>
            <div style="font-size: 12px; font-weight: bold; color: #28a745;">${formatCompactPeso(summary.total_paid)}</div>
          </div>
          <div style="background: #fde8e8; padding: 10px; border-radius: 6px; text-align: center; border-left: 3px solid #dc3545;">
            <div style="font-size: 11px; color: #666; margin-bottom: 3px;">Outstanding</div>
            <div style="font-size: 12px; font-weight: bold; color: #dc3545;">${formatCompactPeso(summary.total_unpaid)}</div>
          </div>
          <div style="background: #e8f4f8; padding: 10px; border-radius: 6px; text-align: center; border-left: 3px solid #344CB7;">
            <div style="font-size: 11px; color: #666; margin-bottom: 3px;">Expected</div>
            <div style="font-size: 12px; font-weight: bold; color: #344CB7;">${formatCompactPeso(summary.total_expected)}</div>
          </div>
          <div style="background: #fff3cd; padding: 10px; border-radius: 6px; text-align: center; border-left: 3px solid #ffc107;">
            <div style="font-size: 11px; color: #666; margin-bottom: 3px;">Completion</div>
            <div style="font-size: 12px; font-weight: bold; color: #856404;">${summary.payment_completion}</div>
          </div>
        </div>

        <!-- Mini Metrics Row -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 20px; font-size: 9px;">
          <div style="text-align: center;">
            <strong>${summary.total_bills}</strong> Total Bills
          </div>
          <div style="text-align: center;">
            <strong>${formatCompactPeso(summary.average_payment)}</strong> Avg Payment
          </div>
          <div style="text-align: center;">
            <strong>${formatCompactPeso(summary.average_monthly_payment)}</strong> Avg Monthly
          </div>
        </div>

        <!-- Compact Monthly Breakdown -->
        <div style="margin-bottom: 15px;">
          <h2 style="color: #344CB7; border-bottom: 1px solid #344CB7; padding-bottom: 5px; font-size: 14px; margin-bottom: 10px;">
            MONTHLY BREAKDOWN
          </h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 8px; margin-bottom: 10px;">
            <thead>
              <tr style="background: #344CB7; color: white;">
                <th style="padding: 6px 4px; text-align: left; border: 1px solid #2a3d99; width: 18%;">Month</th>
                <th style="padding: 6px 4px; text-align: right; border: 1px solid #2a3d99; width: 20%;">Paid</th>
                <th style="padding: 6px 4px; text-align: right; border: 1px solid #2a3d99; width: 20%;">Outstanding</th>
                <th style="padding: 6px 4px; text-align: right; border: 1px solid #2a3d99; width: 20%;">Expected</th>
                <th style="padding: 6px 4px; text-align: center; border: 1px solid #2a3d99; width: 12%;">Bills</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.monthly_breakdown.map((month, index) => `
                <tr style="${index % 2 === 0 ? 'background: #f8f9fa;' : 'background: white;'}">
                  <td style="padding: 4px 3px; border: 1px solid #ddd; font-weight: bold; font-size: 7px;">${month.month.substring(0, 3)}</td>
                  <td style="padding: 4px 3px; border: 1px solid #ddd; text-align: right; color: #28a745; font-weight: bold;">
                    ${formatCompactPeso(month.amount_paid)}
                  </td>
                  <td style="padding: 4px 3px; border: 1px solid #ddd; text-align: right; color: #dc3545; font-weight: bold;">
                    ${formatCompactPeso(month.amount_unpaid)}
                  </td>
                  <td style="padding: 4px 3px; border: 1px solid #ddd; text-align: right; font-weight: bold;">
                    ${formatCompactPeso(month.amount_expected)}
                  </td>
                  <td style="padding: 4px 3px; border: 1px solid #ddd; text-align: center;">
                    ${month.bill_count}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Compact Unit Breakdown -->
        ${reportData.detailed_breakdown?.by_unit && reportData.detailed_breakdown.by_unit.length > 0 ? `
          <div style="margin-bottom: 15px;">
            <h2 style="color: #344CB7; border-bottom: 1px solid #344CB7; padding-bottom: 5px; font-size: 14px; margin-bottom: 10px;">
              UNIT SUMMARY
            </h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 8px;">
              <thead>
                <tr style="background: #344CB7; color: white;">
                  <th style="padding: 6px 4px; text-align: left; border: 1px solid #2a3d99; width: 15%;">Unit</th>
                  <th style="padding: 6px 4px; text-align: left; border: 1px solid #2a3d99; width: 10%;">Bldg</th>
                  <th style="padding: 6px 4px; text-align: right; border: 1px solid #2a3d99; width: 20%;">Paid</th>
                  <th style="padding: 6px 4px; text-align: right; border: 1px solid #2a3d99; width: 20%;">Outstanding</th>
                  <th style="padding: 6px 4px; text-align: center; border: 1px solid #2a3d99; width: 15%;">Completion</th>
                  <th style="padding: 6px 4px; text-align: center; border: 1px solid #2a3d99; width: 10%;">Bills</th>
                </tr>
              </thead>
              <tbody>
                ${reportData.detailed_breakdown.by_unit.map((unit, index) => `
                  <tr style="${index % 2 === 0 ? 'background: #f8f9fa;' : 'background: white;'}">
                    <td style="padding: 4px 3px; border: 1px solid #ddd; font-weight: bold;">${unit.unit_name}</td>
                    <td style="padding: 4px 3px; border: 1px solid #ddd;">${unit.building}</td>
                    <td style="padding: 4px 3px; border: 1px solid #ddd; text-align: right; color: #28a745; font-weight: bold;">
                      ${formatCompactPeso(unit.total_paid)}
                    </td>
                    <td style="padding: 4px 3px; border: 1px solid #ddd; text-align: right; color: #dc3545; font-weight: bold;">
                      ${formatCompactPeso(unit.total_unpaid)}
                    </td>
                    <td style="padding: 4px 3px; border: 1px solid #ddd; text-align: center; font-weight: bold;
                      color: ${parseFloat(unit.unit_completion) === 100 ? '#28a745' : 
                              parseFloat(unit.unit_completion) >= 80 ? '#ffc107' : '#dc3545'};
                      font-size: 7px;">
                      ${unit.unit_completion}
                    </td>
                    <td style="padding: 4px 3px; border: 1px solid #ddd; text-align: center;">
                      ${unit.bill_count}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : ''}

        <!-- Ultra Compact Footer -->
        <div style="border-top: 1px solid #344CB7; padding-top: 10px; margin-top: 15px;">
          <div style="text-align: center; color: #666; font-size: 7px; line-height: 1.2;">
            <p style="margin: 2px 0;">Auto-generated statement for internal reference • All amounts in PHP (₱)</p>
            <p style="margin: 2px 0; font-weight: bold;">DOC-${reportData.user_id}-${reportData.year}-${Date.now().toString().slice(-6)}</p>
          </div>
        </div>
      `;

      // Append to body for rendering
      document.body.appendChild(pdfContent);

      // Convert to PDF with higher scale for better quality despite small fonts
      const canvas = await html2canvas(pdfContent, {
        scale: 3, // Higher scale for better readability
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

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