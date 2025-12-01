import { Button, Container, Toast, ToastContainer } from "react-bootstrap";
import Header from "../../components/Header";
import Search from "../../components/Search";
import useBilling from "../../hooks/payments/useBilling";
import { useAuth } from "../../contexts/auth/AuthContext";
import { useMemo, useState } from "react";
import usePaginatedBilling from "../../hooks/payments/usePaginatedBilling";
import BillingListTable from "../../components/resident/tables/BillingListTable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDateToHumanReadable } from "../../helpers/authHelper/dateHelper";

declare module "jspdf-autotable" {
  interface UserOptions {
    styles?: any;
    headStyles?: any;
    alternateRowStyles?: any;
  }
}

function Billings() {
  const { user } = useAuth();
  const [search, setSearch] =  useState("");
  const [status, setStatus] =  useState("");
  const [showToast, setShowToast] = useState(false);

  const filtersBilling = useMemo(() => {
    return {
      user: user?.id,
      search: search,
      due_status:status,
    };
  }, [user?.id, search, status]);

  const { billing } = useBilling(filtersBilling);
  const { paginatedBill, nextButton, prevButton, pageNumber } = usePaginatedBilling(filtersBilling);

 const printBilling = () => { 
  if (!billing || billing.length === 0) {
      setShowToast(true); // Show the error toast
      return;
  }

  const doc = new jsPDF();

  // Initialize the plugin (this line fixes your error)
  autoTable(doc, { head: [], body: [] });

  // === HEADER ===
  const pageWidth = doc.internal.pageSize.getWidth();
  const title = "Billing Statement";
  const textWidth = doc.getTextWidth(title);
  const x = (pageWidth - textWidth) / 2;
  let y = 20;

  doc.setFillColor(25, 65, 126);
  doc.rect(x - 4, y - 7, textWidth + 8, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.text(title, pageWidth / 2, y, { align: "center" });
  doc.setTextColor(0, 0, 0);
  y += 25;

  const userData = billing[0].user;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.text("Name:", 14, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(`${userData.first_name} ${userData.middle_name} ${userData.last_name}`, 30, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.text("Email:", 14, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12) 
  doc.text(`${userData.email}`, 30, y);
  y += 10;

  const tableData = billing.map((bill, index) => [
  `${index + 1}`,
  `${bill.unit.unit_name}`,
  `${formatDateToHumanReadable(bill.created_at)}`,
  `${formatDateToHumanReadable(bill.due_date)}`,
  `PHP  ${bill.unit.rent_amount.toLocaleString()}`,
  `PHP1,000`,
  `PHP1,000`,
  `PHP1,000`,
  `PHP${(Number(bill.amount_due) + 3000).toLocaleString()}`,
  ]);

  autoTable(doc, {
    startY: y,
    head: [
      [
        "#",
        "Unit",
        "Generated On",
        "Due Date",
        "Rent",
        "Security",
        "Maintenance",
        "Amenities",
        "Amount Due",
      ],
    ],
    body: tableData,
    styles: { fontSize: 9, cellPadding: 3, halign: "center", valign: "middle" },
    headStyles: { fillColor: [25, 65, 126], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 240, 240] },
  });

  const totalAmount = billing.reduce((acc, b) => acc + parseFloat(b.amount_due) + 3000, 0);
  const finalY = (doc as any).lastAutoTable.finalY + 10;

  doc.setFont("helvetica", "bold"); 
  doc.text(`Total Amount Due: PHP ${totalAmount.toLocaleString()}`, 14, finalY);

  doc.save("Billing_Statement.pdf");
};

  return (
    <Container className="pt-5 d-flex overflow-auto flex-column gap-2">
      {/* Header */}
      <Header path={'resident'}>
        <div className="d-flex gap-3">
          <h3 className='fw-bold'>Billings</h3>
        </div>
      </Header>
      
      {/* Search + Download */}
      <Search sortByPaymentStatusOptions={true} onSearch={(value) => setSearch(value)} onStatusChange={(value) => setStatus(value)}>
        <div className="align-self-start">
          <Button
            onClick={printBilling}
            className="text-decoration-none border-0 text-black px-5 py-3 rounded-3 fw-bold"
            style={{ backgroundColor: "#CED4F5" }}
          >
            Download Bill
          </Button>
        </div>
      </Search>

      {/* Billing List Table */}
      <BillingListTable bills={paginatedBill?.results} />
       <div>
        <section className="d-flex justify-content-start align-items-center gap-2">
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={pageNumber === 1} onClick={() => prevButton(paginatedBill?.previous ?? '')}>Prev</button>
          <div>{pageNumber}</div>
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={paginatedBill?.next === null} onClick={() => nextButton(paginatedBill?.next ?? '')}>Next</button>
        </section>
      </div>

      {/* Error Toast */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg="danger"
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto text-danger">⚠️ Error</strong>
          </Toast.Header>
          <Toast.Body className="text-white">
            No billing data available to download.
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
}

export default Billings;
