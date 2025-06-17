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
      startTime: Date.now()
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
        message: 'Initializing multi-agent analysis...'
      });

      const [researchResults, evaluationFramework] = await Promise.all([
        this.researcher.analyze(sessionId, query),
        this.personaCrafter.createFramework(sessionId, query)
      ]);

      // Phase 2: Judge evaluation
      const finalVerdict = await this.judge.evaluate(
        sessionId, 
        query, 
        researchResults, 
        evaluationFramework
      );

      // Complete session
      await this.db.completeSession(sessionId);
      this.broadcastUpdate(session.socketId, {
        type: 'workflow_completed',
        sessionId,
        finalVerdict,
        message: 'Research analysis completed successfully!'
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
          error: error.message
        });
      }
    }
  }

  broadcastUpdate(socketId, data) {
    this.io.to(socketId).emit('agent_update', data);
  }

  async logActivity(sessionId, agentName, activityType, message, metadata = null) {
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
  }

  async saveResult(sessionId, agentName, resultType, content, score = null, confidence = null) {
    await this.db.saveResult(sessionId, agentName, resultType, content, score, confidence);
  }
}