import React, { useState } from 'react';
import { CheckCircle, ExternalLink, FileText, BarChart3, Globe, Link, RefreshCw, AlertCircle, Shield } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'research' | 'sources' | 'trail'>('research');

  // Extract research data from results
  const researchData = results.researchData || extractResearchFromResults(results);

  // Handle citation clicks
  React.useEffect(() => {
    const handleCitationClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.href && target.href.includes('#source-')) {
        e.preventDefault();
        setActiveTab('sources');
        // Small delay to ensure tab content is rendered before scrolling
        setTimeout(() => {
          const sourceId = target.href.split('#')[1];
          const sourceElement = document.getElementById(sourceId);
          if (sourceElement) {
            sourceElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a temporary highlight effect
            sourceElement.classList.add('ring-2', 'ring-blue-500', 'ring-opacity-50');
            setTimeout(() => {
              sourceElement.classList.remove('ring-2', 'ring-blue-500', 'ring-opacity-50');
            }, 2000);
          }
        }, 100);
      }
    };

    // Add event listener to all citation links
    document.addEventListener('click', handleCitationClick);
    
    // Cleanup
    return () => {
      document.removeEventListener('click', handleCitationClick);
    };
  }, []);

  // Function to render markdown to HTML for display
  const renderMarkdown = (text: string): string => {
    if (!text) return text;
    
    let result = text
      // Convert headers
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold text-slate-900 mb-3 mt-6">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold text-slate-900 mb-4 mt-8">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-slate-900 mb-6 mt-10">$1</h1>')
      // Convert bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-800">$1</strong>')
      // Convert italic text
      .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
      // Convert citation numbers to clickable links
      .replace(/\[(\d+)\]/g, '<a href="#source-$1" class="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">[$1]</a>')
      // Convert bullet points
      .replace(/^\* (.*$)/gm, '<li>$1</li>')
      .replace(/^- (.*$)/gm, '<li>$1</li>')
      // Convert numbered lists
      .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
      // Convert line breaks
      .replace(/\n\n/g, '</p><p class="mb-3">');

    // Wrap consecutive <li> elements in <ul> tags
    result = result.replace(/(<li>.*?<\/li>(\n<li>.*?<\/li>)*)/g, '<ul class="list-disc ml-6 mb-4 space-y-1">$1</ul>');
    
    // Wrap in paragraph tags and clean up
    result = result
      .replace(/^/, '<p class="mb-3">')
      .replace(/$/, '</p>')
      // Clean up empty paragraphs
      .replace(/<p class="mb-3"><\/p>/g, '')
      // Fix paragraphs that contain only lists
      .replace(/<p class="mb-3">(<ul.*?<\/ul>)<\/p>/g, '$1')
      .trim();

    return result;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (score >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getSourceTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return 'Academic';
      case 'government': return 'Government';
      case 'organization': return 'Organization';
      case 'news_media': return 'News';
      default: return 'Web';
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
    <div className="glass-effect rounded-2xl shadow-xl border border-white/30 overflow-hidden">
      {/* Header */}
      <div className="p-8 bg-gradient-to-br from-white/50 to-white/20 backdrop-blur-sm border-b border-white/20">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-success-500 to-success-600 rounded-xl shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Research Analysis Complete</h2>
                <p className="text-slate-600 font-medium">Comprehensive research results with trustworthiness assessment</p>
              </div>
            </div>
            <div className="bg-white/60 rounded-xl p-4 backdrop-blur-sm border border-white/20 mb-6">
              <p className="text-slate-700 font-medium leading-relaxed">{query}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
              <div className={`p-6 rounded-xl border-2 shadow-lg ${getScoreColor(results.overallScore)}`}>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">{results.overallScore}%</div>
                  <div className="text-sm font-semibold uppercase tracking-wide">Research Trust Score</div>
                  <div className="text-xs text-slate-600 mt-2 leading-relaxed">
                    This score reflects the Judge Agent's verdict, i.e., how much you can trust the final research conclusions.
                    <br/><br/>
                    Score Guide - 80%+: Excellent; 70-79%: High Quality; 60-69%: Satisfactory; 50-59% Needs Improvement; &lt;50%: Insufficient
                  </div>
                </div>
              </div>
              
              {researchData && (
                <div className="p-6 rounded-xl bg-gradient-to-br from-secondary-50 to-secondary-100 border-2 border-secondary-200 shadow-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary-700 mb-2">{researchData.confidenceScore}%</div>
                    <div className="text-sm font-semibold text-secondary-600 uppercase tracking-wide">Research Confidence Score</div>
                    <div className="text-xs text-slate-600 mt-2 leading-relaxed">
                      This score reflects how confident the AI was in its research process and methodology.
                      <br/><br/>
                      Score Guide - 90%+: Very High Confidence; 80-89%: High Confidence; 70-79%: Moderate Confidence; 60-69%: Low Confidence; &lt;60%: Very Low Confidence
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/30 backdrop-blur-sm border-b border-white/20">
        <nav className="flex justify-center space-x-8 px-8">
          {[
            { id: 'research', label: 'Research Analysis', icon: FileText },
            { id: 'sources', label: 'Source Analysis', icon: ExternalLink },
            { id: 'trail', label: 'Research Trail', icon: Globe },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-3 font-semibold text-sm transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-700 bg-primary-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-800 hover:border-slate-300 hover:bg-white/20'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-8 bg-white/20 backdrop-blur-sm">
        {activeTab === 'research' && researchData && (
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-slate-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  i
                </div>
                <h4 className="font-medium text-slate-900">Interactive Research Report</h4>
              </div>
              <p className="text-sm text-slate-600">
                This research analysis includes clickable citation numbers (like <span className="text-blue-600 font-medium">[1]</span>, <span className="text-blue-600 font-medium">[2]</span>, <span className="text-blue-600 font-medium">[3]</span>) 
                that link directly to the corresponding sources. Click any citation to jump to the Source Analysis tab and view that specific source.
              </p>
            </div>

            {/* Trust Assessment */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Trust Assessment</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div 
                  className="prose prose-sm max-w-none text-slate-700"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(results.recommendation) }}
                />
              </div>
            </div>

            {/* Research Methodology */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Research Methodology</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <div 
                  className="prose prose-sm max-w-none text-slate-700"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(researchData.methodology) }}
                />
                {researchData.metadata && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Primary Research */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Primary Research Analysis</h3>
              <div className="bg-white border border-slate-200 rounded-lg p-4">
                <div 
                  className="prose prose-sm max-w-none text-slate-700"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(researchData.detailedAnalysis.primaryResearch) }}
                />
              </div>
            </div>

            {/* Research Limitations */}
            {researchData.limitations && (
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Research Limitations</h3>
                <ul className="space-y-2">
                  {researchData.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <span 
                        className="text-sm text-slate-700"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(limitation) }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sources' && researchData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Research Sources</h3>
              <span className="text-sm text-slate-500">
                {researchData.sources.length} sources analyzed
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-slate-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  #
                </div>
                <h4 className="font-medium text-slate-900">Source Citation System</h4>
              </div>
              <p className="text-sm text-slate-600">
                Each source is numbered for easy reference. When you see citations like [1], [2], [3] in the research analysis above, 
                these numbers correspond to the sources listed below. Click on any citation number in the research text to jump directly to that source.
              </p>
            </div>

            <div className="grid gap-4">
              {researchData.sources.map((source) => (
                <div key={source.id} id={`source-${source.id}`} className="bg-white border border-slate-200 rounded-lg p-4 scroll-mt-8">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {source.id}
                      </div>
                      <span className="text-lg">{getSourceTypeIcon(source.type)}</span>
                      <h4 className="font-medium text-slate-900 flex-1">{source.title}</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(source.credibilityScore)}`}>
                        {source.credibilityScore}% strength
                      </span>
                    </div>
                  </div>
                  
                  {source.snippet && (
                    <div 
                      className="prose prose-sm max-w-none text-slate-600 mb-3 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(source.snippet) }}
                    />
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

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="w-5 h-5 text-slate-600" />
                <h4 className="font-medium text-slate-900">Research Journey</h4>
              </div>
              <p className="text-sm text-slate-600">
                This shows every website your AI research agents visited during the comprehensive analysis. 
                Each source was analyzed for credibility and relevance to build the research report above.
                The trustworthiness assessment helps you understand how much you can rely on these findings.
              </p>
            </div>

            <div className="space-y-3">
              {getAllUniqueLinks().map((link, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
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
                        {link.credibilityScore}% strength
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
                    <div 
                      className="prose prose-sm max-w-none text-slate-600 leading-relaxed ml-11"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(link.snippet.substring(0, 200)) + '...' }}
                    />
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

      {/* New Research Button at Bottom */}
      <div className="p-8 bg-white/30 backdrop-blur-sm border-t border-white/20">
        <div className="flex justify-center">
          <button
            onClick={onReset}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New Research</span>
          </button>
        </div>
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