import { Col, Row } from "react-bootstrap"
import { MdArrowOutward } from "react-icons/md"
import { formatDateToHumanReadable } from "../helpers/authHelper/dateHelper";
import type { User } from "../models/User.model";

function ProfileDetails({user, navigate} : {user: User, navigate: () => void}) {

    let fullName = user ? `${user?.first_name} ${user?.middle_name} ${user?.last_name}` : null
    let email = user ? `${user?.email}` : null
    let dateRegistered = user ? `${formatDateToHumanReadable(user?.created_at || '')}` : null
    let status = user ? `${user?.account_status}` : null
    let contactNumber = user ? `${user?.phone_number}` : null


  return (
    <div className="p-4 rounded-3 m-auto" style={{ backgroundColor: "#F2F2F7", width: "90%"}}>

        {/* Details Heading */}
        <Row>
            <Col className="d-flex justify-content-between align-items-center">
                <div className="fs-4 fw-bold">Details</div>
                <div onClick={navigate} className="bg-primary px-3 py-2 text-light d-flex gap-2 align-items-center rounded-3" style={{cursor:"pointer"}}>
                    <span className="fw-bold">Edit</span>
                    <MdArrowOutward size={25}/>
                </div>
            </Col>
        </Row>
        <hr />

        {/* Profile Full Details */}
        <Row className="d-flex flex-column">
            <Col className="d-flex justify-content-between flex-wrap gap-2">
                <div>
                    <span className="">Fullname</span>
                    <p className="fs-5 fw-bold">{fullName}</p>
                    <span className="">Email</span>
                    <p className="fs-5 fw-bold">{email}</p>
                </div>
                <div>
                    {user.role === 'resident' ? <>
                        <span className="">Date registered</span>
                        <p className="fs-5 fw-bold">{dateRegistered}</p>
                        {user.role === 'resident' && <><span className="">Status</span>
                        <p className="fs-5 fw-bold">{status && status.charAt(0).toUpperCase() + status.slice(1)}</p></>}
                    </> : <>
                        <span className="">Role</span>
                        <p className="fs-5 fw-bold">{user.role && (user.role?.charAt(0).toUpperCase() + user.role?.slice(1))}</p>
                        <span className="">Status</span>
                        <p className="fs-5 fw-bold">{status && status.charAt(0).toUpperCase() + status.slice(1)}</p>
                    </>}
                </div>
                <div>
                    <span className="">Contact Number</span>
                    <p className="fs-5 fw-bold">{contactNumber}</p>
                </div>
            </Col>
        </Row>
    </div>
  )
}

export default ProfileDetails