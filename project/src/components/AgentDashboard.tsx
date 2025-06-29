import { AgentCard } from './AgentCard';
import { Users, Zap, Sparkles, Brain, TrendingUp } from 'lucide-react';

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

interface AgentDashboardProps {
  agents: Agent[];
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ agents }) => {
  const activeAgents = agents.filter(agent => agent.status === 'active').length;
  const completedAgents = agents.filter(agent => agent.status === 'completed').length;
  const totalProgress = Math.round(agents.reduce((sum, agent) => sum + agent.progress, 0) / agents.length);
  
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Dashboard Header */}
      <div className="text-center">
        <div className="relative inline-flex items-center space-x-5 mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-secondary-500/20 rounded-3xl blur-2xl"></div>
          <div className="relative p-4 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 rounded-3xl shadow-2xl neon-glow">
            <Users className="w-8 h-8 text-white drop-shadow-lg" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
          </div>
          <div className="text-left space-y-2">
            <h2 className="text-4xl font-bold gradient-text text-glow">Agent Dashboard</h2>
            <p className="text-slate-600 font-semibold text-lg flex items-center space-x-2">
              <Brain className="w-5 h-5 text-primary-500" />
              <span>Real-time multi-agent research monitoring</span>
            </p>
          </div>
        </div>
        
        {/* Enhanced Status Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card-premium p-6 rounded-2xl backdrop-blur-sm border border-white/40 neon-glow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-4 h-4 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full pulse-glow"></div>
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Active</span>
            </div>
            <div className="text-3xl font-bold text-primary-700">{activeAgents}</div>
            <div className="text-xs text-slate-500 font-medium">🚀 Agents Working</div>
          </div>
          
          <div className="card-premium p-6 rounded-2xl backdrop-blur-sm border border-white/40 neon-glow">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-4 h-4 bg-gradient-to-r from-success-400 to-success-600 rounded-full pulse-glow"></div>
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Completed</span>
            </div>
            <div className="text-3xl font-bold text-success-700">{completedAgents}</div>
            <div className="text-xs text-slate-500 font-medium">✨ Tasks Finished</div>
          </div>
          
          <div className="card-premium p-6 rounded-2xl backdrop-blur-sm border border-white/40 neon-glow">
            <div className="flex items-center space-x-3 mb-3">
              <TrendingUp className="w-4 h-4 text-secondary-500" />
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">Progress</span>
            </div>
            <div className="text-3xl font-bold text-secondary-700">{totalProgress}%</div>
            <div className="text-xs text-slate-500 font-medium">📊 Overall Progress</div>
          </div>
          
          <div className="card-premium p-6 rounded-2xl backdrop-blur-sm border border-white/40 neon-glow">
            <div className="flex items-center space-x-3 mb-3">
              <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
              <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">System</span>
            </div>
            <div className="text-3xl font-bold text-purple-700">AI</div>
            <div className="text-xs text-slate-500 font-medium">🧠 Powered Research</div>
          </div>
        </div>
        
        <div className="card-premium p-6 rounded-2xl backdrop-blur-sm border border-white/40 mb-6 neon-glow">
          <p className="text-slate-600 font-semibold flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5 text-primary-500 pulse-glow" />
            <span>Advanced multi-agent system for materials science research analysis</span>
            <Sparkles className="w-4 h-4 text-secondary-500 animate-pulse" />
          </p>
        </div>
      </div>
      
      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {agents.map((agent, index) => (
          <div 
            key={agent.name} 
            className="animate-slide-up" 
            style={{ 
              animationDelay: `${index * 0.15}s`,
              animationFillMode: 'both'
            }}
          >
            <AgentCard agent={agent} />
          </div>
        ))}
      </div>
      
      {/* Footer Info */}
      <div className="text-center">
        <div className="card-premium p-8 rounded-3xl backdrop-blur-sm border border-white/40 neon-glow">
          <div className="flex items-center justify-center space-x-6 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">Research Agent: Deep literature analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">Persona-Crafter: Framework design</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="font-semibold">Judge: Quality assessment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};