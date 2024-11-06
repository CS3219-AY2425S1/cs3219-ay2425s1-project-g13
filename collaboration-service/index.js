const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const { WebSocketServer } = require('ws');

//@ts-ignore
const setupWSConnection = require('y-websocket/bin/utils').setupWSConnection;


/**
 * Server INITIALIZATION and CONFIGURATION
 * CORS configuration
 * Request body parsing
 */
const app = express();
app.use(cors()); // config cors so that front-end can use
app.options("*", cors());
app.use(express.json());

/**
 * Initialize rabbitmq 
 */
let channel = null;


/**
 * Create an HTTP server
 */
const httpServer = createServer(app);

/**
 * Create a WebSocket server
 */
const wss = new WebSocketServer({ server: httpServer });

function onError(error) {
  console.log("Server error:", error);
}

function onListening() {
  console.log(`Listening on port 4444`);
}

httpServer.on('error', onError);
httpServer.on('listening', onListening);

const rooms = new Map();

wss.on('connection', (ws, req) => {
  const roomId = new URL(req.url, `http://${req.headers.host}`).searchParams.get('room');

  // Set up Yjs room for collaborative editing
  setupWSConnection(ws, req, { docName: roomId });

  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Set());
  }

  const room = rooms.get(roomId);
  room.add(ws);

  console.log("room size: ", room.size)

  ws.on('close', () => {
    room.delete(ws);
    
    console.log("someone left. room size: ", room.size)
    if (room.size === 0) {
      rooms.delete(roomId); // Clean up empty rooms
    }
  });
});

// Specify a port and start listening
const PORT = process.env.PORT || 4444; // Use 1234 or any other port you prefer
httpServer.listen(PORT);