import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setFormError] = useState(null);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setFormError("Please enter both email and password.");
      toast.error("Please enter both email and password.");
      return;
    } else {
      try {
        const response = await fetch("https://h3-server.vercel.app/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          const { token, role } = data;

          localStorage.setItem("token", token);
          localStorage.setItem("role", role);

          toast.success("Login Successful!");
          props.setIsLoggedIn(true)
          navigate("/dashboard");
        } else {
          const errorData = await response.json();

          if (response.status === 401) {
            toast.error("Invalid Email or Password!");
          } else if (response.status === 403) {
            toast.error("Pending Admin's Approval!");
          } else if (response.status === 500) {
            toast.error("Internal Server Error");
          } else {
            toast.error("Unexpected error occurred");
            console.error("Unexpected error during login:", errorData.message);
          }
        }
      } catch (error) {
        console.error("An error occurred during login:", error);
      }
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="form-header">
          <h3>Login</h3>
        </div>
        <form onSubmit={handleLogin}>
          <form-group>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="email"
              type="email"
              name="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </form-group>
          <form-group>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="password"
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </form-group>
          <div className="t-and-c"></div>
          <button type="submit" className="submit">
            Login
          </button>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default Login;
