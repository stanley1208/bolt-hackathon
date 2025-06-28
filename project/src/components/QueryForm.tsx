import { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';

interface QueryFormProps {
  onSubmit: (query: string) => void;
  disabled?: boolean;
}

export const QueryForm: React.FC<QueryFormProps> = ({ onSubmit, disabled = false }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-slate-700 mb-2">
            Research Query
          </label>
          <div className="relative">
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your research question or topic for multi-agent analysis..."
              className={`w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                error ? 'border-red-300' : 'border-slate-300'
              } ${disabled ? 'bg-slate-50 cursor-not-allowed' : ''}`}
              rows={4}
              disabled={disabled}
              maxLength={500}
            />
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              {error && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-red-600">{error}</span>
                </>
              )}
            </div>
            <span className={`text-sm ${
              isOverLimit ? 'text-red-600' : isNearLimit ? 'text-amber-600' : 'text-slate-500'
            }`}>
              {characterCount}/500
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            <p>Our multi-agent system will analyze your query using:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Research Agent for comprehensive analysis</li>
              <li>Persona-Crafter for evaluation framework</li>
              <li>Judge Agent for final assessment</li>
            </ul>
          </div>
          
          <button
            type="submit"
            disabled={disabled || !query.trim() || isOverLimit}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            <Send className="w-4 h-4" />
            <span>{disabled ? 'Processing...' : 'Start Research'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};