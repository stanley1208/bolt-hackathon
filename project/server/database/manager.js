import sqlite3 from 'sqlite3';
import { promisify } from 'util';

export class DatabaseManager {
  constructor() {
    this.db = new sqlite3.Database(':memory:'); // Use memory database for demo
    this.run = promisify(this.db.run.bind(this.db));
    this.get = promisify(this.db.get.bind(this.db));
    this.all = promisify(this.db.all.bind(this.db));
  }

  async initialize() {
    try {
      // Create sessions table
      await this.run(`
        CREATE TABLE IF NOT EXISTS sessions (
          id TEXT PRIMARY KEY,
          query TEXT NOT NULL,
          status TEXT DEFAULT 'active',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          completed_at DATETIME NULL
        )
      `);

      // Create agent_activities table
      await this.run(`
        CREATE TABLE IF NOT EXISTS agent_activities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id TEXT,
          agent_name TEXT,
          activity_type TEXT,
          message TEXT,
          metadata TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (session_id) REFERENCES sessions (id)
        )
      `);

      // Create results table
      await this.run(`
        CREATE TABLE IF NOT EXISTS results (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          session_id TEXT,
          agent_name TEXT,
          result_type TEXT,
          content TEXT,
          score INTEGER,
          confidence REAL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (session_id) REFERENCES sessions (id)
        )
      `);

      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  async createSession(sessionId, query) {
    return await this.run(
      'INSERT INTO sessions (id, query) VALUES (?, ?)',
      [sessionId, query]
    );
  }

  async logActivity(sessionId, agentName, activityType, message, metadata = null) {
    return await this.run(
      'INSERT INTO agent_activities (session_id, agent_name, activity_type, message, metadata) VALUES (?, ?, ?, ?, ?)',
      [sessionId, agentName, activityType, message, JSON.stringify(metadata)]
    );
  }

  async saveResult(sessionId, agentName, resultType, content, score = null, confidence = null) {
    return await this.run(
      'INSERT INTO results (session_id, agent_name, result_type, content, score, confidence) VALUES (?, ?, ?, ?, ?, ?)',
      [sessionId, agentName, resultType, JSON.stringify(content), score, confidence]
    );
  }

  async getSessionResults(sessionId) {
    return await this.all(
      'SELECT * FROM results WHERE session_id = ? ORDER BY timestamp ASC',
      [sessionId]
    );
  }

  async completeSession(sessionId) {
    return await this.run(
      'UPDATE sessions SET status = "completed", completed_at = CURRENT_TIMESTAMP WHERE id = ?',
      [sessionId]
    );
  }
}