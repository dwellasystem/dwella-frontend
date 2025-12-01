import { Container } from 'react-bootstrap'
import Header from '../../components/Header'
import Search from '../../components/Search'
import { IoMdAdd } from 'react-icons/io'
import ResidentListTable from '../../components/admin/tables/ResidentListTable'
import { useGetUsers } from '../../hooks/user/useGetUsers'
import { useMemo, useState } from 'react'

function Resident() {

    const [searchTerm, setSearchTerm] = useState("");
    const [orderBy, setOrderBy] = useState("");

    // ✅ Memoize filters — prevents infinite fetching
    const filters = useMemo(() => {
      return { 
        role: "resident",
        search: searchTerm,
        ordering: orderBy,
      }
    }, [searchTerm, orderBy]);

    const {users, loading, error, nextButton, prevButton, pageNumber, deleteUser} = useGetUsers(filters);

    if (loading) return <p>Loading users...</p>;
    if (error) return <p>Error: {error}</p>;

    const deleteResident = async(id: number) => {
      await deleteUser(id);
    }

  return (
    <Container fluid="sm" className="pt-sm-5 d-flex overflow-auto flex-column">

      {/* Header component */}
      <Header path={'admin'}>
        <div className="d-flex gap-3">
            <h3 className='fw-bold'>Residents</h3>
        </div>
      </Header>
      
      {/* Search engine component with Add resident button*/}
      <Search sortByMoveInDateOptions={true} onSearch={(value) => setSearchTerm(value)} onOrderChange={(order) => setOrderBy(order)}>
        <div className="align-self-start">
            <a href='/admin/resident/add-resident' className="text-decoration-none d-flex align-items-center gap-3 text-light px-4 py-3 rounded-3 fw-bold" style={{backgroundColor:"#344CB7"}}>
                <IoMdAdd size={25}/>
                Add Resident
            </a>
        </div>
      </Search>
      
      {/* Resident Table list*/}
      <ResidentListTable users={users?.results} deleteResident={deleteResident}/>
      <div>
        <section className="d-flex justify-content-start align-items-center gap-2">
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={pageNumber === 1} onClick={() => prevButton(users?.previous ?? '')}>Prev</button>
          <div>{pageNumber}</div>
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={users?.next === null} onClick={() => nextButton(users?.next ?? '')}>Next</button>
        </section>
      </div>

    </Container>
  )
}

export default Resident