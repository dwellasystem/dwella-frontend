import Header from "../../components/Header";
import { Container, Row, Col, Card } from "react-bootstrap";
import Cards from "../../components/resident/cards/Cards";
import useBillSummary from "../../hooks/monthly-bills/useBillSummary";
import useUserSummary from "../../hooks/user/useUserSummary";
import useBillStats from "../../hooks/monthly-bills/useBillStats";
import BarGraph from "../../components/BarGraph";
import PieChartGraph from "../../components/PieChartGraph";
import UnitStatusChart from "../../components/UnitStatusChart";
import useUnitStatusSummary from "../../hooks/assigned-unit/useUnitStatusSummary";
import OverdueListTable from "../../components/admin/tables/OverdueListTable";
import { useMemo } from "react";
import useBilling from "../../hooks/payments/useBilling";

function Dashboard() {
  // const [order, setOrder] = useState("");
  const filters = useMemo(() => {
    return {
      search: 'overdue'
    }
  }, []);

  const {billing: overdues} = useBilling(filters);

  // const { payments, pageNumber, nextButton, prevButton } = usePayments(filters);
  const { billSummary } = useBillSummary();
  const { userSummary } = useUserSummary();
  const { billStats } = useBillStats();
  const { statusSummary } = useUnitStatusSummary();

  return (
    <Container className="pt-5 d-flex flex-column overflow-auto">
      {/* 🧭 Header */}
      <Header path="admin">
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="fw-bold mb-0">📊 Dashboard Overview</h3>
        </div>
      </Header>

      {/* 🟩 Summary Cards (only essential) */}
      <section className="pt-4">
        <Row className="g-3">
          <Col md={4}>
            <Cards
              heading="Total Residents"
              description={userSummary?.totalActiveResidents?.toString() || "0"}
            />
          </Col>
          <Col md={4}>
            <Cards
              heading="Overdue Accounts"
              description={billSummary?.all_overdue_bills?.toString() || "0"}
            />
          </Col>
          <Col md={4}>
            <Cards
              heading="Pending Bills"
              description={billSummary?.totalPending?.toString() || "0"}
            />
          </Col>
        </Row>
      </section>

      {/* 🟦 Graphs Section */}
      <section className="pt-4">
        <Card className="shadow-sm border-0 p-3">
          <h5 className="fw-bold mb-3">💰 Financial Overview</h5>
          <div
            className="d-flex flex-column flex-md-row gap-4"
            style={{ height: "320px" }}
          >
            <div className="flex-fill">
              <BarGraph billStats={billStats} />
            </div>
            <div className="flex-fill">
              <PieChartGraph billSummary={billSummary} />
            </div>
          </div>
        </Card>
      </section>

      {/* 🏠 Occupancy Chart */}
      <section className="pt-4">
        <Card className="shadow-sm border-0 p-3">
          <h5 className="fw-bold mb-3">🏠 Residents by Unit Type</h5>
          <div style={{ height: "300px" }}>
            <UnitStatusChart statusSummary={statusSummary} />
          </div>
        </Card>
      </section>

      <section className="mt-5">
        <h1>Overdues</h1>
        <OverdueListTable overdues={overdues ?? []}/>
      </section>

      {/* 💵 Payment History (plain table, no card) */}
      {/* <section>
        <PaymentHistoryTable payments={payments?.results} />

        <div className="d-flex justify-content-start gap-3 ms-2 align-items-center">
          <button
            className="btn fw-bold text-white"
            style={{ backgroundColor: "#344CB7" }}
            disabled={!payments?.previous}
            onClick={() => prevButton(payments?.previous ?? "")}
          >
            Prev
          </button>
          <div className="fw-bold">{pageNumber}</div>
          <button
            className="btn fw-bold text-white"
            style={{ backgroundColor: "#344CB7" }}
            disabled={!payments?.next}
            onClick={() => nextButton(payments?.next ?? "")}
          >
            Next
          </button>
        </div>
      </section> */}
    </Container>
  );
}

export default Dashboard;
