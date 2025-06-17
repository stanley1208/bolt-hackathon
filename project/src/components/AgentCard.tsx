import React, { useState } from 'react';
import { 
  Search, 
  User, 
  Gavel, 
  CheckCircle, 
  Loader2, 
  Clock,
  ChevronDown,
  ChevronUp,
  Activity
} from 'lucide-react';

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

interface AgentCardProps {
  agent: Agent;
}

const getAgentIcon = (agentName: string) => {
  switch (agentName) {
    case 'A1-Researcher':
      return Search;
    case 'A2-Persona-Crafter':
      return User;
    case 'A3-Judge':
      return Gavel;
    default:
      return Activity;
  }
};

const getAgentColor = (agentName: string) => {
  switch (agentName) {
    case 'A1-Researcher':
      return 'bg-blue-600';
    case 'A2-Persona-Crafter':
      return 'bg-purple-600';
    case 'A3-Judge':
      return 'bg-emerald-600';
    default:
      return 'bg-slate-600';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'text-blue-600 bg-blue-50';
    case 'completed':
      return 'text-green-600 bg-green-50';
    default:
      return 'text-slate-600 bg-slate-50';
  }
};

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const [expanded, setExpanded] = useState(false);
  const AgentIcon = getAgentIcon(agent.name);
  const agentColor = getAgentColor(agent.name);
  const statusColor = getStatusColor(agent.status);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-md">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`flex items-center justify-center w-10 h-10 ${agentColor} rounded-lg`}>
              <AgentIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{agent.displayName}</h3>
              <p className="text-sm text-slate-500">{agent.name}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {agent.status === 'active' && <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />}
            {agent.status === 'completed' && <CheckCircle className="w-4 h-4 text-green-600" />}
            {agent.status === 'idle' && <Clock className="w-4 h-4 text-slate-400" />}
            
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColor} capitalize`}>
              {agent.status}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-slate-600">Progress</span>
            <span className="text-slate-900 font-medium">{agent.progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ease-out ${
                agent.status === 'completed' ? 'bg-green-500' : 
                agent.status === 'active' ? 'bg-blue-500' : 'bg-slate-300'
              }`}
              style={{ width: `${agent.progress}%` }}
            />
          </div>
        </div>

        {/* Current Activity */}
        <div className="text-sm">
          <p className="text-slate-700 leading-relaxed">{agent.currentActivity}</p>
        </div>
      </div>

      {/* Activity Log */}
      {agent.activities.length > 0 && (
        <div className="border-t border-slate-100">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-6 py-3 flex items-center justify-between text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span>Activity Log ({agent.activities.length})</span>
            {expanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          
          {expanded && (
            <div className="px-6 pb-4 max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {agent.activities.slice(-10).reverse().map((activity, index) => (
                  <div key={index} className="flex items-start space-x-2 text-xs">
                    <span className="text-slate-400 font-mono min-w-[60px]">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                    <span className="text-slate-600 leading-relaxed">
                      {activity.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};