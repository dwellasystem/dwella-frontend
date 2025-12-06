// pages/admin/Dashboard.tsx
import Header from "../../components/Header";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
// import Cards from "../../components/resident/cards/Cards";
// import useBillSummary from "../../hooks/monthly-bills/useBillSummary";
// import useUserSummary from "../../hooks/user/useUserSummary";
// import useBillStats from "../../hooks/monthly-bills/useBillStats";
// import BarGraph from "../../components/BarGraph";
// import PieChartGraph from "../../components/PieChartGraph";
// import UnitStatusChart from "../../components/UnitStatusChart";
// import useUnitStatusSummary from "../../hooks/assigned-unit/useUnitStatusSummary";
import OverdueListTable from "../../components/admin/tables/OverdueListTable";
import { useMemo, useState, useEffect } from "react";
import useBilling from "../../hooks/payments/useBilling";

// Import new expense reflection components
import useExpenseReflection from "../../hooks/expense-reflection/useExpenseReflection";


import ExpenseCards from "../../components/admin/ExpenseCards";
import ExpensePieChart from "../../components/admin/ExpensePieChart";
import ExpenseBarChart from "../../components/admin/ExpenseBarChart";
import MonthlyTrendChart from "../../components/admin/MonthlyTrendChart";
import BuildingSelector from "../../components/admin/BuildingSelector";

