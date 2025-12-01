import { Container } from "react-bootstrap"
import Header from "../../components/Header"
import Search from "../../components/Search"
import MyUnitsTable from "../../components/resident/tables/MyUnitsTable"
import { useAuth } from "../../contexts/auth/AuthContext"
import { useMemo, useState } from "react"
import { useOwnedUnit } from "../../hooks/assigned-unit/useOwnedUnit"

function MyUnits() {
  const {user} = useAuth();
  const [search, setSearch] = useState('');

  const filterMyUnits = useMemo(() => {
    return {
      assigned_by: user?.id,
      search: search
    }
  }, [user?.id, search])

  const {ownedUnit, updateUnit, pageNumber, nextButton, prevButton} = useOwnedUnit(filterMyUnits);

  return (
    <Container className="pt-5 w-full h-100 d-flex overflow-auto flex-column gap-5">
        {/* Header page */}
       <Header path={'resident'}>
        <div className="d-flex gap-3">
            <h3 className='fw-bold'>My Units</h3>
        </div>
      </Header>
            {/* Search engine component*/}
      <Search onSearch={(value) => setSearch(value)}/>

      {/* Component table for list of notices */}
      {/* <NoticeTable notices={notices?.results}/> */}
      <MyUnitsTable units={ownedUnit?.results} updateUnit={updateUnit}/>
      <div>
        <section className="d-flex justify-content-start align-items-center gap-2">
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={pageNumber === 1} onClick={() => prevButton(ownedUnit?.previous ?? '')}>Prev</button>
          <div>{pageNumber}</div>
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={ownedUnit?.next === null} onClick={() => nextButton(ownedUnit?.next ?? '')}>Next</button>
        </section>
      </div>
    </Container>
  )
}

export default MyUnits