const grid = [
  [1, 2],
  [2, 1],
];

function canWaterFlow(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const reachedNW = Array.from({ length: rows }, () => Array(cols).fill("F"));
  const reachedSE = Array.from({ length: rows }, () => Array(cols).fill("F"));

  // Helper function to check within bounds and elevation criteria
  function canFlow(x, y, prevHeight) {
    return x >= 0 && x < rows && y >= 0 && y < cols && grid[x][y] >= prevHeight;
  }

  // Generalized BFS to find reachable cells
  function bfs(startX, startY, reached) {
    const queue = [[startX, startY]];
    reached[startX][startY] = "T";

    while (queue.length > 0) {
      const [x, y] = queue.shift();
      const directions = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
      ]; // Down, Right, Up, Left

      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (canFlow(newX, newY, grid[x][y]) && reached[newX][newY] === "F") {
          reached[newX][newY] = "T";
          queue.push([newX, newY]);
        }
      }
    }
  }

  // Perform BFS for NW and SE corners
  bfs(0, 0, reachedNW);
  bfs(rows - 1, cols - 1, reachedSE);

  // Combine the reached results from NW and SE to see where both are true
  const reachedBoth = reachedNW.map((row, i) =>
    row.map((val, j) => (val === "T" && reachedSE[i][j] === "T" ? "T" : "F"))
  );

  // Print results in the desired format
  console.log("NW Reachable Grid:");
  console.log(reachedNW.map((row) => row.join("")).join("\n"));
  console.log("SE Reachable Grid:");
  console.log(reachedSE.map((row) => row.join("")).join("\n"));

  console.log("Reachable by Both Oceans Grid:");
  console.log(reachedBoth.map((row) => row.join("")).join("\n"));
}

// Execute the function to display the results
canWaterFlow(grid);
