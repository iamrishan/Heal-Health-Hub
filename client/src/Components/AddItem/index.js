import React, { useState } from "react";
import "./AddItems.css";
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AddItems = () => {
  const [itemType, setItemType] = useState("");
  const [group, setGroup] = useState("");
  const [quantity, setQuantity] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [place, setPlace] = useState("");

  const navigate = useNavigate();

  const handleAddItem = async (e) => {
    e.preventDefault();

    // Validation: Check if required fields are filled
    if (!itemType || !contactNumber || !place) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const formData = {
      itemName: itemType,
      group: group || null,
      quantity: quantity || null,
      contactNumber: contactNumber,
      place: place,
    };

    try {
      const response = await fetch("https://h3-server.vercel.app/additem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Item added successfully!");
        navigate("/dashboard");
      } else {
        toast.error("Failed to add item");
      }
    } catch (error) {
      console.error("Error during item addition", error);
    }
  };

  return (
    <div className="add-items">
      <div className="add-items-container">
        <div className="form-header">
          <h3>Give Something for Good</h3>
        </div>
        <form onSubmit={handleAddItem}>
          <form-group>
            <label htmlFor="itemType">Select Type</label>
            <select
              id="itemType"
              className="itemType"
              name="itemType"
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
            >
              <option value="" disabled>
                Select item type
              </option>
              <option value="Blood">Blood</option>
              <option value="Wheelchair">Wheelchair</option>
              <option value="Nebullizer">Nebullizer</option>
              <option value="Oxygen Cylinder"> Oxygen Cylinder </option>
            </select>
          </form-group>
          {itemType === "Blood" && (
            <form-group>
              <label htmlFor="group">Group</label>
              <input
                id="group"
                className="group"
                type="text"
                name="group"
                placeholder="Enter item group"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
              />
            </form-group>
          )}

          {/* Render "Quantity" field when any other type is selected */}
          {itemType !== "Blood" && (
            <form-group>
              <label htmlFor="quantity">Quantity</label>
              <input
                id="quantity"
                className="quantity"
                type="number"
                name="quantity"
                placeholder="Enter item quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </form-group>
          )}

          <form-group>
            <label htmlFor="contactNumber">Contact Number</label>
            <input
              id="contactNumber"
              className="contactNumber"
              type="tel"
              name="contactNumber"
              placeholder="Enter contact number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
            />
          </form-group>
          <form-group>
            <label htmlFor="place">Place</label>
            <input
              id="place"
              className="place"
              type="text"
              name="place"
              placeholder="Enter place"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
          </form-group>
          <div className="t-and-c">
            <form-group>
              <label htmlFor="agree" className="agreetext">
                If someone finds your post useful, they will contact you
                directly.
              </label>
            </form-group>
          </div>
          <button className="submit" type="submit">
            Post
          </button>
        </form>
      </div>
      <Toaster position="top-right" duration={2000} />
    </div>
  );
};

export default AddItems;
