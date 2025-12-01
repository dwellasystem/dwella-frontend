import { Container } from "react-bootstrap"
import Header from "../../components/Header"
import Search from "../../components/Search"
import { useMemo, useState } from "react"
import { useOwnedUnit } from "../../hooks/assigned-unit/useOwnedUnit"
import AssignedUnitModal from "../../components/admin/AssignedUnitModal"
import AssignedUnitListTable from "../../components/admin/tables/AssignedUnitListTable"

export type UnitFormData = {
  unit: string;
  building: string;
  user_id: string;
  move_in_date: string;
  unit_status: string;
};

const initialUnitFormState: UnitFormData = {
  unit: '',
  building: '',
  move_in_date: '',
  user_id: '',
  unit_status: '',
};

function AssignedUnits() {
  const [search, setSearch] = useState('');
  const [order, setOrder] = useState('');
  const filters = useMemo(() => {
    return {
      search: search,
      ordering: order ? (order === '-unit__building' ? '-unit_id__building' : 'unit_id__building'):'',
    }
  },[search, order])
  const [formData, setFormData] = useState<UnitFormData>(initialUnitFormState);
  const {ownedUnit, assignedToUnit, nextButton, prevButton, pageNumber, updateUnit, deleteAssignedUnit} = useOwnedUnit(filters);

   const handleSubmit = async (data: UnitFormData) => {
    try{
      const fData = {...data, user_id: Number(data.user_id), unit: Number(data.unit)}
      await assignedToUnit(fData);
      // console.log(fData)
      setFormData(initialUnitFormState)
      // ✅ here you could POST to backend or update state
    }catch(error: any){
      console.error(error.data['unit_id'][0])
    }
  };
  
  return (
    <Container className="vh-100 pt-sm-5 d-flex overflow-auto flex-column">
    
      {/* Header component */}
      <Header path={'admin'}>
        <div className="d-flex gap-3">
            <h3 className='fw-bold'>Assigned Units</h3>
        </div>
      </Header>
      
      {/* Search engine component with Add resident button*/}
      <Search sortByBuilding={true} onSearch={(value) => setSearch(value)} onStatusChange={(value) => setSearch(value)} onOrderChange={(value) => setOrder(value)} sortByAssignedUnits={true}>
        <AssignedUnitModal formData={formData} setFormData={setFormData} onSubmit={handleSubmit}/>
      </Search>

      {/* Unpaid accounts list table */}
      <AssignedUnitListTable units={ownedUnit?.results} updateUnit={updateUnit} deleteAssignedUnit={deleteAssignedUnit}/>
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

export default AssignedUnits