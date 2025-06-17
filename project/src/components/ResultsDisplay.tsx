import React, { useState } from 'react';
import { 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  RefreshCw,
  User,
  Calendar,
  Target
} from 'lucide-react';

interface Results {
  query: string;
  overallScore: number;
  assessment: string;
  recommendation: string;
  detailedScores: Record<string, { score: number; rationale: string }>;
  evaluationFramework: string;
  judgePersona: string;
  confidence: number;
  strengths: string[];
  improvements: string[];
  timestamp: string;
}

interface ResultsDisplayProps {
  results: Results;
  query: string;
  onReset: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, query, onReset }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'breakdown'>('overview');

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-amber-600 bg-amber-50 border-amber-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getAssessmentIcon = (assessment: string) => {
    switch (assessment) {
      case 'Excellent':
        return <Award className="w-6 h-6 text-green-600" />;
      case 'High Quality':
        return <TrendingUp className="w-6 h-6 text-blue-600" />;
      case 'Satisfactory':
        return <CheckCircle className="w-6 h-6 text-amber-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-orange-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {getAssessmentIcon(results.assessment)}
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Research Analysis Complete</h2>
              <p className="text-slate-600">Multi-agent evaluation finished</p>
            </div>
          </div>
          
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Query</span>
          </button>
        </div>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold border-4 ${getScoreColor(results.overallScore)}`}>
            {results.overallScore}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mt-4">{results.assessment}</h3>
          <p className="text-slate-600 mt-2 max-w-2xl mx-auto leading-relaxed">
            {results.recommendation}
          </p>
          
          <div className="flex items-center justify-center space-x-6 mt-6 text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{results.judgePersona}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>{results.evaluationFramework}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(results.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="border-b border-slate-200">
          <div className="flex">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'detailed', label: 'Detailed Scores' },
              { id: 'breakdown', label: 'Analysis Breakdown' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Key Strengths</span>
                </h4>
                <div className="space-y-3">
                  {results.strengths.length > 0 ? results.strengths.map((strength, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-slate-700 leading-relaxed">{strength}</p>
                    </div>
                  )) : (
                    <p className="text-slate-500 italic">No specific strengths identified</p>
                  )}
                </div>
              </div>

              {/* Improvements */}
              <div>
                <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  <span>Areas for Improvement</span>
                </h4>
                <div className="space-y-3">
                  {results.improvements.length > 0 ? results.improvements.map((improvement, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-slate-700 leading-relaxed">{improvement}</p>
                    </div>
                  )) : (
                    <p className="text-slate-500 italic">No specific improvements suggested</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'detailed' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-6">
                <BarChart3 className="w-5 h-5 text-slate-600" />
                <h4 className="text-lg font-semibold text-slate-900">Criterion-by-Criterion Scores</h4>
              </div>
              
              <div className="grid gap-4">
                {Object.entries(results.detailedScores).map(([criterion, scoreData]) => (
                  <div key={criterion} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-slate-900">{criterion}</h5>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(scoreData.score)}`}>
                        {scoreData.score}/100
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                      <div 
                        className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${scoreData.score}%` }}
                      />
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{scoreData.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'breakdown' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="font-medium text-slate-900 mb-2">Confidence Level</h5>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(results.confidence * 100)}%
                  </div>
                  <p className="text-sm text-slate-600 mt-1">Analysis reliability</p>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="font-medium text-slate-900 mb-2">Evaluation Framework</h5>
                  <div className="text-lg font-semibold text-slate-900">
                    {results.evaluationFramework}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">Analysis category</p>
                </div>
                
                <div className="bg-slate-50 rounded-lg p-4">
                  <h5 className="font-medium text-slate-900 mb-2">Judge Persona</h5>
                  <div className="text-lg font-semibold text-slate-900">
                    {results.judgePersona}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">Evaluation perspective</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-6">
                <h5 className="font-medium text-slate-900 mb-3">Original Query</h5>
                <p className="text-slate-700 leading-relaxed italic">"{query}"</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};