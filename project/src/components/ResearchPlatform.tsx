import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { QueryForm } from './QueryForm';
import { AgentDashboard } from './AgentDashboard';
import { ResultsDisplay } from './ResultsDisplay';
import { Header } from './Header';
import { Search, Loader2 } from 'lucide-react';

interface AgentUpdate {
  type: string;
  sessionId?: string;
  agent?: string;
  activity?: string;
  message: string;
  metadata?: any;
  timestamp?: number;
  finalVerdict?: any;
  error?: string;
  framework?: {
    queryType: string;
    relevantCategories: string[];
    confidence: number;
    judgePersona: string;
  };
}

interface Agent {
  name: string;
  displayName: string;
  status: 'idle' | 'active' | 'completed';
  currentActivity: string;
  progress: number;
  activities: Array<{
    message: string;
    timestamp: number;
    type: string;
  }>;
}

export const ResearchPlatform: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [agents, setAgents] = useState<Agent[]>([
    {
      name: 'A1-Researcher',
      displayName: 'Researcher',
      status: 'idle',
      currentActivity: 'Waiting for query...',
      progress: 0,
      activities: []
    },
    {
      name: 'A2-Persona-Crafter',
      displayName: 'Persona Crafter',
      status: 'idle',
      currentActivity: 'Waiting for query...',
      progress: 0,
      activities: []
    },
    {
      name: 'A3-Judge',
      displayName: 'Judge',
      status: 'idle',
      currentActivity: 'Waiting for analysis...',
      progress: 0,
      activities: []
    }
  ]);
  const [finalResults, setFinalResults] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    
    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to MSRP server');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from MSRP server');
    });

    newSocket.on('session_created', (data) => {
      setSessionId(data.sessionId);
      setIsProcessing(true);
    });

    newSocket.on('agent_update', (update: AgentUpdate) => {
      handleAgentUpdate(update);
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      setIsProcessing(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleAgentUpdate = (update: AgentUpdate) => {
    console.log('Agent update:', update);

    if (update.type === 'workflow_started') {
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: ['A1-Researcher', 'A2-Persona-Crafter'].includes(agent.name) ? 'active' : 'idle',
        currentActivity: ['A1-Researcher', 'A2-Persona-Crafter'].includes(agent.name) 
          ? 'Starting enhanced analysis...' 
          : 'Waiting for analysis...',
        progress: 0,
        activities: []
      })));
    }

    if (update.type === 'framework_created' && update.framework) {
      setAgents(prev => prev.map(agent => {
        if (agent.name === 'A2-Persona-Crafter') {
          return {
            ...agent,
            status: 'active',
            currentActivity: `Framework created: ${update.framework.queryType} (${Math.round(update.framework.confidence * 100)}% confidence)`,
            progress: 50,
            activities: [...agent.activities, {
              message: `Created evaluation framework for ${update.framework.queryType} domain with ${update.framework.judgePersona}`,
              timestamp: update.timestamp || Date.now(),
              type: 'framework_creation'
            }]
          };
        }
        return agent;
      }));
    }

    if (update.type === 'agent_activity' && update.agent) {
      setAgents(prev => prev.map(agent => {
        if (agent.name === update.agent) {
          const newActivity = {
            message: update.message,
            timestamp: update.timestamp || Date.now(),
            type: update.activity || 'info'
          };

          let newProgress = agent.progress;
          if (update.activity === 'completion') {
            newProgress = 100;
          } else if (update.metadata?.phase && update.metadata?.total) {
            newProgress = Math.round((update.metadata.phase / update.metadata.total) * 100);
          } else {
            newProgress = Math.min(90, agent.progress + 15);
          }

          return {
            ...agent,
            status: update.activity === 'completion' ? 'completed' : 'active',
            currentActivity: update.message,
            progress: newProgress,
            activities: [...agent.activities, newActivity]
          };
        }
        return agent;
      }));

      // Start judge when both researcher and persona-crafter complete
      if (update.activity === 'completion' && 
          ['A1-Researcher', 'A2-Persona-Crafter'].includes(update.agent!)) {
        const completedAgents = agents.filter(a => 
          ['A1-Researcher', 'A2-Persona-Crafter'].includes(a.name) && a.status === 'completed'
        ).length;
        
        if (completedAgents === 1) { // This is the second one completing
          setTimeout(() => {
            setAgents(prev => prev.map(agent => 
              agent.name === 'A3-Judge' 
                ? { ...agent, status: 'active', currentActivity: 'Starting evaluation...', progress: 5 }
                : agent
            ));
          }, 500);
        }
      }
    }

    if (update.type === 'workflow_completed' && update.finalVerdict) {
      setFinalResults(update.finalVerdict);
      setIsProcessing(false);
      
      setAgents(prev => prev.map(agent => ({
        ...agent,
        status: 'completed',
        progress: 100,
        currentActivity: agent.name === 'A3-Judge' 
          ? 'Evaluation completed successfully!' 
          : agent.currentActivity
      })));
    }

    if (update.type === 'workflow_error') {
      setIsProcessing(false);
      console.error('Workflow error:', update.error);
    }

    if (update.activity === 'evaluation_started') {
      setAgents(prev => prev.map(agent => 
        agent.name === 'Judge' 
          ? { ...agent, status: 'active', currentActivity: 'Starting evaluation...', progress: 5 }
          : agent
      ));
    } else if (update.activity === 'evaluation_complete') {
      setAgents(prev => prev.map(agent => 
        agent.name === 'Judge' 
          ? { ...agent, status: 'completed', currentActivity: 'Evaluation completed successfully!', progress: 100 }
          : agent
      ));
    }
  };

  const handleQuerySubmit = (newQuery: string) => {
    if (!socket || !connected) return;

    setQuery(newQuery);
    setFinalResults(null);
    setSessionId(null);
    
    // Reset agents
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: 'idle',
      currentActivity: 'Waiting for query...',
      progress: 0,
      activities: []
    })));

    socket.emit('submit_query', { query: newQuery });
  };

  const resetPlatform = () => {
    setQuery('');
    setFinalResults(null);
    setSessionId(null);
    setIsProcessing(false);
    
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: 'idle',
      currentActivity: 'Waiting for query...',
      progress: 0,
      activities: []
    })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header connected={connected} />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Query Form */}
        <div className="mb-8">
          <QueryForm 
            onSubmit={handleQuerySubmit} 
            disabled={!connected || isProcessing}
          />
        </div>

        {/* Current Query Display */}
        {query && (
          <div className="mb-8 glass-effect rounded-2xl shadow-xl border border-white/30 p-8 card-hover">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl shadow-lg">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-3">Materials Science Research Query</h3>
                <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm border border-white/20 mb-4">
                  <p className="text-slate-700 leading-relaxed font-medium">{query}</p>
                </div>
                {sessionId && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-500">Session ID:</span>
                    <code className="text-sm text-slate-700 bg-slate-100 px-2 py-1 rounded font-mono">{sessionId}</code>
                  </div>
                )}
              </div>
              {isProcessing && (
                <div className="p-2">
                  <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Agent Dashboard */}
        {query && (
          <div className="mb-8">
            <AgentDashboard agents={agents} />
          </div>
        )}

        {/* Results Display */}
        {finalResults && (
          <div className="mb-8">
            <ResultsDisplay 
              results={finalResults} 
              query={query}
              onReset={resetPlatform}
            />
          </div>
        )}
      </div>
    </div>
  );
};