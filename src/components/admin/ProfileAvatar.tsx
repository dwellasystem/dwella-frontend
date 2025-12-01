import { FaCamera } from "react-icons/fa6"
import profile from "../../assets/_ 1.png"
import { Image } from "react-bootstrap"
import type { User } from "../../models/User.model"

interface ProfileAvatarProps{
  user?: User;
}

function ProfileAvatar(props: ProfileAvatarProps) {
  return (
    <div className="p-3 d-flex align-items-center gap-2">

      {/* Profile avatar */}
        <div className="position-relative">
            <Image src={profile} roundedCircle  width={150} height={150}/>
            <div className="position-absolute" style={{bottom:10, right:5, cursor:"pointer"}}>
                <FaCamera size={30} color="#344CB7"/>
            </div>
        </div>
      
      {/* Side profile info */}
        <div className="d-flex flex-column">
            <h3 className="fw-bold fs-5">{props.user?.first_name}</h3>
            <span className="text-muted">{props.user?.role}</span>
            <span className="text-muted">{props.user?.address}</span>
        </div>
    </div>
  )
}

export default ProfileAvatar