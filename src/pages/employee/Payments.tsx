import { Container } from "react-bootstrap"
import Header from "../../components/Header"
import { IoMdAdd } from "react-icons/io"
import Search from "../../components/Search"
import PaymentsTable from "../../components/employee/tables/PaymentsTable"
import { usePayments } from "../../hooks/payments/usePayments"
import { useMemo, useState } from "react"

function Payments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState("");
    // ✅ Memoize filters so they only change when values actually change
  const filters = useMemo(() => {
    return { search: searchTerm, ordering: orderBy };
  }, [searchTerm, orderBy]);


  const {payments,deletePayment, updatePayment,pageNumber, prevButton, nextButton} = usePayments(filters);


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
    <Container className="pt-5 d-flex overflow-auto flex-column vh-100">

      {/* Header component */}
      <Header path={'admin'}>
        <a href='/employee/payments/record-payment' className="text-decoration-none text-white px-4 py-3 rounded-3 d-flex align-items-center gap-2" style={{backgroundColor:"#344CB7"}}>
            <IoMdAdd size={25}/>
            <p className='fw-bold text-center m-auto'>Record Payment</p>
        </a>
      </Header>

      {/* Search engine component with history button to navigate to full history*/}
      <Search sortByDateOptions={true} sortByAmountOptions={true} onSearch={(value) => setSearchTerm(value)} onOrderChange={(order) => setOrderBy(order)}>
        {/* <div className="align-self-start">
            <Button className="text-decoration-none border-0 text-black px-5 py-3 rounded-3 fw-bold" style={{backgroundColor:"#CED4F5"}}>Download</Button>
        </div> */}
      </Search>

      <PaymentsTable payments={payments?.results} onUpdate={handleUpdatePayment} onDelete={handleDeletePayment}  />
      <div>
        <section className="d-flex justify-content-start align-items-center gap-2">
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={pageNumber === 1} onClick={() => prevButton(payments?.previous ?? '')}>Prev</button>
          <div>{pageNumber}</div>
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={payments?.next === null} onClick={() => nextButton(payments?.next ?? '')}>Next</button>
        </section>
      </div>
    </Container>
  )
}

export default Payments