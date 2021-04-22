const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8135;

// ROUTES

app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.get('/favicon.ico', (req, res) => {
  res.sendStatus(200);
});

app.use((req, res) => {
  res.status(404).send('Error 404');
});

// SERVER

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${port}`);
});
