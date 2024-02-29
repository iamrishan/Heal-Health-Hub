import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { SyncLoader } from "react-spinners";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [, setFormError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setFormError("Please enter email and password.");
      toast.error("Please enter email and password.");
      return;
    } else {
      try {
        setLoading(true);
        const response = await fetch("https://heal-health-hub-server.vercel.app/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          const role = data.role;

          localStorage.setItem("token", data.token);
          localStorage.setItem("role", role);

          await toast.promise(Promise.resolve("Login Successful!"), {
            loading: "Logging in...",
            success: "Login Successful!",
            error: "Unexpected error occurred",
          });

          setTimeout(() => {
            navigate("/dashboard");
          }, 1000);

          // setTimeout(() => {
          //   console.log("Role:", role);
          //   if (role == "giver") {
          //     props.setIsLoggedIn(true);
          //     navigate("/give");
          //   } else if (role == "needer") {
          //     props.setIsLoggedIn(true);
          //     navigate("/dashboard");
          //   } else if (role == "admin") {
          //     props.setIsLoggedIn(true);
          //     navigate("/request");
          //   } else {
          //     console.error("Unknown role:", role);
          //   }
          // }, 1000);
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
      } finally {
        setLoading(false);
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
          <button type="submit" className="submit" disabled={loading}>
            {loading ? (
              <SyncLoader loading={true} color="#ffffff" size={10} margin={2} />
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
      <Toaster
        position="top-right"
        reverseOrder={true}
        toastOptions={{
          // Define default options
          className: "toast",
          duration: 2000,
        }}
      />
    </div>
  );
};

export default Login;
