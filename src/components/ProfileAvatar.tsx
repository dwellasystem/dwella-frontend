import { FaCamera } from "react-icons/fa6"
import { Image } from "react-bootstrap"
import type { User } from "../models/User.model"
import { useRef } from "react";
import { useGetUsers } from "../hooks/user/useGetUsers";
import { FaUserAlt } from "react-icons/fa";



function ProfileAvatar({user, setUser}: {user: User, setUser?: React.Dispatch<React.SetStateAction<User | undefined>>}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const {updateUserProfile} = useGetUsers();

  if(!setUser){
    return
  }

  let fullName = user ? `${user.first_name} ${user.middle_name} ${user.last_name}` : null;


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];

      const formData = new FormData();
      formData.append("profile", selectedFile);
      try {
        const response = await updateUserProfile(user.id ?? 0, formData, {'Content-Type': 'multipart/form-data'});
        // console.log(response.profile)
        setUser({...user, profile: response.profile});
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  }

  const updateProfilePicture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  return (
    <div className="p-3 d-flex align-items-center gap-2">

      {/* Profile avatar */}
        <div className="position-relative">
            {user.profile ? <Image src={user.profile} roundedCircle  width={150} height={150}/> : <div className="p-5 rounded-circle" style={{backgroundColor: '#bdc3e0ff'}}><FaUserAlt size={80}/></div>}
            <div onClick={updateProfilePicture} className="position-absolute" style={{bottom:10, right:15, cursor:"pointer"}}>
                <FaCamera size={30} color="#344CB7"/>
            </div>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          // onChange={handleFileChange}
        />
      
      {/* Side profile info */}
        <div className="d-flex flex-column">
            <h3 className="fw-bold fs-5">{fullName}</h3>
            <span className="text-muted">{user.role && user.role?.charAt(0).toUpperCase() + user.role.slice(1)}</span>
            <span className="text-muted">{user.address ||  "No Address"}</span>
        </div>
    </div>
  )
}

export default ProfileAvatar