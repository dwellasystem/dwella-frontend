// components/resident/tables/InquiriesTable.tsx
import { useState } from 'react';
import { Table } from 'react-bootstrap';
import type { Inquiry } from '../../../models/Inquiry.model';
import { formatDateToHumanReadable } from '../../../helpers/authHelper/dateHelper';
import ViewInquiryModal from '../ViewInquiryModal'; // Import the modal

type Props = {
  inquiries?: Inquiry[];
}

function InquiriesTable({ inquiries }: Props) {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  return (
    <div className="w-100 d-flex flex-column">
      <div className="overflow-auto">
        <Table responsive={"sm"} className='table-bordered'>
          <thead>
            <tr className="text-nowrap">
              <th style={{ backgroundColor: "#F2F2F7" }}>Title</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Unit Number</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Type</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Date Requested</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Photo</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Status</th>
              <th style={{ backgroundColor: "#F2F2F7" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries?.map((inquiry: Inquiry) => (
              <tr key={inquiry.id} className="text-nowrap">
                <td>{inquiry.title}</td>
                <td>{inquiry.unit.unit_name} - {inquiry.unit.building}</td>
                <td>{inquiry.type}</td>
                <td>{formatDateToHumanReadable(inquiry.created_at ?? '')}</td>
                <td className='text-start text-primary'>
                  {inquiry.photo && (
                    <div 
                      onClick={() => window.open(`${inquiry.photo}`, "_blank")} 
                      style={{ cursor: "pointer" }}
                    >
                      View Attachment
                    </div>
                  )}
                  {!inquiry.photo && <span className="text-muted">No attachment</span>}
                </td>
                <td>{inquiry.status}</td>
                <td>
                  <button 
                    onClick={() => setSelectedInquiry(inquiry)}
                    className="btn btn-sm btn-primary"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {inquiries && inquiries.length < 1 && (
              <tr>
                <td colSpan={7} className="text-center">No inquiries found.</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Render the modal */}
      <ViewInquiryModal 
        inquiry={selectedInquiry} 
        onClose={() => setSelectedInquiry(null)} 
      />
    </div>
  );
}

export default InquiriesTable;