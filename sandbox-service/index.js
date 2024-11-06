const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { WebSocketServer } = require('ws');
const sandboxRouter = require('./routes/sandboxRoutes')

/**
 * Server INITIALIZATION and CONFIGURATION
 * CORS configuration
 * Request body parsing
 */
const app = express();
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());
app.use(express.json());

const PORT_SANDBOX = process.env.PORT_SANDBOX;

app.listen(PORT_SANDBOX, () => {
  console.log(`Server is running on port ${PORT_SANDBOX}`)
})

app.use('/sandbox', sandboxRouter)

module.exports = app