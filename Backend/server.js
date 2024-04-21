const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./src/routes/routes');
const mongoose = require("./src/connectors/dbConnector")
const app = express();

global.ErrorCodes = require('./src/constant/errorCodes')

const port = 4000;

// Enable CORS
app.use(cors());

app.use(bodyParser.json())
app.use((req, res, next) => {
  console.dir({ url: req.url }, { depth: null });
  console.dir({ params: req.params }, { depth: null });
  console.dir({ query: req.query }, { depth: null });
  console.dir({ body: req.body }, { depth: null });
  next();
})
app.use(routes)
app.all('*', (req, res) => {
  res.status(404).send({ code: "Note-Found", message: "Not Found" })
})
app.listen(port, async () => {
  console.info(`API is listening on port ${port}`);
});

module.exports = app;
