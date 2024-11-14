// server.js

const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const { WebSocketServer } = require('ws');
const Y = require('yjs');
const { setupWSConnection } = require('y-websocket/bin/utils');
const { createChannel, sendDeleteRoomRequest } = require('./rabbit/rabbit.js')

const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

const docs = new Map();
const rooms = new Map();

wss.on('connection', (ws, req) => {
  const urlParams = new URL(req.url, `http://${req.headers.host}`).searchParams;
  const roomId = urlParams.get('room');
  const isCustom = urlParams.get('custom') === 'true';

  if (isCustom) {
    // Handle custom WebSocket connection
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { sockets: new Set(), question: null });
    }
    const room = rooms.get(roomId);
    room.sockets.add(ws);

    console.log(`Custom WebSocket client connected to room ${roomId}. Room size: ${room.sockets.size}`);

    ws.on('message', (message) => {
      try {
        const messageString = message.toString('utf8');
        const parsedMessage = JSON.parse(messageString);
        console.log('Parsed custom message:', parsedMessage);

        if (parsedMessage.type === 'SEND_QUESTION') {
          room.question = parsedMessage.question;
        } else if (parsedMessage.type === 'REQUEST_QUESTION') {
          console.log('Request question received');
          if (room.question) {
            ws.send(
              JSON.stringify({ type: 'RECEIVE_QUESTION', question: room.question })
            );
          }
        }
      } catch (error) {
        console.error('Error parsing custom message:', error);
      }
    });

    ws.on('close', async () => {
      room.sockets.delete(ws);
      console.log(`Custom WebSocket client disconnected from room ${roomId}. Room size: ${room.sockets.size}`);

      if (room.sockets.size === 0) {
        const channel = await createChannel();

        const payload = { roomId: roomId }
        sendDeleteRoomRequest(channel, Buffer.from(JSON.stringify(payload)));
        await channel.close();
        rooms.delete(roomId);
        console.log(`Custom room ${roomId} removed`);
      }
    });

    return;
  }

  // Yjs synchronization connection
  if (!docs.has(roomId)) {
    const doc = new Y.Doc();
    docs.set(roomId, doc);

    // Initialize shared types
    doc.getText('monaco');
    doc.getArray('chatMessages');
    console.log(`Created new Yjs document for room ${roomId}`);
  }

  setupWSConnection(ws, req, {
    docName: roomId,
    doc: docs.get(roomId),
    gc: true, // Enable garbage collection
  });

  ws.on('close', () => {
    // Yjs WebSocket does not need to manage room sockets; handled internally
    const doc = docs.get(roomId);

    if (wss.clients.size === 0) {
      // No clients connected to the server at all


      docs.delete(roomId);
      console.log(`Yjs document destroyed for room ${roomId}`);
    }
  });
});

httpServer.on('error', (error) => {
  console.error('Server error:', error);
});

httpServer.on('listening', () => {
  console.log(`Listening on port 4444`);
});

process.on('SIGINT', () => {
  console.log('Server shutting down...');

  docs.forEach((doc, roomId) => {
    doc.destroy();
    console.log(`Cleaned up Yjs document for room ${roomId}`);
  });

  docs.clear();
  rooms.clear();

  process.exit(0);
});

const PORT = process.env.PORT || 4444;
httpServer.listen(PORT);
