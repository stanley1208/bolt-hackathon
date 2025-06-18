import { v4 as uuidv4 } from 'uuid';
import { ResearcherAgent } from './researcher.js';
import { PersonaCrafterAgent } from './persona-crafter.js';
import { JudgeAgent } from './judge.js';

export class AgentOrchestrator {
  constructor(io, db) {
    this.io = io;
    this.db = db;
    this.activeSessions = new Map();
    
    // Initialize agents
    this.researcher = new ResearcherAgent(this);
    this.personaCrafter = new PersonaCrafterAgent(this);
    this.judge = new JudgeAgent(this);
  }

  async startResearch(query, socketId) {
    const sessionId = uuidv4();
    
    // Store session
    await this.db.createSession(sessionId, query);
    this.activeSessions.set(sessionId, {
      query,
      socketId,
      status: 'active',
      startTime: Date.now(),
      researchData: null // Store research data for final verdict
    });

    console.log(`🔬 Starting research session: ${sessionId}`);
    
    // Start the agent workflow
    this.executeAgentWorkflow(sessionId, query);
    
    return sessionId;
  }

  async executeAgentWorkflow(sessionId, query) {
    try {
      const session = this.activeSessions.get(sessionId);
      if (!session) throw new Error('Session not found');

      // Phase 1: Parallel execution of Researcher and Persona-Crafter
      this.broadcastUpdate(session.socketId, {
        type: 'workflow_started',
        sessionId,
        message: 'Initializing deep research analysis with Perplexity AI...'
      });

      const [researchResults, evaluationFramework] = await Promise.all([
        this.researcher.analyze(sessionId, query),
        this.personaCrafter.createFramework(sessionId, query)
      ]);

      // Store research data in session for final verdict
      session.researchData = researchResults;

      // Phase 2: Judge evaluation with research data
      const finalVerdict = await this.judge.evaluate(
        sessionId, 
        query, 
        researchResults, 
        evaluationFramework
      );

      // Embed research data in final verdict
      finalVerdict.researchData = researchResults;
      finalVerdict.sessionId = sessionId;

      // Complete session
      await this.db.completeSession(sessionId);
      this.broadcastUpdate(session.socketId, {
        type: 'workflow_completed',
        sessionId,
        finalVerdict,
        message: 'Deep research analysis completed successfully!'
      });

      this.activeSessions.delete(sessionId);
      console.log(`✅ Research session completed: ${sessionId}`);

    } catch (error) {
      console.error(`❌ Workflow error for session ${sessionId}:`, error);
      const session = this.activeSessions.get(sessionId);
      if (session) {
        this.broadcastUpdate(session.socketId, {
          type: 'workflow_error',
          sessionId,
          error: error.message,
          message: 'Research workflow encountered an error. Please try again.'
        });
      }
      
      // Clean up session
      this.activeSessions.delete(sessionId);
    }
  }

  broadcastUpdate(socketId, data) {
    this.io.to(socketId).emit('agent_update', data);
    console.log(`📡 Broadcasting update to ${socketId}:`, {
      type: data.type,
      agent: data.agent,
      activity: data.activity,
      message: data.message?.substring(0, 100) + '...'
    });
  }

  async logActivity(sessionId, agentName, activityType, message, metadata = null) {
    try {
    await this.db.logActivity(sessionId, agentName, activityType, message, metadata);
    
    const session = this.activeSessions.get(sessionId);
    if (session) {
      this.broadcastUpdate(session.socketId, {
        type: 'agent_activity',
        sessionId,
        agent: agentName,
        activity: activityType,
        message,
        metadata,
        timestamp: Date.now()
      });
      }
    } catch (error) {
      console.error(`Failed to log activity for session ${sessionId}:`, error);
    }
  }

  async saveResult(sessionId, agentName, resultType, content, score = null, confidence = null) {
    try {
    await this.db.saveResult(sessionId, agentName, resultType, content, score, confidence);
    } catch (error) {
      console.error(`Failed to save result for session ${sessionId}:`, error);
    }
  }

  // Graceful shutdown
  async shutdown() {
    console.log('🔄 Shutting down orchestrator...');
    
    // Notify all active sessions
    for (const [sessionId, session] of this.activeSessions) {
      this.broadcastUpdate(session.socketId, {
        type: 'server_shutdown',
        sessionId,
        message: 'Server is shutting down. Please refresh and try again.'
      });
    }
    
    this.activeSessions.clear();
    console.log('✅ Orchestrator shutdown complete');
  }
}