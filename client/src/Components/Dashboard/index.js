import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = ({ changePath }) => {
  const [groupCounts, setGroupCounts] = useState({});
  const [itemTypes, setItemTypes] = useState([]);
  const [locations, setLocations] = useState([]);

  const [selectedItemType, setSelectedItemType] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    changePath();
    // Fetch data from the API endpoint
    const fetchData = async () => {
      try {
        // Fetch items data
        const responseItems = await fetch("https://heal-health-hub-server.vercel.app/getitems");
        if (responseItems.ok) {
          const itemsData = await responseItems.json();

          // Calculate group counts
          const counts = {};
          itemsData.forEach((item) => {
            const itemname = item.itemName || "Other";
            counts[itemname] = (counts[itemname] || 0) + 1;
          });

          setGroupCounts(counts);

          // Fetch available item types
          const uniqueItemTypes = [
            ...new Set(itemsData.map((item) => item.itemName)),
          ];
          setItemTypes(uniqueItemTypes);

          // Fetch available locations
          const uniqueLocations = [
            ...new Set(itemsData.map((item) => item.place)),
          ];
          setLocations(uniqueLocations);

          // Set filtered items based on selected type and location
          const filtered = itemsData.filter(
            (item) =>
              (!selectedItemType || item.itemName === selectedItemType) &&
              (!selectedLocation || item.place === selectedLocation)
          );
          setFilteredItems(filtered);
        } else {
          console.error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [changePath, selectedItemType, selectedLocation]);

  const renderCard = (group, count) => (
    <div key={group} className="card custom-card">
      <div className="card-body">
        <h5 className="card-title">{group}</h5>
        <div className="icon">{count}</div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="search-boxes">
        <h3 className="search">Search</h3>
        <div className="search-box">
          <label htmlFor="itemType"></label>
          <select
            id="itemType"
            value={selectedItemType}
            onChange={(e) => setSelectedItemType(e.target.value)}
          >
            <option value="">Select What you want</option>
            {itemTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="search-box">
          <select
            id="location"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedItemType && selectedLocation && filteredItems.length > 0 ? (
        <div className="filtered-items-list">
          <h2>Filtered Items</h2>
          <ul>
            {filteredItems.map((item) => (
              <li key={item._id}>
                <strong>Item Name:</strong> {item.itemName},{" "}
                <strong>Group:</strong> {item.group}, <strong>Quantity:</strong>{" "}
                {item.quantity}, <strong>Contact Number:</strong>{" "}
                {item.contactNumber}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <>
          {/* <h1 className="big-text">{Object.keys(groupCounts).length}</h1> */}
          <div className="row">
            {Object.entries(groupCounts).map(([group, count]) =>
              renderCard(group, count)
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
