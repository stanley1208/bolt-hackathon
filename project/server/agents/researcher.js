import axios from 'axios';
import { config } from '../../config.example.js';

export class ResearcherAgent {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.name = 'A1-Researcher';
    this.perplexityAPI = axios.create({
      baseURL: config.perplexity.baseUrl,
      timeout: config.perplexity.timeout,
      headers: {
        'Authorization': `Bearer ${config.perplexity.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async analyze(sessionId, query) {
    await this.orchestrator.logActivity(
      sessionId, 
      this.name, 
      'initialization', 
      'Starting deep research analysis using Perplexity AI...'
    );

    try {
      // Phase 1: Initial deep research
      await this.orchestrator.logActivity(
        sessionId,
        this.name,
        'research_phase',
        'Performing comprehensive web research and analysis...',
        { phase: 1, total: 4 }
      );

      const deepResearch = await this.performDeepResearch(sessionId, query);

      // Phase 2: Follow-up research for depth
      await this.orchestrator.logActivity(
        sessionId,
        this.name,
        'research_phase',
        'Conducting follow-up research on key findings...',
        { phase: 2, total: 4 }
      );

      const followUpResearch = await this.performFollowUpResearch(sessionId, query, deepResearch);

      // Phase 3: Source verification and credibility assessment
      await this.orchestrator.logActivity(
        sessionId,
        this.name,
        'research_phase',
        'Verifying sources and assessing credibility...',
        { phase: 3, total: 4 }
      );

      const verifiedFindings = await this.verifyAndAssessSources(sessionId, deepResearch, followUpResearch);

      // Phase 4: Final synthesis
      await this.orchestrator.logActivity(
        sessionId,
        this.name,
        'research_phase',
        'Synthesizing findings and generating comprehensive report...',
        { phase: 4, total: 4 }
      );

      const finalResearch = await this.synthesizeFindings(sessionId, query, verifiedFindings);
    
    await this.orchestrator.logActivity(
      sessionId,
      this.name,
      'completion',
        `Deep research completed. Analyzed ${finalResearch.sources.length} sources with ${finalResearch.confidenceScore}% confidence.`
    );

    await this.orchestrator.saveResult(
      sessionId,
      this.name,
      'research_findings',
        finalResearch,
      null,
        finalResearch.confidenceScore / 100
    );

      return finalResearch;

    } catch (error) {
      console.error('Research Agent Error:', error);
      await this.orchestrator.logActivity(
        sessionId,
        this.name,
        'error',
        `Research failed: ${error.message}`
      );
      throw error;
  }
  }

  async performDeepResearch(sessionId, query) {
    try {
      console.log(`🔬 [DEBUG] Starting Perplexity API call for: "${query}"`);
      
      const response = await this.perplexityAPI.post('/chat/completions', {
        model: config.perplexity.deepResearchModel,
        messages: [
          {
            role: 'system',
            content: `You are a professional research analyst. Provide detailed analysis with proper citations and sources.`
          },
          {
            role: 'user',
            content: `Research and analyze: "${query}". Please provide comprehensive analysis with sources and citations.`
          }
        ],
        temperature: 0.2,
        max_tokens: 4000,
        top_p: 0.9,
        return_citations: true,
        return_images: false,
        return_related_questions: false
      });

      console.log(`🔬 [DEBUG] Perplexity API Response Status:`, response.status);
      console.log(`🔬 [DEBUG] Response Data Keys:`, Object.keys(response.data));
      
      const researchContent = response.data.choices[0].message.content;
      let citations = response.data.citations || [];

      console.log(`🔬 [DEBUG] Research Content Preview:`, researchContent.substring(0, 200) + '...');
      console.log(`🔬 [DEBUG] API Citations Found:`, citations.length);
      console.log(`🔬 [DEBUG] API Citations:`, citations);

      // Check if citations are embedded in the content but not in separate array
      const contentHasCitations = /\[\d+\]/.test(researchContent);
      console.log(`🔬 [DEBUG] Content has citation numbers:`, contentHasCitations);

      // If no API citations but content has numbered citations, try to extract from response
      if (citations.length === 0 && contentHasCitations) {
        console.log(`🔬 [DEBUG] Attempting to extract citations from response metadata...`);
        
        // Check if citations are in a different part of the response
        if (response.data.web_results) {
          citations = response.data.web_results.map((result, index) => ({
            url: result.url,
            title: result.title || `Source ${index + 1}`,
            snippet: result.body || result.snippet || '',
            index: index + 1
          }));
          console.log(`🔬 [DEBUG] Extracted citations from web_results:`, citations);
        } else if (response.data.sources) {
          citations = response.data.sources.map((source, index) => ({
            url: source.url,
            title: source.title || `Source ${index + 1}`,
            snippet: source.snippet || source.text || '',
            index: index + 1
          }));
          console.log(`🔬 [DEBUG] Extracted citations from sources:`, citations);
        } else {
          console.log(`🔬 [DEBUG] Full Response Structure:`, JSON.stringify(response.data, null, 2));
        }
      }

      console.log(`🔬 [DEBUG] Final Citations Count:`, citations.length);

      return {
        content: researchContent,
        citations: citations,
        timestamp: new Date().toISOString(),
        query: query,
        model: config.perplexity.deepResearchModel
      };

    } catch (error) {
      console.error('🚨 [DEBUG] Perplexity API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(`Deep research failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  async performFollowUpResearch(sessionId, originalQuery, initialResearch) {
    // Extract key topics from initial research for follow-up
    const followUpQuery = `Based on the research about "${originalQuery}", 
    provide additional detailed analysis on the most important aspects, 
    recent developments, and any contradictory viewpoints. 
    Focus on filling gaps and adding depth to: ${this.extractKeyTopics(initialResearch.content)}`;

    try {
      const response = await this.perplexityAPI.post('/chat/completions', {
        model: config.perplexity.deepResearchModel,
        messages: [
          {
            role: 'system',
            content: 'You are conducting follow-up research to add depth and nuance to initial findings. Focus on recent developments, expert opinions, and detailed analysis.'
          },
          {
            role: 'user',
            content: followUpQuery
          }
        ],
        temperature: 0.3,
        max_tokens: 3000,
        return_citations: true
      });

      return {
        content: response.data.choices[0].message.content,
        citations: response.data.citations || [],
        timestamp: new Date().toISOString(),
        type: 'follow_up'
      };

    } catch (error) {
      console.warn('Follow-up research failed, continuing with initial research only:', error.message);
      return null;
    }
  }

  async verifyAndAssessSources(sessionId, primaryResearch, followUpResearch) {
    // Combine citations from both research phases
    const allCitations = [
      ...primaryResearch.citations,
      ...(followUpResearch?.citations || [])
    ];

    // Convert citations to structured source objects
    const sources = allCitations.map((citation, index) => {
      // Handle both string URLs and object citations
      const url = typeof citation === 'string' ? citation : citation.url;
      const title = typeof citation === 'object' && citation.title ? 
        citation.title : 
        this.generateTitleFromUrl(url);
      const snippet = typeof citation === 'object' && citation.snippet ? 
        citation.snippet : 
        `Source content from ${this.getDomainFromUrl(url)}`;

      return {
        id: index + 1,
        title: title,
        url: url,
        snippet: snippet,
        credibilityScore: this.assessSourceCredibility({ url, title }),
        type: this.categorizeSource({ url }),
        accessDate: new Date().toISOString()
      };
    });

    console.log(`🔬 [DEBUG] Converted ${allCitations.length} citations to ${sources.length} structured sources`);
    console.log(`🔬 [DEBUG] Sample source:`, sources[0]);

    return {
      primaryResearch,
      followUpResearch,
      sources,
      totalSources: sources.length,
      averageCredibility: sources.reduce((sum, s) => sum + s.credibilityScore, 0) / sources.length
    };
  }

  generateTitleFromUrl(url) {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      
      // Extract meaningful part from path
      const path = new URL(url).pathname;
      const pathParts = path.split('/').filter(part => part && part.length > 2);
      
      if (pathParts.length > 0) {
        const titlePart = pathParts[pathParts.length - 1]
          .replace(/-/g, ' ')
          .replace(/_/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
        return `${titlePart} - ${domain}`;
      }
      
      return `Research Source - ${domain}`;
    } catch {
      return 'Research Source';
    }
  }

  getDomainFromUrl(url) {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'Unknown Domain';
    }
  }

  async synthesizeFindings(sessionId, query, verifiedFindings) {
    const { primaryResearch, followUpResearch, sources } = verifiedFindings;

    // Extract key findings and themes
    const keyFindings = this.extractKeyFindings(primaryResearch.content, followUpResearch?.content);
    const topics = this.extractTopics(query, primaryResearch.content);

    // Calculate overall confidence based on source quality and consistency
    const confidenceScore = this.calculateConfidenceScore(sources, keyFindings);
    
    return {
      query,
      executiveSummary: this.generateExecutiveSummary(primaryResearch.content),
      keyFindings,
      detailedAnalysis: {
        primaryResearch: primaryResearch.content,
        followUpResearch: followUpResearch?.content || null
      },
      sources,
      topics,
      methodology: 'AI-powered deep research using Perplexity with multi-phase analysis and source verification',
      confidenceScore,
      limitations: [
        'Analysis based on publicly available information',
        'Information current as of research date',
        'AI-generated synthesis may have interpretation limitations',
        'Source availability and accessibility may affect completeness'
      ],
      metadata: {
        researchDuration: 'Multi-phase deep research',
        totalSources: sources.length,
        averageSourceCredibility: verifiedFindings.averageCredibility,
        researchModel: config.perplexity.deepResearchModel,
      timestamp: new Date().toISOString()
      }
    };
  }

  extractKeyTopics(content) {
    // Simple extraction of key topics from content
    const sentences = content.split('.').slice(0, 3);
    return sentences.join('. ').substring(0, 200) + '...';
  }

  extractKeyFindings(primaryContent, followUpContent = '') {
    const allContent = primaryContent + ' ' + (followUpContent || '');
    
    // Simple extraction - in production, you might use more sophisticated NLP
    const findings = [];
    const sentences = allContent.split(/[.!?]+/).filter(s => s.length > 50);
    
    // Take key sentences that seem to contain important findings
    const keywordPatterns = [
      /research shows|studies indicate|evidence suggests|data reveals/i,
      /according to|based on|findings show|results indicate/i,
      /significantly|importantly|notably|primarily/i,
      /however|despite|although|nevertheless/i
    ];

    keywordPatterns.forEach(pattern => {
      const matches = sentences.filter(s => pattern.test(s)).slice(0, 2);
      findings.push(...matches.map(s => s.trim()));
    });

    return findings.slice(0, 8); // Limit to 8 key findings
  }

  extractTopics(query, content) {
    // Extract topics from query and content
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const topics = [...new Set(queryWords)].slice(0, 5);
    return topics;
  }

  assessSourceCredibility(citation) {
    const url = citation.url || '';
    const title = citation.title || '';
    
    let score = 70; // Base score
    
    // Boost for academic/official sources
    if (url.includes('.edu') || url.includes('.gov')) score += 20;
    else if (url.includes('.org')) score += 15;
    else if (url.includes('wikipedia.org')) score += 10;
    
    // Boost for reputable news sources
    const reputableSources = ['bbc.com', 'reuters.com', 'ap.org', 'npr.org'];
    if (reputableSources.some(source => url.includes(source))) score += 15;
    
    // Penalty for certain domains
    if (url.includes('blog') || url.includes('forum')) score -= 10;
    
    return Math.max(50, Math.min(100, score));
  }

  categorizeSource(citation) {
    const url = citation.url || '';
    
    if (url.includes('.edu')) return 'academic';
    if (url.includes('.gov')) return 'government';
    if (url.includes('.org')) return 'organization';
    if (url.includes('news') || url.includes('com')) return 'news_media';
    return 'web_source';
  }

  calculateConfidenceScore(sources, keyFindings) {
    const sourceScore = sources.reduce((sum, s) => sum + s.credibilityScore, 0) / sources.length;
    const findingsScore = Math.min(100, keyFindings.length * 10 + 60);
    const sourceCountScore = Math.min(20, sources.length * 2);
    
    return Math.round((sourceScore * 0.5) + (findingsScore * 0.3) + (sourceCountScore * 0.2));
  }

  generateExecutiveSummary(content) {
    // Extract first substantial paragraph as executive summary
    const paragraphs = content.split('\n\n').filter(p => p.length > 100);
    return paragraphs[0]?.substring(0, 300) + '...' || 'Research analysis completed successfully.';
  }
}