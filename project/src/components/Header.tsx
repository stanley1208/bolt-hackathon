import { Brain, Activity, Zap, Sparkles, Shield, CheckCircle } from 'lucide-react';
import boltBadge from '../assets/bolt-badge.png';

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
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                  <Sparkles className="absolute w-3 h-3 text-white animate-pulse" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <h1 className="text-5xl font-bold gradient-text mb-2 tracking-tight text-glow">Disorderless.ai</h1>
              <p className="text-slate-700 font-semibold text-lg mb-1">Materials Science & Engineering Research Platform</p>
              <p className="text-sm text-slate-500 font-medium flex items-center space-x-2">
                <Shield className="w-4 h-4 text-primary-500" />
                <span>First the findings. Then the verdict.</span>
              </p>
            </div>
          </div>
          
          {/* Powered by Bolt Badge */}
          <div className="flex items-center">
            <a 
              href="https://bolt.new/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group cursor-pointer"
              title="Powered by Bolt - Visit bolt.new"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <img 
                  src={boltBadge} 
                  alt="Powered by Bolt" 
                  className="w-full h-full object-cover"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};