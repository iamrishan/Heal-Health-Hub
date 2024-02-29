// Requests.js

import React, { useEffect, useState } from "react";
import "./Requests.css";
import { Toaster, toast } from "sonner";
import SideNav from "../SideNav";

const Requests = ({ changePath }) => {
  const [unverifiedNeeders, setUnverifiedNeeders] = useState([]);

  useEffect(() => {
    // Fetch unverified needers when the component mounts
    fetchUnverifiedNeeders();

    // Run the changePath function
    changePath();
  }, [changePath]);

  const fetchUnverifiedNeeders = async () => {
    try {
      const response = await fetch("https://h3-server.vercel.app/getunverifiedneeder");
      const data = await response.json();

      // Update state with the fetched unverified needers
      setUnverifiedNeeders(data);
    } catch (error) {
      console.error("Error fetching unverified needers:", error);
    }
  };

  const handleAccept = async (neederId) => {
    try {
      // Make API request to update the user status to verified
      await fetch(`https://h3-server.vercel.app/acceptneeder/${neederId}`, {
        method: "PUT",
      });

      toast.success("Accepeted Successfully!");
      // Fetch updated unverified needers after acceptance
      fetchUnverifiedNeeders();
    } catch (error) {
      console.error("Error accepting needer:", error);
    }
  };

  const handleReject = async (neederId) => {
    try {
      // Make API request to delete the user
      await fetch(`https://h3-server.vercel.app/rejectneeder/${neederId}`, {
        method: "DELETE",
      });
      toast.success("Rejected Successfully!");
      // Fetch updated unverified needers after rejection
      fetchUnverifiedNeeders();
    } catch (error) {
      console.error("Error rejecting needer:", error);
    }
  };

  return (
    <div className="container">
      <div className="heading">Organizations</div>
      {unverifiedNeeders.map((needer) => (
        <div key={needer._id} className="card">
          <div className="wrap">
            <div className="name">{needer.name}</div>
            {/* Render the document as a link */}
            <div className="document">
              <a
                className="view"
                href={needer.document}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Document
              </a>
            </div>
          </div>
          <div className="buttons">
            <button className="accept" onClick={() => handleAccept(needer._id)}>
              Accept
            </button>
            <button className="reject" onClick={() => handleReject(needer._id)}>
              Reject
            </button>
          </div>
        </div>
      ))}
      <Toaster position="top-right" duration={2000} />
    </div>
  );
};

export default Requests;
