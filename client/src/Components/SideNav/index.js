import React, { useState, useEffect } from "react";
import "./SideNav.css";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { jwtDecode as jwt_decode } from "jwt-decode";
import { MdDashboard, MdPeople, MdAssignment, MdLogout } from "react-icons/md";

const SideNav = (props) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userRole, setUserRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Function to update user information based on token
    const updateUserInfo = () => {
      const token = localStorage.getItem("token");

      if (token) {
        const decodedToken = jwt_decode(token);
        const { name, role } = decodedToken;

        setUsername(name);
        setUserRole(role);
        props.setIsLoggedIn(true);
      } else {
        props.setIsLoggedIn(false);
        setUsername("");
      }
    };

    // Initial update on component mount
    updateUserInfo();

    // Event listener for changes in local storage
    const handleStorageChange = () => {
      updateUserInfo();
    };

    // Attach the event listener
    window.addEventListener("storage", handleStorageChange);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); // Empty dependency array means this effect runs once on component mount

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    props.setIsLoggedIn(false);
    setUsername("");
    navigate("/login");
  };

  return (
    <>
      <header className="nav_header_column sidenav">
        <div className="category-nav-container">
          <ul className="category-nav">
            {props.isLoggedIn && (
              <>
                {userRole === "admin" && (
                  <NavLink
                    to="/dashboard/requests"
                    className={
                      props.path === "requests" ? "active_nav_link" : "nav_link"
                    }
                  >
                    <li>
                      <MdAssignment className="nav_icon" />
                      Requests
                    </li>
                  </NavLink>
                )}

                {userRole === "giver" && (
                  <NavLink
                    to="/dashboard/give"
                    className={
                      props.path === "give" ? "active_nav_link" : "nav_link"
                    }
                  >
                    <li>
                      <MdDashboard className="nav_icon" />
                      Give Something
                    </li>
                  </NavLink>
                )}

                {userRole === "needer" && (
                  <NavLink
                    to="/dashboard"
                    className={
                      props.path === "dashboard"
                        ? "active_nav_link"
                        : "nav_link"
                    }
                  >
                    <li>
                      <MdDashboard className="nav_icon" />
                      Dashboard
                    </li>
                  </NavLink>
                )}

                <NavLink
                  to="/login"
                  onClick={handleLogout}
                  className={
                    props.path === "logout" ? "active_nav_link" : "nav_link"
                  }
                >
                  <li>
                    <MdLogout className="nav_icon" />
                    Logout
                  </li>
                </NavLink>
              </>
            )}
          </ul>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default SideNav;
