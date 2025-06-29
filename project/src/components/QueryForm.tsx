import { useState } from 'react';
import { Send, AlertCircle, Sparkles, Beaker, Zap } from 'lucide-react';

interface QueryFormProps {
  onSubmit: (query: string) => void;
  disabled?: boolean;
}

export const QueryForm: React.FC<QueryFormProps> = ({ onSubmit, disabled = false }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedQuery = query.trim();
    
    if (!trimmedQuery) {
      setError('Please enter a research query');
      return;
    }
    
    if (trimmedQuery.length < 10) {
      setError('Query must be at least 10 characters long');
      return;
    }
    
    if (trimmedQuery.length > 500) {
      setError('Query must be less than 500 characters');
      return;
    }
    
    setError('');
    onSubmit(trimmedQuery);
    setQuery('');
  };

  const characterCount = query.length;
  const isOverLimit = characterCount > 500;
  const isNearLimit = characterCount > 450;

  return (
    <div className="card-premium rounded-3xl shadow-2xl border border-white/40 p-10 card-hover neon-glow">
      <div className="flex items-center space-x-4 mb-8">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl blur-xl opacity-50"></div>
          <div className="relative p-4 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 rounded-2xl shadow-lg neon-glow">
            <Beaker className="w-6 h-6 text-white drop-shadow-sm" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900 gradient-text">Research Query</h2>
          <p className="text-slate-600 font-medium flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-primary-500" />
            <span>Describe your materials science research question</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <div className="relative group">
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Enter your research question or topic for multi-agent analysis... 

Examples:
• 'What are the latest developments in perovskite solar cells?'
• 'Analyze the mechanical properties of graphene composites'
• 'Compare biodegradable polymers for medical applications'"
              className={`w-full px-6 py-5 border-2 rounded-2xl resize-none focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 transition-all duration-300 bg-white/60 backdrop-blur-sm text-slate-800 placeholder-slate-500 font-medium ${
                error 
                  ? 'border-red-300 focus:border-red-400 focus:ring-red-200/20' 
                  : isFocused 
                    ? 'border-primary-400 shadow-lg shadow-primary-500/20' 
                    : 'border-white/40 hover:border-white/60'
              } ${disabled ? 'bg-slate-50/60 cursor-not-allowed opacity-60' : ''}`}
              rows={5}
              disabled={disabled}
              maxLength={500}
            />
            {query && !disabled && (
              <div className="absolute top-4 right-4 animate-pulse">
                <Sparkles className="w-5 h-5 text-primary-500 pulse-glow" />
              </div>
            )}
            {isFocused && (
              <div className="absolute inset-0 rounded-2xl border-2 border-primary-400 animate-pulse opacity-30 pointer-events-none"></div>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              {error && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-red-50/80 border border-red-200/50 rounded-xl backdrop-blur-sm">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600 font-semibold">{error}</span>
                </div>
              )}
            </div>
            <div className={`text-sm font-bold px-3 py-1 rounded-full backdrop-blur-sm ${
              isOverLimit 
                ? 'text-red-600 bg-red-50/80 border border-red-200/50' 
                : isNearLimit 
                  ? 'text-warning-600 bg-warning-50/80 border border-warning-200/50' 
                  : 'text-slate-500 bg-slate-50/80 border border-slate-200/50'
            }`}>
              {characterCount}/500
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600 space-y-3">
            <p className="font-bold text-slate-700 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-primary-500" />
              <span>Multi-agent research system powered by AI:</span>
            </p>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-blue-50/80 rounded-xl backdrop-blur-sm border border-blue-200/50">
                <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full pulse-glow"></div>
                <span><strong>Research Agent</strong> - Deep literature analysis & data mining</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-purple-50/80 rounded-xl backdrop-blur-sm border border-purple-200/50">
                <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full pulse-glow"></div>
                <span><strong>Persona-Crafter</strong> - Expert evaluation framework design</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50/80 rounded-xl backdrop-blur-sm border border-green-200/50">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full pulse-glow"></div>
                <span><strong>Judge Agent</strong> - Comprehensive quality assessment</span>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={disabled || !query.trim() || isOverLimit}
            className={`flex items-center space-x-3 px-10 py-4 rounded-2xl font-bold text-white shadow-2xl transition-all duration-300 ${
              disabled || !query.trim() || isOverLimit
                ? 'bg-slate-400 cursor-not-allowed transform-none'
                : 'btn-primary hover:scale-105 active:scale-95'
            }`}
          >
            <Send className="w-5 h-5" />
            <span>{disabled ? 'Processing...' : 'Start Research'}</span>
            {!disabled && query.trim() && !isOverLimit && (
              <Sparkles className="w-4 h-4 animate-pulse" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};