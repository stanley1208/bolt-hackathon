import React from 'react';
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
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Agent Activity Dashboard</h2>
        <p className="text-slate-600">Real-time monitoring of multi-agent research process</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.name} agent={agent} />
        ))}
      </div>
    </div>
  );
};