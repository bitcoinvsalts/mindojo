import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { google } from "googleapis";

const app = express();
const port = process.env.PORT || 3001;
const apiKey = process.env.GOOGLE_API_KEY;
const spreadsheetId = process.env.SPREADSHEET_ID;

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
  const sheetId = req.params.id; // Retrieve the ID from the URL parameter
  try {
    const sheets = google.sheets({ version: "v4", auth: apiKey });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetId, // Use the ID directly as the range
    });

    const data = response.data.values;
    if (data.length === 0) {
      res.status(404).send("No data found in the specified sheet");
    } else {
      res.status(200).json(data);
    }
  } catch (error) {
    console.error(
      `Error accessing Google Sheets API for sheet ${sheetId}: ${error}`
    );
    res.status(500).send("Failed to retrieve data from the specified sheet");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
