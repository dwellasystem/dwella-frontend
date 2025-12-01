import { Col, Container, Row } from "react-bootstrap"
import Header from "../../components/Header"
import Card from "../../components/employee/cards/Card"
import { PaymentService } from "../../services/payment.service"
import { useEffect, useState } from "react";
import InquiryService from "../../services/inquiries.service";
// import useBillSummary from "../../hooks/monthly-bills/useBillSummary";
// import useUserSummary from "../../hooks/user/useUserSummary";
import useBillStats from "../../hooks/monthly-bills/useBillStats";
import BarGraph from "../../components/BarGraph";
import { useOverdues } from "../../hooks/payments/useOverdues";

function Dashboard() {
  const {totalPendingPayments} = PaymentService();
  const {totalOpenInquiries} = InquiryService();

  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [openCount, setOpenCount] = useState<number | null>(null);

  // const {billSummary} = useBillSummary();
  // const {userSummary} = useUserSummary();
  const {overdues} = useOverdues();
  const {billStats} = useBillStats();

  const fetchPendingPayments = async () => {
    try {
      const response = await totalPendingPayments(); // ✅ wait for API
      setPendingCount(response.data.pending); // ✅ set state
    } catch (error) {
      console.error("Error fetching pending payments:", error);
    }
  };

  const fetchOpenInquiries = async () => {
    try {
      const response = await totalOpenInquiries(); // ✅ wait for API
      setOpenCount(response.data.open); // ✅ set state
    } catch (error) {
      console.error("Error fetching pending payments:", error);
    }
  };

  useEffect(() => {
    fetchPendingPayments();
    fetchOpenInquiries();
  }, []);

  return (
    <Container className="pt-3 d-flex overflow-auto flex-column overflow-x-hidden">

      {/* Header page */}
      <Header path={'employee'}>
        <div className="d-flex">
            <h3 className='fw-bold'>Dashboard</h3>
        </div>
      </Header>

      <div className="w-100" style={{height: '300px'}}>
          <BarGraph billStats={billStats}/>
      </div>

      {/* Cards info */}
      <Row className="d-flex flex-column gy-3 flex-md-row pt-md-5">
        <Col xs={12} md={6}>
            <Card title="Overdue Accounts" quantity={overdues?.length} path="/employee/over-due-accounts"/>
        </Col>
        <Col xs={12} md={6}>
            <Card title="Pending Payments" quantity={pendingCount!} path="/employee/unverified-payments"/>
        </Col>
        {/* <Col xs={12} md={6}>
            <Card title="Pending Notices" quantity="4" path="/employee/pending-notices"/>
        </Col> */}
        <Col xs={12} md={6}>
            <Card title="Open Inquries" quantity={openCount!} path="/employee/open-inquiries"/>
        </Col>
      </Row>


      {/* <Row className="mt-3 pb-3">
        <h4 className="fw-bold">Today's Task</h4>
        <div className="overflow-auto">
          <Table responsive={"sm"} className='table-bordered'>
            <thead>
              <tr className="text-nowrap">
                <th style={{backgroundColor:"#F2F2F7"}}>Task</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Due Time/Date</th>
                <th style={{backgroundColor:"#F2F2F7"}}>Priority</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-nowrap">
                <td>Follow up with Unit 2B on overdue payment</td>
                <td>April 28</td>
                <td>High</td>
              </tr>
              <tr className="text-nowrap">
                <td>Review May Maintenance Notice</td>
                <td>April 28</td>
                <td>Medium</td>
              </tr>
              <tr className="text-nowrap">
                <td>Verify payment for Unit 4C</td>
                <td>April 28</td>
                <td>High</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Row> */}

    </Container>
  )
}

export default Dashboard