function Dashboard() {
  const filters = useMemo(() => {
    return {
      search: 'overdue'
    }
  }, []);

  const {billing: overdues} = useBilling(filters);
  // const { billSummary } = useBillSummary();
  // const { userSummary } = useUserSummary();
  // const { billStats } = useBillStats();
  // const { statusSummary } = useUnitStatusSummary();

  // State for expense reflection filters
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string | null>(new Date().getFullYear().toString());
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Use the expense reflection hook
  const { 
    expenseData, 
    yearlyData, 
    monthlyData, 
    loading, 
    error,
    fetchMonthlyData 
  } = useExpenseReflection(selectedBuilding, selectedYear, selectedMonth);

  // Handle year change
  const handleYearChange = (year: string | null) => {
    setSelectedYear(year);
    if (year) {
      fetchMonthlyData(parseInt(year));
    }
  };

  // Hardcoded buildings (you should fetch these from API)
  const [buildings] = useState<string[]>(['A', 
                                                        'B', 
                                                        'C',
                                                        'D',
                                                        'E',
                                                        'F',
                                                        'G',
                                                        'H',
                                                        'I',
                                                        'J',
                                                        'K',
                                                        'L',
                                                        'M',
                                                        'N',
                                                        'O',
                                                        'P',
                                                        'Q',
                                                        'R',
                                                        'S',
                                                        'T',
                                                        'U',
                                                        'V',
                                                        'W',
                                                        'X',
                                                        'Y',
                                                        'Z',
                                                      ]);

  useEffect(() => {
    // You can fetch buildings from API here
    // Example: api.get('/units/buildings/').then(response => setBuildings(response.data.buildings));
  }, []);

  const formatCurrency = (amount: string | number | undefined): string => {
    if (!amount) return '₱0.00';
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const calculateCollectionRate = (): number => {
    if (!expenseData || !expenseData.totalPaid || !expenseData.total_all_bills) return 0;
    const paid = typeof expenseData.totalPaid === 'string' ? parseFloat(expenseData.totalPaid) : expenseData.totalPaid;
    const total = typeof expenseData.total_all_bills === 'string' ? parseFloat(expenseData.total_all_bills) : expenseData.total_all_bills;
    return total > 0 ? (paid / total) * 100 : 0;
  };

  // const calculateCategorizedPercentage = (): number => {
  //   if (!expenseData?.summary?.categorized_percentage) return 0;
  //   return expenseData.summary.categorized_percentage;
  // };

  return (
    <Container className="pt-5 d-flex flex-column overflow-auto">
      {/* 🧭 Header */}
      <Header path="admin">
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="fw-bold mb-0">📊 Dashboard Overview</h3>
        </div>
      </Header>

      {/* 🏢 Expense Reflection Section */}
      <section className="pt-4">
        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h5 className="fw-bold mb-0">💰 Expense Reflection</h5>
              {/* <small className="text-muted">
                {expenseData?.calculation_note || "Categorized expenses only"}
              </small> */}
            </div>
            
            {/* Loading state */}
            {loading && (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading expense data...</p>
              </div>
            )}

            {/* Error state */}
            {error && (
              <Alert variant="danger" className="mb-4">
                <Alert.Heading>Error Loading Expense Data</Alert.Heading>
                <p>{error}</p>
              </Alert>
            )}

            {/* Building Selector */}
            {!loading && !error && expenseData && (
              <>
                <BuildingSelector
                  buildings={buildings}
                  selectedBuilding={selectedBuilding}
                  setSelectedBuilding={setSelectedBuilding}
                  selectedYear={selectedYear}
                  setSelectedYear={handleYearChange}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                />

                {/* Expense Cards */}
                <div className="mb-4">
                  <ExpenseCards 
                    expenseData={expenseData} 
                    buildingFilter={selectedBuilding || 'All Buildings'}
                  />
                </div>

                {/* Charts Row */}
                <Row className="g-4">
                  <Col lg={4}>
                    <ExpensePieChart expenseData={expenseData} />
                  </Col>
                  <Col lg={8}>
                    <Row className="g-4">
                      <Col md={12}>
                        <ExpenseBarChart yearlyData={yearlyData} />
                      </Col>
                      {selectedYear && (
                        <Col md={12}>
                          <MonthlyTrendChart monthlyData={monthlyData} />
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>

                {/* Summary Stats */}
                {expenseData && (
                  <Card className="mt-4 border-0" style={{ backgroundColor: '#f8f9fa' }}>
                    <Card.Body>
                      <Row className="text-center">
                        <Col md={3}>
                          <h6 className="text-muted mb-1">Collection Rate</h6>
                          <h4 className="fw-bold mb-0" style={{ color: calculateCollectionRate() >= 70 ? '#28a745' : calculateCollectionRate() >= 50 ? '#ffc107' : '#dc3545' }}>
                            {calculateCollectionRate().toFixed(1)}%
                          </h4>
                          <small className="text-muted">
                            {calculateCollectionRate() >= 70 ? 'Good' : calculateCollectionRate() >= 50 ? 'Average' : 'Needs Attention'}
                          </small>
                        </Col>
                        <Col md={3}>
                          <h6 className="text-muted mb-1">Total Paid</h6>
                          <h4 className="fw-bold mb-0">
                            {formatCurrency(expenseData.totalPaid)}
                          </h4>
                          <small className="text-muted">
                            {(Number(expenseData.totalPaid) / Number(expenseData.total_all_bills) * 100).toFixed(2) || '0'}% of total
                          </small>
                        </Col>
                        <Col md={3}>
                          <h6 className="text-muted mb-1">Total Bills</h6>
                          <h4 className="fw-bold mb-0">
                            {formatCurrency(expenseData.total_all_bills)}
                          </h4>
                          <small className="text-muted">
                            All monthly bill amounts
                          </small>
                        </Col>
                       <Col md={3}>
                          <h6 className="text-muted mb-1">Total Unpaid</h6>
                          <h4 className="fw-bold mb-0">
                            {formatCurrency(expenseData.totalUnpaid)}
                          </h4>
                          <small className="text-muted">
                            {(Number(expenseData.totalUnpaid) / Number(expenseData.total_all_bills) * 100).toFixed(2) || '0'}% of total
                          </small>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </section>

      {/* 🟩 Summary Cards (only essential) */}
      {/* <section className="pt-4">
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
      </section> */}

      {/* 🟦 Original Graphs Section */}
      {/* <section className="pt-4">
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
      </section> */}

      {/* 🏠 Occupancy Chart */}
      {/* <section className="pt-4">
        <Card className="shadow-sm border-0 p-3">
          <h5 className="fw-bold mb-3">🏠 Residents by Unit Type</h5>
          <div style={{ height: "300px" }}>
            <UnitStatusChart statusSummary={statusSummary} />
          </div>
        </Card>
      </section> */}

      {/* 📋 Overdues Table */}
      <section className="mt-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4 className="fw-bold mb-0">📋 Overdue Accounts</h4>
          <small className="text-muted">
            Total: {overdues?.length || 0} accounts
          </small>
        </div>
        <OverdueListTable overdues={overdues ?? []}/>
        
        {(!overdues || overdues.length === 0) && (
          <Card className="text-center py-5 border-0 shadow-sm">
            <Card.Body>
              <h5 className="text-muted mb-3">🎉 No Overdue Accounts!</h5>
              <p className="text-muted mb-0">All bills are up to date</p>
            </Card.Body>
          </Card>
        )}
      </section>
    </Container>
  );
}

export default Dashboard;