import Header from '../../components/Header'
import { Container } from 'react-bootstrap'
import Search from '../../components/Search'
import { IoMdAdd } from 'react-icons/io'
import InquiriesTable from '../../components/resident/tables/InquiriesTable'
import { useAuth } from '../../contexts/auth/AuthContext'
import { useInquiry } from '../../hooks/inquiries/useInquiry'
import { useMemo, useState } from 'react'

function Inquiries() {
  const {user} = useAuth();

  const [search, setSearch] = useState('');
  const [type, setType] = useState('');   

  // ✅ Memoize filters — prevents infinite fetching
  const filters = useMemo(() => {
    return {
      resident: user?.id,
      search: search,
      type: type,
    }
  }, [search, type]);
  const {inquiries} = useInquiry(filters);

  return (
    <Container className="pt-sm-5 d-flex overflow-auto flex-column">

      {/* Header component */}
      <Header path={'resident'}>
        <div className="d-flex gap-3">
            <h3 className='fw-bold'>Inquiries</h3>
        </div>
      </Header>
      
      {/* Search engine component with request button*/}
      <Search sortByInquiryType={true} onSearch={(value) => setSearch(value)} onOrderChange={(value) => setType(value)}>
        <div className="align-self-start">
            <a href='/resident/submit-request' className="text-decoration-none d-flex align-items-center gap-3 text-light px-5 py-3 rounded-3 fw-bold" style={{backgroundColor:"#344CB7"}}>
                <IoMdAdd size={25}/>
                Request
            </a>
        </div>
      </Search>

      {/* Component table for list of inquiries */}
      <InquiriesTable inquiries={inquiries?.results}/>

    </Container>
    
  )
}

export default Inquiries