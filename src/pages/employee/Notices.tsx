import { Container } from "react-bootstrap";
import Header from "../../components/Header";
import Search from "../../components/Search";
import NoticeTable from "../../components/employee/tables/NoticeTable";
import { IoMdAdd } from "react-icons/io";
import { useNotices } from "../../hooks/notices/useNotices";
import { useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useAuth } from "../../contexts/auth/AuthContext";

function Notices() {
    const [searchTerm, setSearchTerm] = useState("");
    const [type, setType] = useState("");
    const {role} = useAuth();
  
    // ✅ Memoize filters — prevents infinite fetching
    const filters = useMemo(() => {
      return {
        role: "resident",
        search: searchTerm,
        notice_type: type
      };
    }, [searchTerm, type]);


  const { notices, nextButton, prevButton, pageNumber, error, loading, deleteNotice } = useNotices(undefined, filters);

  const navigate = useNavigate();

  if(loading) return 
  if (error) return

  const confirmDelete = (id: number) => {
    return deleteNotice(id)
  }

  return (
    <Container className="pt-5 d-flex overflow-auto flex-column gap-2">
      {/* Header component*/}
      <Header path={"resident"}>
        <div className="d-flex gap-3">
          <h3 className="fw-bold">Notices</h3>
        </div>
      </Header>

      {/* Search engine component*/}
      <Search onSearch={(value) => setSearchTerm(value)} onOrderChange={(type) => setType(type)} sortByType={true}>
        <div className="align-self-start">
          <a
            onClick={() => navigate({to:`/${role}/notices/create`})}
            className="text-decoration-none d-flex align-items-center gap-3 text-light px-4 py-3 rounded-3 fw-bold"
            style={{ backgroundColor: "#344CB7", cursor:'pointer' }}
          >
            <IoMdAdd size={25} />
            Create Notice
          </a>
        </div>
      </Search>

      {/* Component table for list of notices */}
      <NoticeTable confirmDelete={confirmDelete} notices={notices?.results} />
      <div>
        <section className="d-flex justify-content-start align-items-center gap-2">
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={pageNumber === 1} onClick={() => prevButton(notices?.previous ?? '')}>Prev</button>
          <div>{pageNumber}</div>
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={notices?.next === null} onClick={() => nextButton(notices?.next ?? '')}>Next</button>
        </section>
      </div>
    </Container>
  );
}

export default Notices;
