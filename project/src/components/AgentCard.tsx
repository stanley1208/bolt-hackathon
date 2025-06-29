import { useState } from 'react';
import { 
  Search, 
  User, 
  Gavel, 
  CheckCircle, 
  Loader2, 
  Clock,
  ChevronDown,
  ChevronUp,
  Activity,
  Zap,
  Brain,
  Sparkles,
  Star
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
      return {
        bg: 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700',
        progress: 'from-blue-400 to-blue-600',
        glow: 'shadow-blue-500/30',
        accent: 'text-blue-600',
        bgAccent: 'bg-blue-50/80',
        borderAccent: 'border-blue-200/50'
      };
    case 'A2-Persona-Crafter':
      return {
        bg: 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700',
        progress: 'from-purple-400 to-purple-600',
        glow: 'shadow-purple-500/30',
        accent: 'text-purple-600',
        bgAccent: 'bg-purple-50/80',
        borderAccent: 'border-purple-200/50'
      };
    case 'A3-Judge':
      return {
        bg: 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700',
        progress: 'from-emerald-400 to-emerald-600',
        glow: 'shadow-emerald-500/30',
        accent: 'text-emerald-600',
        bgAccent: 'bg-emerald-50/80',
        borderAccent: 'border-emerald-200/50'
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700',
        progress: 'from-slate-400 to-slate-600',
        glow: 'shadow-slate-500/30',
        accent: 'text-slate-600',
        bgAccent: 'bg-slate-50/80',
        borderAccent: 'border-slate-200/50'
      };
  }
};

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'active':
      return {
        color: 'text-primary-700 bg-primary-50/80 border-primary-200/50',
        icon: Zap,
        iconColor: 'text-primary-600',
        badge: '\u{1F680}' // 🚀
      };
    case 'completed':
      return {
        color: 'text-success-700 bg-success-50/80 border-success-200/50',
        icon: CheckCircle,
        iconColor: 'text-success-600',
        badge: '\u{2728}' // ✨
      };
    default:
      return {
        color: 'text-slate-600 bg-slate-50/80 border-slate-200/50',
        icon: Clock,
        iconColor: 'text-slate-400',
        badge: '\u{23F8}\u{FE0F}' // ⏸️
      };
  }
};

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const [expanded, setExpanded] = useState(false);
  const AgentIcon = getAgentIcon(agent.name);
  const agentColors = getAgentColor(agent.name);
  const statusInfo = getStatusInfo(agent.status);
  const StatusIcon = statusInfo.icon;

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="card-premium rounded-3xl shadow-2xl border border-white/40 overflow-hidden card-hover neon-glow">
      {/* Header */}
      <div className="p-8 bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-2xl border-b border-white/30">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-5">
            <div className="relative group">
              <div className={`absolute inset-0 ${agentColors.bg.replace('bg-', 'bg-').replace('from-', 'from-').replace('to-', 'to-')} rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300`}></div>
              <div className={`relative flex items-center justify-center w-16 h-16 ${agentColors.bg} rounded-2xl shadow-2xl ${agentColors.glow} neon-glow`}>
                <AgentIcon className="w-8 h-8 text-white drop-shadow-lg" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"></div>
              </div>
              {agent.status === 'active' && (
                <div className="absolute -top-2 -right-2 flex items-center justify-center">
                  <div className="w-4 h-4 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full pulse-glow">
                    <div className="w-full h-full bg-primary-300 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <Sparkles className="absolute w-2 h-2 text-white animate-pulse" />
                </div>
              )}
              {agent.status === 'completed' && (
                <div className="absolute -top-2 -right-2">
                  <Star className="w-5 h-5 text-success-500 drop-shadow-lg" fill="currentColor" />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-xl gradient-text">{agent.displayName}</h3>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {agent.status === 'active' && <Loader2 className="w-6 h-6 text-primary-600 animate-spin pulse-glow" />}
            <div className={`flex items-center space-x-2 px-4 py-2 text-sm font-bold rounded-2xl border backdrop-blur-sm ${statusInfo.color}`}>
              <span className="text-lg emoji">{statusInfo.badge}</span>
              <StatusIcon className={`w-4 h-4 ${statusInfo.iconColor}`} />
              <span className="capitalize">{agent.status}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-slate-600 font-bold flex items-center space-x-2">
              <Brain className="w-4 h-4 text-primary-500" />
              <span>Progress</span>
            </span>
            <span className="text-slate-900 font-bold text-2xl">{agent.progress}%</span>
          </div>
          <div className="relative w-full bg-slate-200/50 rounded-full h-4 overflow-hidden backdrop-blur-sm">
            <div 
              className={`h-full rounded-full transition-all duration-700 ease-out bg-gradient-to-r ${
                agent.status === 'completed' ? 'from-success-400 to-success-600' : 
                agent.status === 'active' ? agentColors.progress : 'from-slate-300 to-slate-400'
              } ${agent.status === 'active' ? 'progress-glow' : ''}`}
              style={{ width: `${agent.progress}%` }}
            />
            {agent.status === 'active' && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            )}
          </div>
        </div>

        {/* Current Activity */}
        <div className={`${agentColors.bgAccent} rounded-2xl p-5 backdrop-blur-sm border ${agentColors.borderAccent} neon-glow`}>
          <div className="flex items-start space-x-3">
            <div className={`p-2 ${agentColors.bg} rounded-xl shadow-lg`}>
              <Brain className="w-5 h-5 text-white drop-shadow-sm" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-700 leading-relaxed font-semibold">{agent.currentActivity}</p>
              {agent.status === 'active' && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">Processing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      {agent.activities.length > 0 && (
        <div className="border-t border-white/30">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-8 py-5 flex items-center justify-between text-sm font-bold text-slate-700 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm"
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 ${agentColors.bg} rounded-xl shadow-lg`}>
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span>Activity Log ({agent.activities.length})</span>
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(agent.activities.length, 5) }).map((_, i) => (
                  <div key={i} className={`w-2 h-2 ${agentColors.bg} rounded-full opacity-60`}></div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 font-medium">
                {expanded ? 'Hide' : 'Show'} Details
              </span>
              {expanded ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>
          
          {expanded && (
            <div className="px-8 pb-6 max-h-80 overflow-y-auto bg-white/20 backdrop-blur-sm">
              <div className="space-y-4">
                {agent.activities.slice(-10).reverse().map((activity, index) => (
                  <div key={index} className="card-premium p-4 rounded-2xl border border-white/40 backdrop-blur-sm neon-glow">
                    <div className="flex items-start space-x-4">
                      <div className={`w-3 h-3 ${agentColors.bg} rounded-full mt-2 flex-shrink-0 pulse-glow`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-500 font-mono bg-slate-100/80 px-3 py-1 rounded-full backdrop-blur-sm">
                            {formatTimestamp(activity.timestamp)}
                          </span>
                          <span className={`text-xs uppercase tracking-wide font-bold px-2 py-1 rounded-full ${agentColors.bgAccent} ${agentColors.accent}`}>
                            {activity.type}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed font-medium">
                          {activity.message}
                        </p>
                      </div>
                    </div>
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