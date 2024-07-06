const { google } = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3500;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load the service account key JSON file
const keyFilePath = path.join(__dirname, 'credentials.json');
const serviceAccount = require(keyFilePath);

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
const spreadsheetId = '1patB3L1uPYwRX_Jn6dUSE9h65NbfEfLcDv8nLJEfA1s';

function getCurrentWeekAndYear() {
  const date = new Date();
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const pastDaysOfYear = (date - startOfYear) / 86400000;
  const week = Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  return `${year}-${week < 10 ? '0' + week : week}`;
}


app.post('/addToSheet2', async (req, res) => {
  const { Mån, Tis, Ons, Tors, Fre, Lör, Sön, Schema } = req.body;
  console.log('Received request to add new record to Sheet2:', req.body);

  const weekYearHeader = getCurrentWeekAndYear();
  const values = [
    [weekYearHeader, Mån, Tis, Ons, Tors, Fre, Lör, Sön, Schema]
  ];

  try {
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet2!A:I', // Adjust range to include all columns
      valueInputOption: 'RAW',
      resource: {
        values,
      },
    });

    res.status(200).send(appendResponse.data);
  } catch (error) {
    console.error('Error adding new record to Sheet2:', error);
    res.status(500).send('Error adding new record to Sheet2');
  }
});
// Route to update a row in Sheet1 based on the date
app.post('/update', async (req, res) => {
  const { datum, values } = req.body;

  try {
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A2:G',
    });

    const rows = getResponse.data.values;
    let rowIndex = -1;
    rows.forEach((row, index) => {
      if (row[0] === datum) {
        rowIndex = index + 2;
      }
    });

    if (rowIndex === -1) {
      console.error('Date not found');
      return res.status(404).send('Date not found');
    }

    const updateResponse = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Sheet1!A${rowIndex}:G${rowIndex}`,
      valueInputOption: 'RAW',
      resource: {
        values: [values],
      },
    });

    res.status(200).send(updateResponse.data);
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).send('Error updating data');
  }
});
// Route to get a row by date from Sheet1
app.post('/getRowByDate', async (req, res) => {
  const { datum } = req.body;
  console.log('Received request for date:', datum);

  try {
    const getResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!A2:G',
    });

    const rows = getResponse.data.values;
    let rowIndex = -1;
    let rowData = [];
    rows.forEach((row, index) => {
      if (row[0] === datum) {
        rowIndex = index + 2;
        rowData = row;
      }
    });

    if (rowIndex === -1) {
      console.error('Date not found');
      return res.status(404).send('Date not found');
    }

    console.log('Found row data:', rowData);
    res.status(200).json({ rowData });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Error fetching data');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://127.0.0.1:${port}`);
});

