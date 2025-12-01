
function ProfileStatus() {
  return (

    // Profile Status online/offline.
    <div className='d-flex align-items-center gap-2 p-4 align-self-start'>
        <div className='bg-success rounded-circle' style={{width: '15px', height:"15px"}}></div>
        <span className='text-center fw-bold mt-1'>Online</span>
    </div>
  )
}

export default ProfileStatus