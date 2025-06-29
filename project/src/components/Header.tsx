import { Brain, Activity, Zap, Sparkles } from 'lucide-react';

interface HeaderProps {
  connected: boolean;
}

export const Header: React.FC<HeaderProps> = ({ connected }) => {
  return (
    <header className="card-premium border-b border-white/30 shadow-2xl backdrop-blur-2xl">
      <div className="container mx-auto px-8 py-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl shadow-2xl shadow-primary-500/40 neon-glow">
                <Brain className="w-10 h-10 text-white drop-shadow-lg" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
              </div>
              {connected && (
                <div className="absolute -top-2 -right-2 flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-success-400 to-success-600 rounded-full border-3 border-white shadow-lg pulse-glow">
                    <div className="w-full h-full bg-success-300 rounded-full animate-ping opacity-75"></div>
                  </div>
                  <Sparkles className="absolute w-3 h-3 text-white animate-pulse" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl font-bold gradient-text mb-2 tracking-tight text-glow">MSRP</h1>
              <p className="text-slate-700 font-semibold text-lg mb-1">Materials Science Research Platform</p>
              <p className="text-sm text-slate-500 font-medium flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-primary-500" />
                <span>Advanced multi-agent research system</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="text-right">
              <div className={`flex items-center space-x-3 font-bold text-xl mb-2 ${
                connected ? 'text-success-700' : 'text-slate-500'
              }`}>
                {connected ? (
                  <>
                    <div className="relative">
                      <Zap className="w-6 h-6 text-success-500 pulse-glow" />
                      <div className="absolute inset-0 animate-ping">
                        <Zap className="w-6 h-6 text-success-400 opacity-30" />
                      </div>
                    </div>
                    <span className="text-glow">System Active</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-6 h-6 text-slate-400" />
                    <span>System Offline</span>
                  </>
                )}
              </div>
              <div className={`text-sm font-semibold px-4 py-2 rounded-full backdrop-blur-sm ${
                connected 
                  ? 'text-success-700 bg-success-50/80 border border-success-200/50' 
                  : 'text-slate-500 bg-slate-50/80 border border-slate-200/50'
              }`}>
                {connected ? '🚀 All agents ready' : '⏸️ Disconnected'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};