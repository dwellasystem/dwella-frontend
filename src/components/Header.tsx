import { Dropdown } from 'react-bootstrap'
import { type ReactNode } from 'react'
import {  useNavigate } from '@tanstack/react-router';
import { useAuth } from '../contexts/auth/AuthContext';
import { FaUserAlt } from 'react-icons/fa';


interface HeaderProps {
  children?: ReactNode;
  path: String;
};

function Header({children, path} : HeaderProps) {
  const navigate = useNavigate();

  const {logout, user, role} = useAuth();
  // const logOutHandler = () => {
  //   logout();
  //   window.location.href = '/login'
  // }

  return (
    <div className="d-flex justify-content-start flex-column-reverse flex-sm-row justify-content-sm-between align-items-center gap-5 gap-md-3 flex-wrap-reverse">
        {children}
        
        {/* Profile avatar */}
        <Dropdown align="end">
            <Dropdown.Toggle
            variant="light"
            id="dropdown-profile"
            className="d-flex align-items-center gap-2 border-0 bg-transparent"
            >
            {user?.profile ? <img src={user?.profile} alt="Profile" width={50} height={50} style={{ borderRadius: "50%" }} /> : <div className="rounded-circle" style={{backgroundColor: '#bdc3e0ff', padding: '15px'}}><FaUserAlt size={30}/></div>}
            <div className="d-flex flex-column text-start">
                <span className="fw-semibold">{user?.first_name + " " + user?.last_name}</span>
                <span className="text-muted" style={{ fontSize: "0.85rem" }}>{role && role.charAt(0).toUpperCase() + role.slice(1)}</span>
            </div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
            <Dropdown.Item onClick={() => navigate({to: `/${path}/profile`})}>View Profile</Dropdown.Item>
            <Dropdown.Item onClick={() => navigate({to: `/${path}/account`})}>Account Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={logout} className="text-danger">Logout</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    </div>
  )
}

export default Header;