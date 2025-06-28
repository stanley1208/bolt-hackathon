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
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">MARP</h1>
                <p className="text-sm text-slate-600">Materials Science Research Platform</p>
                <p className="text-xs text-slate-500">Advanced multi-agent research system</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium text-slate-900">
                {connected ? 'System Active' : 'System Offline'}
              </div>
              <div className="text-xs text-slate-500">
                {connected ? 'Connected' : 'Disconnected'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};