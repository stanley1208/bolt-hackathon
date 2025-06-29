import React from 'react';
import { ResearchPlatform } from './components/ResearchPlatform';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30 mesh-bg relative overflow-hidden">
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Primary floating orbs */}
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-primary-400/30 to-secondary-400/30 rounded-full blur-3xl animate-float neon-glow"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-tr from-secondary-400/30 to-success-400/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-primary-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
        
        {/* Additional ambient orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-br from-violet-400/20 to-indigo-400/20 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Particle system */}
        <div className="floating-particles"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Dynamic light rays */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary-200/50 to-transparent opacity-20"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-secondary-200/50 to-transparent opacity-20"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10">
        <ResearchPlatform />
      </div>
    </div>
  );
}

export default App;