import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { google } from "googleapis";

const app = express();
const port = process.env.PORT || 3001;
const apiKey = process.env.GOOGLE_API_KEY;
const spreadsheetId = process.env.SPREADSHEET_ID;

/////////////////////

function canWaterFlow(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const reachedNW = Array.from({ length: rows }, () => Array(cols).fill(false));
  const reachedSE = Array.from({ length: rows }, () => Array(cols).fill(false));

  function canFlow(x, y, prevHeight) {
    return x >= 0 && x < rows && y >= 0 && y < cols && grid[x][y] >= prevHeight;
  }

  function bfs(startX, startY, reached) {
    const queue = [[startX, startY]];
    reached[startX][startY] = true;

    while (queue.length > 0) {
      const [x, y] = queue.shift();
      const directions = [
        [1, 0],
        [0, 1],
        [-1, 0],
        [0, -1],
      ];
      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (canFlow(newX, newY, grid[x][y]) && !reached[newX][newY]) {
          reached[newX][newY] = true;
          queue.push([newX, newY]);
        }
      }
    }
  }

  bfs(0, 0, reachedNW);
  bfs(rows - 1, cols - 1, reachedSE);

  return grid.map((row, i) =>
    row.map((elevation, j) => ({
      elevation: elevation,
      status: {
        NW: reachedNW[i][j],
        SE: reachedSE[i][j],
        Both: reachedNW[i][j] && reachedSE[i][j],
      },
    }))
  );
}

/////////////////////

app.get("/grids", async (req, res) => {
  try {
    const sheets = google.sheets({ version: "v4", auth: apiKey });
    const response = await sheets.spreadsheets.get({
      spreadsheetId,
      fields: "sheets.properties",
    });

    const tabs = response.data.sheets.map((sheet) => sheet.properties.title);
    res.status(200).json(tabs);
  } catch (error) {
    console.error(`Error accessing Google Sheets API: ${error}`);
    res.status(500).send("Failed to retrieve data from Google Sheets");
  }
});

// Endpoint to get the content of a specific tab
app.get("/grid/:id", async (req, res) => {
  const sheetName = req.params.id;
  try {
    const sheets = google.sheets({ version: "v4", auth: apiKey });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}`, // Assuming the range specifies a tab name
    });

    const values = response.data.values;
    if (!values || values.length === 0) {
      res.status(404).send("No data found in the specified sheet");
      return;
    }

    // Convert all entries to numbers for the water flow algorithm
    const grid = values.map((row) => row.map(Number));
    const detailedResults = canWaterFlow(grid);

    res.status(200).json(detailedResults);
  } catch (error) {
    console.error(
      `Error accessing Google Sheets API for sheet ${sheetName}: ${error}`
    );
    res.status(500).send("Failed to retrieve data from the specified sheet");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
