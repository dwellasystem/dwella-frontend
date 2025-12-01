import { Container } from 'react-bootstrap'
import Header from '../../components/Header'
import Search from '../../components/Search'
import NoticeTable from '../../components/resident/tables/NoticeTable'
import { useAuth } from '../../contexts/auth/AuthContext';
import { useNotices } from '../../hooks/notices/useNotices';
import { useMemo, useState } from 'react';

function Notices() {
  const {user} = useAuth();

  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  // ✅ Memoize filters — prevents infinite fetching
  const filters = useMemo(() => {
    return {
      search: search,
      notice_type: type,
    }
  }, [search, type]);
  const {notices} = useNotices(user?.id, filters);

  return (
    <Container className="pt-5 d-flex overflow-auto flex-column gap-2">
      {/* Header component*/}
      <Header path={'resident'}>
        <div className="d-flex gap-3">
            <h3 className='fw-bold'>Notices</h3>
        </div>
      </Header>
      
      {/* Search engine component*/}
      <Search sortByType={true} onSearch={(value) => setSearch(value)} onOrderChange={(value) => setType(value)}/>
      
      {/* Component table for list of notices */}
      <NoticeTable notices={notices?.results}/>
      
    </Container>
  )
}

export default Notices