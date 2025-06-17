import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { AgentOrchestrator } from './agents/orchestrator.js';
import { DatabaseManager } from './database/manager.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Initialize database
const db = new DatabaseManager();
await db.initialize();

// Initialize agent orchestrator
const orchestrator = new AgentOrchestrator(io, db);

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('submit_query', async (data) => {
    try {
      const sessionId = await orchestrator.startResearch(data.query, socket.id);
      socket.emit('session_created', { sessionId });
    } catch (error) {
      socket.emit('error', { message: 'Failed to start research', error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 MARP Server running on port ${PORT}`);
  console.log(`📊 WebSocket endpoint: ws://localhost:${PORT}`);
});