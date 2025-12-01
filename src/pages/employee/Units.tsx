import { useMemo, useState } from 'react'
import { Container } from 'react-bootstrap'
import Header from '../../components/Header'
import Search from '../../components/Search'
import { usePaginatedUnits } from '../../hooks/unit/usePaginatedUnit';
import UnitListTable from '../../components/employee/tables/UnitListTable';

function Units() {
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('');

  const filters = useMemo(() => {
      return {
        search: search,
        isAvailable: order
      }
    },[search, order]);

  const {paginatedUnits, deleteUnit, pageNumber, updateUnit, nextButton, prevButton} = usePaginatedUnits(filters);
  return (
    <Container className="vh-100 pt-sm-5 d-flex overflow-auto flex-column">
    
      {/* Header component */}
      <Header path={'employee'}>
        <div className="d-flex gap-3">
            <h3 className='fw-bold'>Units</h3>
        </div>
      </Header>
      
      {/* Search engine component with Add resident button*/}
      <Search sortByAvailableUnits={true} onSearch={(value) => setSearch(value)} onStatusChange={(value) => setOrder(value)}>
      </Search>

      {/* Unit list table */}
      <UnitListTable units={paginatedUnits?.results} deleteUnit={deleteUnit} updateUnit={updateUnit}/>
      <div>
        <section className="d-flex justify-content-start align-items-center gap-2">
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={pageNumber === 1} onClick={() => prevButton(paginatedUnits?.previous ?? '')}>Prev</button>
          <div>{pageNumber}</div>
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={paginatedUnits?.next === null} onClick={() => nextButton(paginatedUnits?.next ?? '')}>Next</button>
        </section>
      </div>
    </Container>
  )
}

export default Units