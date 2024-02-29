import React, { useState, useEffect } from "react";
import "./Navbar.css";
import logo from "./../../Images/logo/logo.png";
import { NavLink, useNavigate } from "react-router-dom";
import { jwtDecode as jwt_decode } from "jwt-decode";

const Navbar = (props) => {
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
  }, [userRole]); // Empty dependency array means this effect runs once on component mount

  const handleLogout = () => {
    localStorage.removeItem("token");
    props.setIsLoggedIn(false);
    setUsername("");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo-container">
          <NavLink to="/">
            {" "}
            <img className="logo" src={logo} alt="Heal Health Hub" />
          </NavLink>
          <div className="nav-link-container">
            <div className="brand-name">
              <NavLink to="/">HEAL HEALTH HUB</NavLink>
            </div>
          </div>
        </div>

        {props.isLoggedIn ? (
          <div className="nav-link-container">
            <div className="welcome-message">Welcome, {username}!</div>
          </div>
        ) : (
          <div className="nav-link-container">
            <NavLink to="./login">
              <div className="nav-links">Login</div>
            </NavLink>
            <NavLink to="./register">
              <div className="nav-links">Register</div>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
