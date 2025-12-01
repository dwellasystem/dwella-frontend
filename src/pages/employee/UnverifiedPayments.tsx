import { Container } from "react-bootstrap"
import Header from "../../components/Header"
import { FaAngleRight } from "react-icons/fa6"
import { usePayments } from "../../hooks/payments/usePayments";
import PaymentsTable from "../../components/employee/tables/PaymentsTable";

function UnverifiedPayments() {
  const {payments,deletePayment, updatePayment} = usePayments({status: "pending"});

  const handleUpdatePayment = (id: number, newStatus: string) => {
    updatePayment(id.toString(), {status: newStatus});
  };

   // ✅ callback for deleting a payment
  const handleDeletePayment = (id: number) => {
    deletePayment(id.toString());
    return
    // setPaymentList(prev => prev.filter(payment => payment.id !== id));
  };

  return (
    <Container className="pt-5 d-flex overflow-auto flex-column">
      {/* Header page */}
      <Header path={'employee'}>
        <div className="d-flex">
            <h3 className='fw-bold'>Pending Payments</h3>
        </div>
      </Header>

      <div className='d-flex align-items-center gap-1 pt-5 mb-3'>
        <span className='text-muted fw-bold d-flex align-items-center'>Dashboard</span>
            <FaAngleRight size={12}/>
        <span className='text-dark fw-bold d-flex align-items-center'>Pending Payments</span>
      </div>

      <PaymentsTable payments={payments?.results} onUpdate={handleUpdatePayment} onDelete={handleDeletePayment}  />
      {/* <UnverifiedPaymentsTable/> */}
    </Container>
  )
}

export default UnverifiedPayments