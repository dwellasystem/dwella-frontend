import { Container } from "react-bootstrap"
import Header from "../../components/Header"
import Search from "../../components/Search"
import CreateUnitModal from "../../components/admin/CreateUnitModal"
import { useMemo, useState } from "react"
import UnitListTable from "../../components/admin/tables/UnitListTable"
import { usePaginatedUnits } from "../../hooks/unit/usePaginatedUnit"

export type UnitType = {
    unit_name: string;
    rent_amount: number;
    building: string;
    floor_area: number;
    bedrooms: number;
}

const initialUnitFormState: UnitType = {
  unit_name: '',
  rent_amount: 0,
  building: '',
  floor_area: 0,
  bedrooms: 0,
};

function Units() {
  const [formData, setFormData] = useState<UnitType>(initialUnitFormState);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('');
  const filters = useMemo(() => {
    return {
      search: search,
      isAvailable: order,
      ordering: orderBy === '-unit__building' ? '-building' : 'building'
    }
  },[search, order, orderBy])
  const {paginatedUnits, createNewUnit, deleteUnit, updateUnit, pageNumber, nextButton, prevButton} = usePaginatedUnits(filters);

  const handleSubmit = async (data: UnitType) => {
      try{
        await createNewUnit(data);
        setFormData(initialUnitFormState)
      }catch(error: any){
        console.error(error.data)
    }
  }
  
  return (
    <Container className="vh-100 pt-sm-5 d-flex overflow-auto flex-column">
    
      {/* Header component */}
      <Header path={'admin'}>
        <div className="d-flex gap-3">
            <h3 className='fw-bold'>Units</h3>
        </div>
      </Header>
      
      {/* Search engine component with Add resident button*/}
      <Search sortByBuilding={true} sortByAvailableUnits={true} onSearch={(value) => setSearch(value)} onStatusChange={(value) => setOrder(value)} onOrderChange={(value) => setOrderBy(value)}>
        {/* <AssignedUnitModal formData={formData} setFormData={setFormData} onSubmit={handleSubmit}/> */}
        <CreateUnitModal formData={formData} setFormData={setFormData} onSubmit={handleSubmit}/>
      </Search>

      {/* Unit list table */}
      <UnitListTable units={paginatedUnits?.results} updateUnit={updateUnit} deleteUnit={deleteUnit}/>
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