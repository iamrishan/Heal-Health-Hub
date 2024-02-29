import React, { useState } from "react";
import "./Register.css";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";

const Register = () => {
  const [userType, setUserType] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(false);

  const openPopup = () => {
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const navigate = useNavigate();

  const handleRegistration = async (e) => {
    e.preventDefault();

    const { name, location, email, password, agree } = e.target.elements;

    if (
      !name.value ||
      !location.value ||
      !email.value ||
      !password.value ||
      !agree.checked
    ) {
      toast.error("Please fill out all required fields.");
      return;
    } else {
      const role = userType ? "needer" : "giver";
      const verified = userType ? false : true;
      const { name, location, email, password, agree } = e.target.elements;

      const requestBody = JSON.stringify({
        name: name.value,
        location: location.value,
        email: email.value,
        password: password.value,
        agree: agree.checked,
        role,
        verified,
        // You may add other properties here if needed
      });

      try {
        setLoading(true);

        const response = await fetch("https://heal-health-hub-server.vercel.app/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: requestBody,
        });

        if (response.ok) {
          userType
            ? toast.loading("Waiting for Admin's Approval!")
            : toast.success("Registered successfully!");

          setTimeout(() => {
            navigate("/login");
          }, 1000);

          // Add any additional logic or redirection after successful registration
        } else if (response.status === 400) {
          toast.warning("User with the email already exist");
        } else {
          toast.error("User registered failed");
        }
      } catch (error) {
        console.error("Error during registration", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login register">
      {isPopupOpen && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <span onClick={closePopup} className="close-button">
              &times;
            </span>
            <h5> Terms Of Service</h5>
            <h2 className="textb">1. Acceptance of Terms</h2>
            <p className="text">
              By accessing or using Heal Health Hub ("the Service"), you agree
              to comply with and be bound by these Terms of Service. If you do
              not agree with any part of these terms, you may not use the
              service.
            </p>

            <h2 className="textb">2. Use of the Service</h2>
            <p className="text">
              You may be required to create an account to access certain
              features of Heal Health Hub. You are responsible for maintaining
              the confidentiality of your account information. You agree not to
              engage in any activities that violate applicable laws or the terms
              outlined in this agreement.
            </p>

            <h2 className="textb">3. Content and Intellectual Property</h2>
            <p className="text">
              By submitting content to Heal Health Hub, you grant Heal Health
              Hub a worldwide, non-exclusive, royalty-free license to use,
              reproduce, and distribute the content. All intellectual property
              rights related to Heal Health Hub, including trademarks,
              copyrights, and patents, are owned by Heal Health Hub.
            </p>

            <h2 className="textb">4. Privacy</h2>
            <p className="text">
              Our Privacy Policy governs the use of your personal information.
              By using Heal Health Hub, you consent to the collection and use of
              information as outlined in the Privacy Policy.
            </p>

            <h2 className="textb">5. Termination</h2>
            <p className="text">
              Heal Health Hub reserves the right to terminate or suspend your
              account at any time for violation of these terms or for any other
              reason.
            </p>

            <h2 className="textb">6. Limitation of Liability</h2>
            <p className="text">
              Heal Health Hub is not liable for any direct, indirect,
              incidental, or consequential damages arising from the use or
              inability to use the service.
            </p>

            <h2 className="textb">7. Governing Law</h2>
            <p className="text">
              These Terms of Service are governed by and construed in accordance
              with the laws of [Your Country/State].
            </p>

            <h2 className="textb">8. Changes to Terms</h2>
            <p className="text">
              Heal Health Hub reserves the right to modify or revise these terms
              at any time. Continued use of the service after such changes
              constitutes your acceptance of the new terms.
            </p>
            <br></br>
          </div>
        </div>
      )}
      <div className="login-container">
        <div className="form-header">
          <h3>Create an Account</h3>
        </div>
        <div className="usertype">
          <button
            onClick={() => {
              setUserType((prev) => !prev);
            }}
            className={!userType ? "active" : undefined}
          >
            Giver
          </button>
          <button
            onClick={() => {
              setUserType((prev) => !prev);
            }}
            className={userType ? "active" : undefined}
          >
            Needer
          </button>
        </div>

        <form onSubmit={handleRegistration}>
          <form-group>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              className="fullname"
              type="name"
              name="name"
              placeholder="Enter your name"
            />
          </form-group>
          <form-group>
            <label htmlFor="location">Place</label>
            <input
              id="location"
              className="location"
              type="location"
              name="location"
              placeholder="Enter your location"
            />
          </form-group>
          <form-group>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              className="email"
              type="email"
              name="email"
              placeholder="Enter your email address"
            />
          </form-group>
          <form-group>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              className="password"
              type="password"
              name="password"
              placeholder="Enter password"
            />
          </form-group>
          {userType && (
            <form-group>
              <label htmlFor="file">Upload Document</label>
              <input
                id="file"
                type="file"
                accept="image/*, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </form-group>
          )}
          <div className="t-and-c">
            <form-group>
              <input
                id="agree"
                type="checkbox"
                className="agree"
                name="agree"
              />
              <label htmlFor="agree" className="agreetext">
                By creating account, you agree to our
                <span onClick={openPopup} className="link agreetext">
                  &nbsp;Terms of Service
                </span>
              </label>
            </form-group>
          </div>
          <button className="submit" type="submit" disabled={loading}>
            {loading ? (
              <SyncLoader loading={true} color="#ffffff" size={10} margin={2} />
            ) : userType ? (
              "Request for Verification"
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
      <Toaster
        position="top-right"
        reverseOrder={true}
        toastOptions={{
          className: "toast",
          duration: 2000,
        }}
      />
    </div>
  );
};

export default Register;
