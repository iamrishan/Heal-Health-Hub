import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import SideNav from "./Components/SideNav";
import Dashboard from "./Components/Dashboard";
import Users from "./Components/Users";
import Requests from "./Components/Requests";
import AddItems from "./Components/AddItem";

function App() {
  const [path, setPath] = useState("/");
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const changePath = () => {
    const path = window.location.pathname.split("/");
    const path1 = path[path.length - 1];
    setPath(path1);
  };

  return (
    <div className="App">
      <Router>
        <Navbar path={path} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Home />
              </>
            }
          />
          <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard/*"
            element={<SideNav isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} path={path} changePath={changePath} />}
          >
            <Route index element={<Dashboard changePath={changePath} />} />
            <Route
              path="give"
              element={<AddItems path={path} changePath={changePath} />}
            />
            <Route
              path="requests"
              element={<Requests changePath={changePath} />}
            />
            <Route path="users" element={<Users changePath={changePath} />} />
          </Route>
          <Route
            path="/admin/dashboard/*"
            element={<SideNav path={path} changePath={changePath} />}
          >
            <Route index element={<Dashboard changePath={changePath} />} />
            <Route path="users" element={<Users changePath={changePath} />} />
            <Route
              path="requests"
              element={<Requests changePath={changePath} />}
            />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
