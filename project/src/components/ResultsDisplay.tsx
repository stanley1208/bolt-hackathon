import React, { useState } from 'react';
import { CheckCircle, AlertCircle, ExternalLink, FileText, BarChart3, Clock, RefreshCw, Globe, Link } from 'lucide-react';

interface Source {
  id: number;
  title: string;
  url: string;
  snippet: string;
  credibilityScore: number;
  type: string;
  accessDate: string;
}

interface ResearchResults {
  query: string;
  executiveSummary: string;
  keyFindings: string[];
  detailedAnalysis: {
    primaryResearch: string;
    followUpResearch?: string;
  };
  sources: Source[];
  topics: string[];
  methodology: string;
  confidenceScore: number;
  limitations: string[];
  metadata: {
    researchDuration: string;
    totalSources: number;
    averageSourceCredibility: number;
    researchModel: string;
    timestamp: string;
  };
}

interface FinalResults {
  query: string;
  overallScore: number;
  assessment: string;
  recommendation: string;
  detailedScores: any;
  evaluationFramework: string;
  judgePersona: string;
  confidence: number;
  strengths: string[];
  improvements: string[];
  timestamp: string;
  // Research data will be embedded here
  researchData?: ResearchResults;
}

interface ResultsDisplayProps {
  results: FinalResults;
  query: string;
  onReset: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, query, onReset }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'research' | 'evaluation' | 'sources' | 'trail'>('overview');

  // Extract research data from results
  const researchData = results.researchData || extractResearchFromResults(results);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return '🎓';
      case 'government': return '🏛️';
      case 'organization': return '🏢';
      case 'news_media': return '📰';
      default: return '🌐';
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getAllUniqueLinks = () => {
    if (!researchData) return [];
    
    const allLinks = researchData.sources
      .filter(source => source.url && source.url.startsWith('http'))
      .map(source => ({
        url: source.url,
        domain: getDomainFromUrl(source.url),
        title: source.title,
        type: source.type,
        credibilityScore: source.credibilityScore,
        snippet: source.snippet
      }));

    // Remove duplicates by URL
    const uniqueLinks = allLinks.filter((link, index, self) => 
      index === self.findIndex(l => l.url === link.url)
    );

    return uniqueLinks.sort((a, b) => b.credibilityScore - a.credibilityScore);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-slate-900">Research Analysis Complete</h2>
            </div>
            <p className="text-slate-600 mb-4">{query}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-3 rounded-lg border ${getScoreColor(results.overallScore)}`}>
                <div className="text-2xl font-bold">{results.overallScore}/100</div>
                <div className="text-sm font-medium">{results.assessment}</div>
              </div>
              
              {researchData && (
                <>
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-2xl font-bold text-slate-700">{researchData.sources.length}</div>
                    <div className="text-sm text-slate-600">Sources Analyzed</div>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="text-2xl font-bold text-slate-700">{researchData.confidenceScore}%</div>
                    <div className="text-sm text-slate-600">Research Confidence</div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <button
            onClick={onReset}
            className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Research</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'research', label: 'Research Analysis', icon: FileText },
            { id: 'evaluation', label: 'Evaluation Details', icon: CheckCircle },
            { id: 'sources', label: 'Sources', icon: ExternalLink },
            { id: 'trail', label: 'Research Trail', icon: Globe },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Executive Summary */}
            {researchData?.executiveSummary && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Executive Summary</h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 leading-relaxed">{researchData.executiveSummary}</p>
                </div>
              </div>
            )}

            {/* Key Recommendation */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Assessment</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">{results.recommendation}</p>
              </div>
            </div>

            {/* Key Findings */}
            {researchData?.keyFindings && researchData.keyFindings.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Key Findings</h3>
                <div className="space-y-2">
                  {researchData.keyFindings.slice(0, 5).map((finding, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">{finding}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths and Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.strengths.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-green-700 mb-3">Strengths</h3>
                  <ul className="space-y-2">
                    {results.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.improvements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-amber-700 mb-3">Areas for Enhancement</h3>
                  <ul className="space-y-2">
                    {results.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-700">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'research' && researchData && (
          <div className="space-y-6">
            {/* Research Methodology */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Research Methodology</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700">{researchData.methodology}</p>
                {researchData.metadata && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-slate-500">Model:</span>
                        <div className="font-medium text-slate-700">{researchData.metadata.researchModel}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Duration:</span>
                        <div className="font-medium text-slate-700">{researchData.metadata.researchDuration}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Sources:</span>
                        <div className="font-medium text-slate-700">{researchData.metadata.totalSources}</div>
                      </div>
                      <div>
                        <span className="text-slate-500">Avg. Credibility:</span>
                        <div className="font-medium text-slate-700">{Math.round(researchData.metadata.averageSourceCredibility)}%</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Primary Research */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Primary Research Analysis</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="prose prose-sm max-w-none text-slate-700">
                  {researchData.detailedAnalysis.primaryResearch.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 leading-relaxed">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Follow-up Research */}
            {researchData.detailedAnalysis.followUpResearch && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Follow-up Analysis</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="prose prose-sm max-w-none text-slate-700">
                    {researchData.detailedAnalysis.followUpResearch.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="mb-3 leading-relaxed">{paragraph}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Research Limitations */}
            {researchData.limitations && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Research Limitations</h3>
                <ul className="space-y-2">
                  {researchData.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'evaluation' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Evaluation Framework</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-slate-700 mb-2">
                  <strong>Judge Persona:</strong> {results.judgePersona}
                </p>
                <p className="text-slate-700 mb-2">
                  <strong>Framework:</strong> {results.evaluationFramework}
                </p>
                <p className="text-slate-700">
                  <strong>Overall Confidence:</strong> {Math.round(results.confidence * 100)}%
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Detailed Scoring</h3>
              <div className="space-y-3">
                {Object.entries(results.detailedScores || {}).map(([criterion, scoreData]: [string, any]) => (
                  <div key={criterion} className="bg-white border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-900">{criterion}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(scoreData.score)}`}>
                        {scoreData.score}/100
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">{scoreData.rationale}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sources' && researchData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Research Sources</h3>
              <span className="text-sm text-slate-500">
                {researchData.sources.length} sources • Avg. credibility: {Math.round(researchData.metadata?.averageSourceCredibility || 0)}%
              </span>
            </div>

            <div className="grid gap-4">
              {researchData.sources.map((source) => (
                <div key={source.id} className="bg-white border border-slate-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getSourceTypeIcon(source.type)}</span>
                      <h4 className="font-medium text-slate-900 flex-1">{source.title}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(source.credibilityScore)}`}>
                        {source.credibilityScore}% credible
                      </span>
                    </div>
                  </div>
                  
                  {source.snippet && (
                    <p className="text-sm text-slate-600 mb-3 leading-relaxed">{source.snippet}</p>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-4">
                      <span className="capitalize">{source.type.replace('_', ' ')}</span>
                      <span>Accessed: {new Date(source.accessDate).toLocaleDateString()}</span>
                    </div>
                    
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>View Source</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trail' && researchData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Complete Research Trail</h3>
              <span className="text-sm text-slate-500">
                {getAllUniqueLinks().length} unique websites visited
              </span>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Research Journey</h4>
              </div>
              <p className="text-sm text-blue-700">
                This shows every website your AI agent visited during research. Each link was crawled, 
                analyzed, and used to build the comprehensive research report above.
              </p>
            </div>

            <div className="space-y-3">
              {getAllUniqueLinks().map((link, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm font-medium text-slate-600">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900 mb-1">{link.title}</h4>
                        <div className="flex items-center space-x-2 text-sm text-slate-500">
                          <span className="text-lg">{getSourceTypeIcon(link.type)}</span>
                          <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                            {link.domain}
                          </span>
                          <span className="capitalize">{link.type.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(link.credibilityScore)}`}>
                        {link.credibilityScore}%
                      </span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Link className="w-4 h-4" />
                        <span className="text-sm">Visit</span>
                      </a>
                    </div>
                  </div>
                  
                  {link.snippet && (
                    <p className="text-sm text-slate-600 leading-relaxed ml-11">
                      {link.snippet.substring(0, 200)}...
                    </p>
                  )}
                </div>
              ))}
            </div>

            {getAllUniqueLinks().length === 0 && (
              <div className="text-center py-8">
                <Globe className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-500">No research trail data available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to extract research data from results if not provided
function extractResearchFromResults(results: FinalResults): ResearchResults | null {
  // This is a fallback for when research data isn't properly structured
  // In the new implementation, research data should be properly passed through
  return null;
}