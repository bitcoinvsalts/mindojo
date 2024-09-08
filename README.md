# Water Flow Grid Analysis

This project is designed to analyze and display grid-based data showing water flow potential from two different ocean sources on a grid map. It utilizes a React frontend to display grids and an Express backend to handle data retrieval and processing from Google Sheets.

## Features

- Fetch grid setups from Google Sheets.
- Display grids with color-coded cells based on water reachability from two ocean points (NW and SE).
- Interactive grid selection from fetched Google Sheets tabs.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.x or higher recommended)
- npm (v6.x or higher)

## Installation

To install the necessary dependencies, follow these steps:

```bash
cd path/to/project
# Install backend dependencies
npm install
# Navigate to the frontend directory
cd client
# Install frontend dependencies
npm install
```

Configuration
Create a .env file in the project root with the following variables:

plaintext```
Copy code
PORT=3001
GOOGLE_API_KEY=your_google_api_key
SPREADSHEET_ID=your_spreadsheet_id

````

In the React app, create a .env file in the root of the React project with:

```plaintext
Copy code
REACT_APP_API_URL=http://localhost:3001
````

Running the Application
To run the server, execute:

```bash
Copy code
npm start
```

To run the React client (from the client directory):

```bash
Copy code
npm start
```

Usage

After starting the server and client:
Visit http://localhost:3000 in your browser.

Use the dropdown menu to select different grid scenarios loaded from Google Sheets.
View the color-coded grid representing water flow reachability.

License
This project is licensed under the MIT License - see the LICENSE.md file for details.

```

```
