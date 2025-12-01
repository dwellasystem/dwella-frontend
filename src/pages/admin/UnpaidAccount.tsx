import { Container } from "react-bootstrap"
import Header from "../../components/Header"
import Search from "../../components/Search"
import { IoMdAdd } from "react-icons/io"
import UnpaidAccountTable from "../../components/admin/tables/UnpaidAccountTable"
import { useMonthlyBill } from "../../hooks/monthly-bills/useMonthlyBill"
import { useMemo, useState } from "react"
import { useAuth } from "../../contexts/auth/AuthContext"

function UnpaidAccount() {
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("");

  const {role} = useAuth();

  const filters = useMemo(() => {
    return {
      search: search,
      ordering: orderBy,
    }
  }, [search, orderBy]);

  const {monthlyBill, deleteMonthlyBill, prevButton, nextButton, pageNumber} = useMonthlyBill(filters);

  const deleteBill = async (id: number) => {
    await deleteMonthlyBill(id.toString());
    return
  }

  return (
    <Container className="vh-100 pt-sm-5 d-flex overflow-auto flex-column">

      {/* Header component */}
      <Header path={'admin'}>
        <div className="d-flex gap-3">
            <h3 className='fw-bold'>Monthly Bill</h3>
        </div>
      </Header>
      
      {/* Search engine component with Add resident button*/}
      <Search sortByBuilding={true} sortByAmountDueOptions={true} sortByPaymentStatusOptions={true} onSearch={(value) => setSearch(value)} onOrderChange={(value) => setOrderBy(value)} onStatusChange={(value) => setSearch(value)}>
        <div className="align-self-start">
            <a href={`/${role}/monthly-bill/create`} className="text-decoration-none d-flex align-items-center gap-3 text-light px-4 py-3 rounded-3 fw-bold" style={{backgroundColor:"#344CB7"}}>
                <IoMdAdd size={25}/>
                Create
            </a>
        </div>
      </Search>

      {/* Unpaid accounts list table */}
      <UnpaidAccountTable unpaidAccounts={monthlyBill?.results} deleteBill={deleteBill}/>
      <div>
        <section className="d-flex justify-content-start align-items-center gap-2">
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={pageNumber === 1} onClick={() => prevButton(monthlyBill?.previous ?? '')}>Prev</button>
          <div>{pageNumber}</div>
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={monthlyBill?.next === null} onClick={() => nextButton(monthlyBill?.next ?? '')}>Next</button>
        </section>
      </div>

    </Container>
  )
}

export default UnpaidAccount