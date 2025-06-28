import { v4 as uuidv4 } from 'uuid';
import { ResearcherAgent } from './researcher.js';
import { PersonaCrafterAgent } from './persona-crafter.js';
import { Judge } from './judge.js';

export class AgentOrchestrator {
  constructor(io, db) {
    this.io = io;
    this.db = db;
    this.activeSessions = new Map();
    
    // Initialize agents
    this.researcher = new ResearcherAgent(this);
    this.personaCrafter = new PersonaCrafterAgent(this);
    this.judge = new Judge();
  }

  async startResearch(query, socketId) {
    const sessionId = uuidv4();
    
    // Store session with enhanced metadata
    await this.db.createSession(sessionId, query);
    this.activeSessions.set(sessionId, {
      query,
      socketId,
      status: 'active',
      startTime: Date.now(),
      researchData: null,
      evaluationFramework: null,
      queryAnalysis: null // Store query analysis for enhanced tracking
    });

    console.log(`Starting enhanced research session: ${sessionId}`);
    
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
        message: 'Initializing enhanced materials science research analysis...'
      });

      const [researchResults, evaluationFramework] = await Promise.all([
        this.researcher.analyze(sessionId, query),
        this.personaCrafter.createFramework(sessionId, query)
      ]);

      // Store enhanced data in session
      session.researchData = researchResults;
      session.evaluationFramework = evaluationFramework;
      session.queryAnalysis = evaluationFramework.queryAnalysis;

      // Broadcast framework creation completion
      this.broadcastUpdate(session.socketId, {
        type: 'framework_created',
        sessionId,
        framework: {
          queryType: evaluationFramework.queryType,
          relevantCategories: evaluationFramework.relevantCategories,
          confidence: evaluationFramework.confidence,
          judgePersona: evaluationFramework.judgePersona.title
        },
        message: `Evaluation framework created with ${evaluationFramework.confidence * 100}% confidence for ${evaluationFramework.queryType} domain`
      });

      // Phase 2: Judge evaluation with enhanced research data
      const finalVerdict = await this.judge.evaluateResearch(
        query, 
        researchResults, 
        evaluationFramework,
        evaluationFramework.judgePersona
      );

      // Embed enhanced data in final verdict
      finalVerdict.researchData = researchResults;
      finalVerdict.evaluationFramework = evaluationFramework;
      finalVerdict.sessionId = sessionId;

      // Complete session with enhanced results
      await this.db.completeSession(sessionId);
      this.broadcastUpdate(session.socketId, {
        type: 'workflow_completed',
        sessionId,
        finalVerdict,
        message: `Enhanced materials science research analysis completed! Overall score: ${finalVerdict.overallScore}/100`
      });

      this.activeSessions.delete(sessionId);
      console.log(`Enhanced research session completed: ${sessionId}`);

    } catch (error) {
      console.error(`Enhanced workflow error for session ${sessionId}:`, error);
      const session = this.activeSessions.get(sessionId);
      if (session) {
        this.broadcastUpdate(session.socketId, {
          type: 'workflow_error',
          sessionId,
          error: error.message,
          message: 'Enhanced research workflow encountered an error. Please try again.'
        });
      }
      
      // Clean up session
      this.activeSessions.delete(sessionId);
    }
  }

  broadcastUpdate(socketId, data) {
    this.io.to(socketId).emit('agent_update', data);
    
    // Enhanced logging with better formatting
    const logData = {
      type: data.type,
      agent: data.agent,
      activity: data.activity,
      message: data.message?.substring(0, 100) + (data.message?.length > 100 ? '...' : ''),
      timestamp: new Date().toISOString()
    };

    // Add framework info if available
    if (data.framework) {
      logData.framework = {
        queryType: data.framework.queryType,
        confidence: data.framework.confidence,
        judgePersona: data.framework.judgePersona
      };
    }

    console.log(`Enhanced broadcast to ${socketId}:`, logData);
  }

  async logActivity(sessionId, agentName, activityType, message, metadata = null) {
    try {
      await this.db.logActivity(sessionId, agentName, activityType, message, metadata);
      
      const session = this.activeSessions.get(sessionId);
      if (session) {
        // Enhanced activity logging with context
        const enhancedMetadata = {
          ...metadata,
          timestamp: Date.now(),
          sessionDuration: Date.now() - session.startTime
        };

        this.broadcastUpdate(session.socketId, {
          type: 'agent_activity',
          sessionId,
          agent: agentName,
          activity: activityType,
          message,
          metadata: enhancedMetadata,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error(`Failed to log enhanced activity for session ${sessionId}:`, error);
    }
  }

  async saveResult(sessionId, agentName, resultType, content, score = null, confidence = null) {
    try {
      // Enhanced result saving with additional metadata
      const enhancedContent = {
        ...content,
        savedAt: new Date().toISOString(),
        agentVersion: 'enhanced'
      };

      await this.db.saveResult(sessionId, agentName, resultType, enhancedContent, score, confidence);
      
      // Log successful result saving
      console.log(`Enhanced result saved for session ${sessionId}, agent ${agentName}, type ${resultType}`);
    } catch (error) {
      console.error(`Failed to save enhanced result for session ${sessionId}:`, error);
    }
  }

  // Graceful shutdown
  async shutdown() {
    console.log('Shutting down orchestrator...');
    
    // Notify all active sessions
    for (const [sessionId, session] of this.activeSessions) {
      this.broadcastUpdate(session.socketId, {
        type: 'server_shutdown',
        sessionId,
        message: 'Server is shutting down. Please refresh and try again.'
      });
    }
    
    this.activeSessions.clear();
    console.log('Orchestrator shutdown complete');
  }
}