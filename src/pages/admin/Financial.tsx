import { Container } from "react-bootstrap"
import Header from "../../components/Header"
import { useNavigate } from "@tanstack/react-router";
import { IoMdAdd } from "react-icons/io";
import Search from "../../components/Search";

function Financial() {
  const navigate = useNavigate();

  return (
    <Container className="pt-sm-5 pt-4 d-flex overflow-auto flex-column">

      {/* Header component*/}
      <Header path={'admin'}>
        <div className="d-flex gap-3">
            <div onClick={() => navigate({to: '/resident/upload-payment'})} 
                className="d-flex align-items-center gap-2 py-3 px-5 rounded-3" 
                style={{backgroundColor: "#344CB7", cursor: "pointer"}}
                >
                <IoMdAdd size={25} color="white"/>
                <a className="text-decoration-none text-light fw-bold">Record</a>
            </div>
        </div>
      </Header>

      {/* Search engine component with download button*/}
      <Search>
      </Search>

    </Container>
  )
}

export default Financial