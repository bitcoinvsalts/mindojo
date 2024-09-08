import React, { useState, useEffect } from "react";
import "./App.css";
import GridDisplay from "./components/GridDisplay";

function App() {
  const [tabs, setTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState("");

  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const response = await fetch("http://localhost:3001/grids");
        console.log(response);
        const data = await response.json();
        console.log(data);
        setTabs(data);
        if (data.length > 0) {
          setSelectedTab(data[0]); // Default to the first tab
        }
      } catch (error) {
        console.error("Error fetching tabs:", error);
      }
    };

    fetchTabs();
  }, []);

  const handleTabChange = (event) => {
    setSelectedTab(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        {tabs.length > 0 && (
          <select value={selectedTab} onChange={handleTabChange}>
            {tabs.map((tab) => (
              <option key={tab} value={tab}>
                {tab}
              </option>
            ))}
          </select>
        )}
        {selectedTab && <GridDisplay tab={selectedTab} />}
      </header>
    </div>
  );
}

export default App;
