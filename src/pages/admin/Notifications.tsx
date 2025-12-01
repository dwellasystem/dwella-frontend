import { Container } from "react-bootstrap"
import Header from "../../components/Header"
import Search from "../../components/Search"
import { IoMdAdd } from "react-icons/io"
import { FaCommentSms } from "react-icons/fa6"
import NotificationTable from "../../components/admin/tables/NotificationTable"

function Notifications() {
  return (
    <Container className="pt-5 d-flex overflow-auto flex-column">

      {/* Header page */}
      <Header path={'admin'}>
       <div className="d-flex">
            <h3 className='fw-bold'>Notifications</h3>
        </div>
      </Header>

      {/* Search engine component with Add resident button*/}
      <Search>
        <div className="d-flex gap-2">
            <a href='/admin/notifications/send-sms' className="text-decoration-none d-flex align-items-center gap-3 text-light px-4 py-3 rounded-3 fw-bold" style={{backgroundColor:"#344CB7"}}>
                <FaCommentSms size={25}/>
                Bulk SMS
            </a>
             <a href='/admin/notifications/create' className="text-decoration-none d-flex align-items-center gap-3 text-light px-4 py-3 rounded-3 fw-bold" style={{backgroundColor:"#344CB7"}}>
                <IoMdAdd size={25}/>
                New Notice
            </a>
        </div>
      </Search>

      {/* Notification table list */}
      <NotificationTable/>
    </Container>
  )
}

export default Notifications