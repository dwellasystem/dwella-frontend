
import Nav from "react-bootstrap/Nav";
import { FaCircleInfo, FaHouseChimney } from "react-icons/fa6";
import { MdDashboard } from "react-icons/md";
// import { AiOutlineLineChart } from "react-icons/ai";
import { TbUserQuestion } from "react-icons/tb";
import "./side-bar.css"
import { useState } from "react";
import logo from "../../../assets/dwella-logo.png"
import { Link, useLocation } from "@tanstack/react-router";
import { CiMenuFries } from "react-icons/ci";
import { IoCloseSharp } from "react-icons/io5";
// import { useAuth } from "../../../contexts/auth/AuthContext";
// import { LiaMoneyBillSolid } from "react-icons/lia";

// const WS_URL = "ws://localhost:8001/ws/bills/?token=";

function SideBar() {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const [notificationCount, setNotificationCount] = useState(0);
  const location = useLocation();
  
  // const { token } = useAuth();  // Check if the user is authenticated

  // if (!token) return;

  // useEffect(() => {
  //   if (!token?.access) return;
  
  //   const socket = new WebSocket(WS_URL + token.access);
  
  //   socket.onopen = () => console.log("Connected to WebSocket");
  //   socket.onmessage = (event) => {
  //     const data = JSON.parse(event.data);
  //     if (data.count !== undefined) setNotificationCount(data.count);
  //   };
  //     socket.onclose = () => console.log("WebSocket connection closed");
  //     socket.onerror = (err) => console.error("WebSocket error:", err);
  
  //     return () => socket.close();
  //   }, [token]);

  //   useEffect(() => {
  //   if (location.pathname.startsWith("/resident/billing")) {
  //     setNotificationCount(0);
  //     // Optionally, you can also tell backend to mark notifications as seen
  //     // fetch("/api/bills/reset-notification/", { method: "POST", headers: { Authorization: `Bearer ${token.access}` } });
  //   }
  // }, [location.pathname, token]);

  return (
      
          <Nav variant="pills" className={`flex-sm-column justify-content-center justify-content-sm-start gap-3 shadow show-sidebar`}>

            <div className={`${isMenuOpen ? "mx-0" : "mx-auto"} d-none d-sm-block d-md-none`}>
              {isMenuOpen ? <IoCloseSharp size={20} onClick={() => setIsMenuOpen(!isMenuOpen)} /> : <CiMenuFries  size={20} onClick={() => setIsMenuOpen(!isMenuOpen)}/>}
            </div>
           

            <a href="#" className={`my-5 fw-bold ${isMenuOpen ? "d-block" : "d-none "} d-md-block fs-2`}>
              <img height={30} src={logo} alt="" />
            </a>

            <Link to="/resident/dashboard"  className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/resident/dashboard') ? 'link-active' : 'link-inactive'}`}>
              <MdDashboard />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block`}>
              Dashboard
              </span>
            </Link>

            <Link to="/resident/my-units"  className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/resident/my-units') ? 'link-active' : 'link-inactive'}`}>
              <FaHouseChimney />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block`}>
              My Units
              </span>
            </Link>
            
            {/* <Link to="/resident/financial" className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/resident/financial') ? 'link-active' : 'link-inactive'}`}>
              <AiOutlineLineChart />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block`}>
              Financial
              </span>
            </Link> */}

            {/* <Link to="/resident/billing" className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/resident/billing') ? 'link-active' : 'link-inactive'}`}>
              <LiaMoneyBillSolid />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block`}>
              Billings {notificationCount > 0 && (
                <span className="badge text-center bg-danger ms-auto m-auto">{notificationCount}</span>
              )}
              </span>
            </Link> */}

            <Link to="/resident/notices" className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/resident/notices') ? 'link-active' : 'link-inactive'}`}>
              <FaCircleInfo />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block`}>
                Notices
              </span>
            </Link>
            <Link to="/resident/inquiries" className={`text-decoration-none d-flex align-items-center fw-bold gap-2 rounded ${location.pathname.startsWith('/resident/inquiries') ? 'link-active' : 'link-inactive'}`}>
              <TbUserQuestion />
              <span className={`${ isMenuOpen ? "d-block" : "d-none"} d-md-block`}>
                Inquiries
              </span>
            </Link>
          </Nav>
  );
}

export default SideBar;
