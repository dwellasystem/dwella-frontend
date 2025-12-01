import { Container } from "react-bootstrap"
import Header from "../../components/Header";
import { MdOutlineFileUpload } from "react-icons/md";
import { useNavigate } from "@tanstack/react-router";
import FinancialHistoryTable from "../../components/resident/tables/FinancialHistoryTable";
import Search from "../../components/Search";
import { useMemo, useState } from "react";
import { useAuth } from "../../contexts/auth/AuthContext";
import { usePayments } from "../../hooks/payments/usePayments";


function Financials() {
  const navigate = useNavigate();
  const {user} = useAuth();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const filtersPayments = useMemo(() => {
    return {
      user: user?.id,
      role: 'resident',
      search: search,
      status: status
    }
  }, [search, status]);

  const {payments, nextButton, prevButton, pageNumber} = usePayments(filtersPayments);

  
  // const downloadFinancial = (payments: any) => {
  //   console.log(payments)
  // }

  return (
    <Container className="pt-5 d-flex overflow-auto flex-column gap-2">
      
      {/* Header component*/}
      <Header path={'resident'}>
        <div className="d-flex gap-3">
            <div onClick={() => navigate({to: '/resident/upload-payment'})} 
                className="d-flex align-items-center gap-2 p-3 rounded-3" 
                style={{backgroundColor: "#344CB7", cursor: "pointer"}}
                >
                <MdOutlineFileUpload size={25} color="white"/>
                <a className="text-decoration-none text-light fw-bold">Upload Payment</a>
            </div>
        </div>
      </Header>
      
      {/* Search engine component with history button to navigate to full history*/}
      <Search sortByPaymentStatus={true} onSearch={(value) => setSearch(value)} onOrderChange={(value) => setStatus(value)}>
        <div className="align-self-start">
            {/* <Link to='/resident' className="text-decoration-none text-black px-5 py-3 rounded-3 fw-bold" style={{backgroundColor:"#CED4F5"}}>History</Link> */}
            {/* <Button onClick={() => downloadFinancial(payments?.results)} className="text-decoration-none border-0 text-black px-5 py-3 rounded-3 fw-bold" style={{backgroundColor:"#CED4F5"}}>Download</Button> */}
        </div>
      </Search>

      {/* Financial history list */}
      <FinancialHistoryTable payments={payments?.results}/>
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

export default Financials;