import { Container } from "react-bootstrap"
import Header from "../../components/Header";
import AnnouncementsTable from "../../components/resident/tables/AnnouncementsTable";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { useNavigate } from "@tanstack/react-router";
import PaymentHistoryTable from "../../components/resident/tables/PaymentHistoryTable";
import { useAuth } from "../../contexts/auth/AuthContext";
import { useNotices } from "../../hooks/notices/useNotices";
import { useMemo, useState } from "react";
import { usePayments } from "../../hooks/payments/usePayments";
import type { NoticeDetail } from "../../models/Notice.model";
import NoticeModalView from "../../components/resident/NoticeModalView";
import useUsersYearlySummary from "../../hooks/monthly-bills/useUsersYearlySummary";
import MixedPieChart from "../../components/MixedPieChart";
import UserDataView from "./UserDataView";

function Dashboard() {
  const { user } = useAuth();
  const { notices } = useNotices(user?.id);
  const [show, setShow] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<NoticeDetail | null>(null);
  const navigate = useNavigate();

  const filter = useMemo(() => {
    if (!user?.id) return {};
    return {
      user: user?.id
    }
  },[ user?.id])

  const { payments } = usePayments(filter);

  //   // Filter payments client-side
  // const filteredPayments = useMemo(() => {
  //   if (!payments?.results || !user?.id) return payments;
    
  //   const filteredResults = payments.results.filter(
  //     payment => payment.user.id === user.id
  //   );
    
  //   return {
  //     ...payments,
  //     results: filteredResults,
  //     count: filteredResults.length
  //   };
  // }, [payments, user?.id]);
  
  const { summary } = useUsersYearlySummary(user?.id);

  const handleClose = () => setShow(false);
  const handleShow = (notice: NoticeDetail) => {
    setSelectedNotice(notice);
    setShow(true);
  };

  // Extract data for cards and chart
  // const pendingDues = summary?.summary.total_unpaid || 0;
  // const totalPaid = summary?.summary.total_paid || 0;
  // const yearExpectedPayment = summary?.summary.expected_yearly_total || 0;
  
  return (
    <Container className="pt-5 w-full h-100 d-flex overflow-auto flex-column gap-5">
      {/* Header page */}
      <Header path={'resident'}>
        <div className="d-flex gap-3">
          <div 
            onClick={() => navigate({ to: '/resident/upload-payment' })}
            className="d-flex align-items-center gap-2 p-3 rounded-3"
            style={{ backgroundColor: "#344CB7", cursor: "pointer" }}
          >
            <MdOutlineAccountBalanceWallet size={25} color="white"/>
            <a className="text-decoration-none text-light fw-bold">Pay Now</a>
          </div>
          <UserDataView/>
        </div>
      </Header>

      {/* {summary && <PaymentBreakdownChart data={summary} />} */}

      {summary && (
        <MixedPieChart 
          unitBreakdown={summary.unit_breakdown}
          summary={summary.summary}
          monthlyBreakdown={summary.monthly_breakdown}
          breakdown={summary.breakdown_percentages}
        />
      )}
      
      {/* Cards info */}
      {/* <div className="d-flex gap-3 flex-column flex-md-row">
        <Cards 
          heading="Pending Dues" 
          description={`₱${pendingDues.toLocaleString()}`} 
        />
         <Cards 
          heading="Total Paid" 
          description={`₱${totalPaid.toLocaleString()}`} 
        />
        <Cards 
          heading="Year Expected Payment" 
          description={`₱${yearExpectedPayment.toLocaleString()}`} 
        />
        <Cards 
          heading="Payment Completion Rate This Year" 
          description={summary ? `${summary.summary.completion_rate}%` : "0%"} 
        />
      </div> */}

      {/* Pie Chart - Now with the same style as UnitStatusChart */}
      {/* <div className="bg-white position-relative p-4 rounded-3 shadow-sm" style={{ height: "400px" }}>
        <h5 className="mb-3 fw-bold position-absolute top-10">Payment Overview</h5>
        <PaymentPieChart 
          totalPaid={totalPaid}
          totalUnpaid={pendingDues}
        />
      </div> */}

      {/* List of announcements */}
      <AnnouncementsTable handleShow={handleShow} notices={notices?.results}/>
      <PaymentHistoryTable payments={payments?.results}/>
      <NoticeModalView onHide={handleClose} onShow={show} selectedNotice={selectedNotice}/>
    </Container>
  );
}

export default Dashboard;