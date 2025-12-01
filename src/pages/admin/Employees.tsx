import { Container } from "react-bootstrap"
import Header from "../../components/Header"
import Search from "../../components/Search"
import { IoMdAdd } from "react-icons/io"
import EmployeeListTable from "../../components/admin/tables/EmployeeListTable"
import {  useMemo, useState } from "react"
import { useGetUsers } from "../../hooks/user/useGetUsers"
import LoadingSpinner from "../../components/LoadingSpinner"

function Employees() {
    const [searchTerm, setSearchTerm] = useState("");
    const [accountStatus, setAccountStatus] = useState("");

    // ✅ Memoize filters — prevents infinite fetching
    const filters = useMemo(() => {
      return { 
        role: "employee",
        search: searchTerm,
        account_status: accountStatus, 
      };
    },[searchTerm, accountStatus]); 
    // const {deleteUserById} = UserService();
    const {users: fetchedUsers, loading, error, pageNumber, prevButton, nextButton, deleteUser:removeEmployee} = useGetUsers(filters);

    // const [users, setUsers] = useState<User[]>([]);

  //   useEffect(() => {
  //   if (fetchedUsers && fetchedUsers.results.length > 0) {
  //     setUsers(fetchedUsers.results);
  //   }
  // }, [fetchedUsers]);
  
    if (loading) return <LoadingSpinner text="Loading employees..." />;
    if (error) return <p>Error: {error}</p>;

    const deleteUser = async (id: number) => {
    try {
      await removeEmployee(id);
      // setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  return (
    <Container className="pt-sm-5 d-flex overflow-auto flex-column">
      {/* Header component */}
      <Header path={'admin'}>
        <div className="d-flex gap-3">
            <h3 className='fw-bold'>Employees</h3>
        </div>
      </Header>

      {/* Search engine component with Add resident button*/}
      <Search sortByAccountStatus={true} onSearch={(value) => setSearchTerm(value)} onOrderChange={(status) => setAccountStatus(status)}>
        <div className="align-self-start">
            <a href='/admin/employee/add-employee' className="text-decoration-none d-flex align-items-center gap-3 text-light px-4 py-3 rounded-3 fw-bold" style={{backgroundColor:"#344CB7"}}>
                <IoMdAdd size={25}/>
                Add Employee
            </a>
        </div>
      </Search>

       {/* List of employee table*/}
       <EmployeeListTable users={fetchedUsers?.results} deleteUser={deleteUser}/>

       <div>
        <section className="d-flex justify-content-start align-items-center gap-2">
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={pageNumber === 1} onClick={() => prevButton(fetchedUsers?.previous ?? '')}>Prev</button>
          <div>{pageNumber}</div>
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={fetchedUsers?.next === null} onClick={() => nextButton(fetchedUsers?.next ?? '')}>Next</button>
        </section>
      </div>

    </Container>
  )
}

export default Employees