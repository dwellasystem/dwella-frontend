import { Card, Container } from "react-bootstrap"
import Header from "../../components/Header"
import Search from "../../components/Search"
import { IoMdAdd } from "react-icons/io"
import InquiriesTable from "../../components/employee/tables/InquiriesTable"
import { useNavigate } from "@tanstack/react-router"
import { useInquiry } from "../../hooks/inquiries/useInquiry"
import InquiryModal from "../../components/modals/InquiryModal"
import { useMemo, useState } from "react"
import { type Inquiry } from "../../models/Inquiry.model"

type FormType ={
    resident: number|undefined;
    unit: number|undefined;
    type: string;
    description: string;
    title: string;
    status:string;
}

function Inquiries() {

  const [searchTerm, setSearchTerm] = useState("");
  const [type, setType] = useState("");

  // ✅ Memoize filters — prevents infinite fetching
    const filters = useMemo(() => {
      return {
        search: searchTerm,
        type: type
      };
  }, [searchTerm, type]);


  const navigate = useNavigate();
  const {inquiries, loading, error, pageNumber, prevButton, nextButton, updateInquiry, deleteInquiry} = useInquiry(filters);
  const [modalShow, setModalShow] = useState(false);
  const [inquiryDetail, setInquiryDetail] = useState<Inquiry>();
  const [newData, setNewData] = useState<FormType | undefined>();

  if(loading){
    return;
  }

  if(error){
    return <div className="h-100 d-flex justify-content-center align-items-center">
      <Card style={{ width: '30rem', height: '10rem' }} className="d-flex justify-content-center align-items-center">
      <Card.Body>
        <Card.Title>Sorry...</Card.Title>
        <Card.Text>
          Sorry the user you are trying to update is no longer available.
        </Card.Text>
        <Card.Link href="/employee/inquiries">Go back</Card.Link>
      </Card.Body>
    </Card>
    </div>
  }

  const editInquiry = (detail: Inquiry) => {
    setInquiryDetail(detail);
    setNewData({
      resident: detail.resident.id,
      unit: detail.unit.id,
      type: detail.type,
      description: detail.description,
      title: detail.title,
      status: detail.status
    })
    setModalShow(true);
  };

  const saveChanges = () => {
    if(!newData?.title || !newData?.description || !newData?.resident || !newData?.status || !newData?.type || !newData?.unit){
      return alert("Please select a valid choice!");
    }
    if(newData && inquiryDetail){
      updateInquiry(inquiryDetail.id, newData)
      setModalShow(false);
    }
  }

  const removeInquiry = (id: number) => {
    return deleteInquiry(id);
  }

  console.log(inquiries)

  return (
    <Container className="pt-sm-5 d-flex overflow-auto flex-column">

      {/* Header component */}
      <Header path={'resident'}>
        <div className="d-flex gap-3">
            <h3 className='fw-bold'>Inquiries</h3>
        </div>
      </Header>
      
      {/* Search engine component with request button*/}
      <Search sortByInquiryType={true} onSearch={(value) => setSearchTerm(value)} onOrderChange={(type) => setType(type)}>
        <div className="align-self-start">
            <a onClick={() => navigate({to:'/employee/inquiries/create'})} className="text-decoration-none d-flex align-items-center gap-3 text-light px-5 py-3 rounded-3 fw-bold" style={{backgroundColor:"#344CB7", cursor:'pointer'}}>
                <IoMdAdd size={25}/>
                Log New Inquiry
            </a>
        </div>
      </Search>

      {/* Component table for list of inquiries */}
      <InquiriesTable deleteInquiry={removeInquiry} inquiries={inquiries?.results} editInquiry={editInquiry}/>
      <InquiryModal saveChanges={saveChanges} newData={newData} setNewData={setNewData} inquiryDetail={inquiryDetail} setInquiryDetail={setInquiryDetail} show={modalShow} onHide={() => setModalShow(false)}/>
      <div>
        <section className="d-flex justify-content-start align-items-center gap-2">
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={pageNumber === 1} onClick={() => prevButton(inquiries?.previous ?? '')}>Prev</button>
          <div>{pageNumber}</div>
          <button className="btn fw-bold text-white" style={{backgroundColor: 'rgb(52, 76, 183)'}} disabled={inquiries?.next === null} onClick={() => nextButton(inquiries?.next ?? '')}>Next</button>
        </section>
      </div>
    </Container>
  )
}

export default Inquiries