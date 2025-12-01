import { Container } from "react-bootstrap"
import Header from "../../components/Header"
import { FaAngleRight } from "react-icons/fa6"
import NewInquiriesTable from "../../components/employee/tables/NewInquiriesTable"
import { useInquiry } from "../../hooks/inquiries/useInquiry";
import { useMemo } from "react";

function NewInquiries() {

  const filters = useMemo(() => ({ status: "open" }), []);

  const {inquiries} = useInquiry(filters);
  
  return (    
    <Container className="pt-5 d-flex overflow-auto flex-column">
      {/* Header page */}
      <Header path={'employee'}>
        <div className="d-flex">
            <h3 className='fw-bold'>New Inquiries</h3>
        </div>
      </Header>
      {/* Form page heading */}
      <div className='d-flex align-items-center gap-1 pt-5 mb-3'>
            <span className='text-muted fw-bold d-flex align-items-center'>Dashboard</span>
                <FaAngleRight size={12}/>
            <span className='text-dark fw-bold d-flex align-items-center'>New Inquiries</span>
      </div>

      {/* Inquiries table list */}
      <NewInquiriesTable inquiries={inquiries?.results} />

    </Container>
  )
}

export default NewInquiries