
import Nav from "react-bootstrap/Nav";
import { FaHouseChimney, FaHouseUser, FaMoneyBillTransfer, FaPeopleRoof, FaUserTie } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import { AiOutlineLineChart } from "react-icons/ai";
import "./side-bar.css"
import { useState } from "react";
import logo from "../../../assets/dwella-logo.png"
import { Link, useLocation } from "@tanstack/react-router";
import { CiMenuFries } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";


function SideBar() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  return (
          <Nav variant="pills" className={`flex-sm-column justify-content-center justify-content-sm-start gap-3 shadow show-sidebar`}>

            <div className={`${isMenuOpen ? "mx-0" : "mx-auto"} d-none d-sm-block d-md-none`}>
              {isMenuOpen ? <IoCloseSharp size={20} onClick={() => setIsMenuOpen(!isMenuOpen)} /> : <CiMenuFries  size={20} onClick={() => setIsMenuOpen(!isMenuOpen)}/>}
            </div>
           
            <a href="#" className={`my-5 fw-bold ${isMenuOpen ? "d-block" : "d-none "} d-md-block fs-2`}>
              <img height={30} src={logo} alt="" />
            </a>

            <Link to="/admin"  className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.endsWith('/admin') ? 'link-active' : 'link-inactive'}`}>
              <MdDashboard />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block`}>
              Dashboard
              </span>
            </Link>

            <Link to="/admin/resident"  className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/admin/resident') ? 'link-active' : 'link-inactive'}`}>
              <FaPeopleRoof />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block`}>
              Residents
              </span>
            </Link>

            <Link to="/admin/employee"  className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/admin/employee') ? 'link-active' : 'link-inactive'}`}>
              <FaUserTie />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block`}>
              Employees
              </span>
            </Link>
            
            <Link to="/admin/financial" className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/admin/financial') ? 'link-active' : 'link-inactive'}`}>
              <AiOutlineLineChart />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block`}>
              Financial
              </span>
            </Link>

            {/* <Link to="/admin/notifications" className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/admin/notifications') ? 'link-active' : 'link-inactive'}`}>
              <IoNotifications />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block`}>
              Notifications
              </span>
            </Link> */}

            <Link to="/admin/assigned-units" className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/admin/assigned-units') ? 'link-active' : 'link-inactive'}`}>
              <FaHouseUser />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block text-nowrap`}>
                Assigned Units
              </span>
            </Link>

            <Link to="/admin/units" className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/admin/units') ? 'link-active' : 'link-inactive'}`}>
              <FaHouseChimney />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block text-nowrap`}>
                Units
              </span>
            </Link>

            <Link to="/admin/monthly-bill" className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/admin/monthly-bill') ? 'link-active' : 'link-inactive'}`}>
              <FaMoneyBillTransfer />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block text-nowrap`}>
              Monthly Billing
              </span>
            </Link>

          </Nav>
  );
}

export default SideBar;
