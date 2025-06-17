import React from 'react';
import { Brain, Activity } from 'lucide-react';

interface HeaderProps {
  connected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ connected }) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">MARP</h1>
              <p className="text-sm text-slate-600">Multi-Agent Research Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <Activity className={`w-4 h-4 ${connected ? 'text-green-500' : 'text-red-500'}`} />
              <span className="text-slate-600">
                {connected ? 'System Active' : 'System Offline'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};