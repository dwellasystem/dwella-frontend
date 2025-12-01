import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";
import { Container, Form, Button, Table, Card } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Correct import

type FinancialData = {
  year: number;
  month: string;
  paid_count: number;
  pending_count: number;
  overdue_count: number;
  total_paid: number;
  total_pending: number;
};

const sampleData: FinancialData[] = [
  {
    year: 2025,
    month: "August",
    paid_count: 1,
    pending_count: 0,
    overdue_count: 0,
    total_paid: 18500.0,
    total_pending: 0,
  },
  {
    year: 2025,
    month: "September",
    paid_count: 1,
    pending_count: 0,
    overdue_count: 0,
    total_paid: 15000.0,
    total_pending: 0,
  },
  {
    year: 2025,
    month: "October",
    paid_count: 2,
    pending_count: 1,
    overdue_count: 0,
    total_paid: 30000.0,
    total_pending: 18500.0,
  },
];

export const Route = createFileRoute(
  '/_protected/resident/ResidentFinancialStatement',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const [query, setQuery] = useState("");
  const [selectedResident, setSelectedResident] = useState<string | null>(null);

  // ✅ Placeholder list of residents
  const residents = [
    "William Davis",
    "John Smith",
    "Maria Santos",
    "Angela Reyes",
  ];

  const filteredResidents = residents.filter((r) =>
    r.toLowerCase().includes(query.toLowerCase())
  );

  const handleDownloadPDF = () => {
    if (!selectedResident) return;

    const doc = new jsPDF();

    doc.setFont("helvetica", "normal"); // helvetica supports ₱ symbol in most systems
    const currentDate = new Date().toLocaleDateString();

    // ✅ Header
    doc.setFontSize(18);
    doc.text("Financial Statement", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Resident: ${selectedResident}`, 14, 35);
    doc.text(`Generated on: ${currentDate}`, 14, 43);

    // ✅ Prepare table data
    const tableData = sampleData.map((item) => [
      item.month,
      item.year.toString(),
      item.paid_count.toString(),
      item.pending_count.toString(),
      item.overdue_count.toString(),
      `PHP${item.total_paid.toLocaleString()}`,
      `PHP${item.total_pending.toLocaleString()}`,
    ]);

    // ✅ Add table
    autoTable(doc, {
      startY: 50,
      head: [[
        "Month",
        "Year",
        "Paid Count",
        "Pending Count",
        "Overdue Count",
        "Total Paid",
        "Total Pending",
      ]],
      body: tableData,
    });

    // ✅ Footer total
    const totalPaid = sampleData.reduce((sum, d) => sum + d.total_paid, 0);
    const totalPending = sampleData.reduce((sum, d) => sum + d.total_pending, 0);

    const finalY = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(12);
    doc.text(`Total Paid: ₱${totalPaid.toLocaleString()}`, 14, finalY);
    doc.text(`Total Pending: ₱${totalPending.toLocaleString()}`, 14, finalY + 8);

    doc.save(`${selectedResident}_Financial_Statement.pdf`);
  };

  return (
    <Container className="pt-5">
      <h3 className="fw-bold mb-4">📄 Resident Financial Statement</h3>

      {/* 🔍 Search Bar */}
      <Card className="p-3 shadow-sm border-0 mb-4">
        <Form.Control
          type="text"
          placeholder="Search resident by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <div className="border rounded mt-2 bg-white">
            {filteredResidents.map((r, index) => (
              <div
                key={index}
                className="p-2 border-bottom hover-bg-light"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedResident(r)}
              >
                {r}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* 🧍 Selected Resident + Table */}
      {selectedResident && (
        <Card className="p-3 shadow-sm border-0">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold mb-0">
              Financial Summary — {selectedResident}
            </h5>
            <Button
              variant="primary"
              className="fw-bold"
              onClick={handleDownloadPDF}
            >
              ⬇️ Download PDF
            </Button>
          </div>

          <Table bordered hover responsive className="align-middle">
            <thead className="table-light">
              <tr>
                <th>Month</th>
                <th>Year</th>
                <th>Paid Count</th>
                <th>Pending Count</th>
                <th>Overdue Count</th>
                <th>Total Paid</th>
                <th>Total Pending</th>
              </tr>
            </thead>
            <tbody>
              {sampleData.map((row, index) => (
                <tr key={index}>
                  <td>{row.month}</td>
                  <td>{row.year}</td>
                  <td>{row.paid_count}</td>
                  <td>{row.pending_count}</td>
                  <td>{row.overdue_count}</td>
                  <td>₱{row.total_paid.toLocaleString()}</td>
                  <td>₱{row.total_pending.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}
    </Container>
  );
}

export default RouteComponent;
