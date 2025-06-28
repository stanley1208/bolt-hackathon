import { AgentCard } from './AgentCard';

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
  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Agent Dashboard</h2>
        <p className="text-slate-600">Real-time monitoring of multi-agent materials science research process</p>
        <p className="text-xs text-slate-500 mt-1">
          Powered by deep research and advanced materials science analysis
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>
    </div>
  );
};