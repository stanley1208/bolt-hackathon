import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { AgentOrchestrator } from './agents/orchestrator.js';
import { DatabaseManager } from './database/manager.js';
import { config } from '../config.js';

// Debug environment variables
console.log('Environment Debug:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PERPLEXITY_API_KEY exists:', !!process.env.PERPLEXITY_API_KEY);
console.log('- PERPLEXITY_API_KEY length:', process.env.PERPLEXITY_API_KEY?.length || 0);
console.log('- Config Perplexity API Key:', config.perplexity.apiKey.substring(0, 10) + '...');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.server.corsOrigin,
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
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '2.0.0-materials-science',
    perplexityConfigured: config.perplexity.apiKey !== 'your_perplexity_api_key_here',
    deepResearchEnabled: config.agents.deepResearch
  });
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('submit_query', async (data) => {
    try {
      const sessionId = await orchestrator.startResearch(data.query, socket.id);
      socket.emit('session_created', { sessionId });
    } catch (error) {
      console.error('Query submission error:', error);
      socket.emit('error', { message: 'Failed to start research', error: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = config.server.port;
server.listen(PORT, () => {
  console.log(`MARP Server running on port ${PORT}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}`);
  console.log(`Deep Research Mode: ${config.agents.deepResearch ? 'ENABLED' : 'DISABLED'}`);
  console.log(`Perplexity API: ${config.perplexity.apiKey !== 'your_perplexity_api_key_here' ? 'CONFIGURED' : 'NOT CONFIGURED'}`);
});