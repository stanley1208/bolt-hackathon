import React, { useState, useEffect } from 'react';
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
      displayName: 'Persona-Crafter',
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
      console.log('Connected to MARP server');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from MARP server');
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
          ? 'Starting analysis...' 
          : 'Waiting for analysis...',
        progress: 0,
        activities: []
      })));
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
        progress: 100
      })));
    }

    if (update.type === 'workflow_error') {
      setIsProcessing(false);
      console.error('Workflow error:', update.error);
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
        {/* Connection Status */}
        <div className="mb-6 flex items-center justify-center">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${
            connected 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <span>{connected ? 'Connected to MARP Server' : 'Disconnected from Server'}</span>
          </div>
        </div>

        {/* Query Form */}
        <div className="mb-8">
          <QueryForm 
            onSubmit={handleQuerySubmit} 
            disabled={!connected || isProcessing}
          />
        </div>

        {/* Current Query Display */}
        {query && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-start space-x-3">
              <Search className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Research Query</h3>
                <p className="text-slate-700 leading-relaxed">{query}</p>
                {sessionId && (
                  <p className="text-sm text-slate-500 mt-2">Session ID: {sessionId}</p>
                )}
              </div>
              {isProcessing && (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
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