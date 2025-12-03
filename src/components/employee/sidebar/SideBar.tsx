
import Nav from "react-bootstrap/Nav";
import { FaCircleInfo, FaHouseChimney, FaHouseUser, FaMoneyBillTransfer, FaPeopleRoof } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
import {  TbUserQuestion, } from "react-icons/tb";
import "./side-bar.css"
import { useState } from "react";
import logo from "../../../assets/dwella-logo.png"
import { Link, useLocation } from "@tanstack/react-router";
import { CiMenuFries } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
import { ImCreditCard } from "react-icons/im";
import { RiInformationFill } from "react-icons/ri";

function SideBar() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation();
  
  return (
          <Nav variant="pills" className={`flex-sm-column justify-content-center justify-content-sm-start gap-3 shadow show-sidebar`}>

            <div className={`${isMenuOpen ? "mx-0" : "mx-auto"} d-none d-sm-block d-md-none`}>
              {isMenuOpen ? <IoCloseSharp size={20} onClick={() => setIsMenuOpen(!isMenuOpen)} /> : <CiMenuFries  size={20} onClick={() => setIsMenuOpen(!isMenuOpen)}/>}
            </div>
           
            <a href="#" className={`my-5 fw-bold ${isMenuOpen ? "d-block" : "d-none "} d-md-block fs-2`}>
              <img height={30} src={logo} alt="" />
            </a>

            <Link to="/employee"  className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.endsWith('/employee') ? 'link-active' : 'link-inactive'}`}>
              <MdDashboard />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block`}>
              Dashboard
              </span>
            </Link>

            <Link to="/employee/resident"  className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/employee/resident') ? 'link-active' : 'link-inactive'}`}>
              <FaPeopleRoof />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block`}>
              Residents
              </span>
            </Link>

            <Link to="/employee/assigned-units" className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/employee/assigned-units') ? 'link-active' : 'link-inactive'}`}>
              <FaHouseUser />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block text-nowrap`}>
              Assigned Units
              </span>
            </Link>

            <Link to="/employee/units" className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/employee/units') ? 'link-active' : 'link-inactive'}`}>
              <FaHouseChimney />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block text-nowrap`}>
              Units
              </span>
            </Link>

            <Link to="/employee/payments"  className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/employee/payments') ? 'link-active' : 'link-inactive'}`}>
              <ImCreditCard />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block`}>
              Payments
              </span>
            </Link>

            <Link to="/employee/monthly-bill" className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/employee/monthly-bill') ? 'link-active' : 'link-inactive'}`}>
              <FaMoneyBillTransfer />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block text-nowrap`}>
              Monthly Billing
              </span>
            </Link>
            
            <Link to="/employee/notices" className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/employee/notices') ? 'link-active' : 'link-inactive'}`}>
              <FaCircleInfo />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block`}>
              Notices
              </span>
            </Link>

            <Link to="/employee/inquiries" className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/employee/inquiries') ? 'link-active' : 'link-inactive'}`}>
              <TbUserQuestion />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block`}>
              Inquiries
              </span>
            </Link>

            <Link to="/employee/information" className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/employee/information') ? 'link-active' : 'link-inactive'}`}>
              <RiInformationFill />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block text-nowrap`}>
              Hoa Information
              </span>
            </Link>

          </Nav>
  );
}

export default SideBar;
