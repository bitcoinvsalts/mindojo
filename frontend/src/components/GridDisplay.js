import React, { useState, useEffect } from "react";

function GridDisplay({ tab }) {
  const [gridData, setGridData] = useState([]);
  const [countBoth, setCountBoth] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/grid/${tab}`
        );
        console.log(response);
        const data = await response.json();
        setGridData(data.grid);
        setCountBoth(data.countBoth); // Set the count from the response
      } catch (error) {
        console.error("Error fetching grid data:", error);
      }
    };

    fetchData();
  }, [tab]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>Cells reachable by both oceans: {countBoth}</div>{" "}
      {/* Display the count */}
      {gridData.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: "flex" }}>
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              style={{
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                backgroundColor: cell.status.Both
                  ? "green"
                  : cell.status.NW
                  ? "blue"
                  : cell.status.SE
                  ? "yellow"
                  : "lightgray",
              }}
            >
              {cell.elevation}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export default GridDisplay;
