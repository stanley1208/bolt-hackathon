import axios from 'axios';
import { config } from '../../config.js';

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
      'Starting deep research analysis using Perplexity AI with enhanced materials science framework...'
    );

    try {
      // Phase 1: Initial deep research with enhanced context
      await this.orchestrator.logActivity(
        sessionId,
        this.name,
        'research_phase',
        'Performing comprehensive web research with multi-domain materials science analysis...',
        { phase: 1, total: 4 }
      );

      const deepResearch = await this.performDeepResearch(sessionId, query);

      // Phase 2: Follow-up research for depth and cross-domain integration
      await this.orchestrator.logActivity(
        sessionId,
        this.name,
        'research_phase',
        'Conducting follow-up research on key findings and cross-domain relationships...',
        { phase: 2, total: 4 }
      );

      const followUpResearch = await this.performFollowUpResearch(sessionId, query, deepResearch);

      // Phase 3: Source verification and credibility assessment
      await this.orchestrator.logActivity(
        sessionId,
        this.name,
        'research_phase',
        'Verifying sources and assessing credibility across multiple materials science domains...',
        { phase: 3, total: 4 }
      );

      const verifiedFindings = await this.verifyAndAssessSources(sessionId, deepResearch, followUpResearch);

      // Phase 4: Final synthesis with enhanced framework integration
      await this.orchestrator.logActivity(
        sessionId,
        this.name,
        'research_phase',
        'Synthesizing findings with comprehensive tetrahedron framework and cross-domain analysis...',
        { phase: 4, total: 4 }
      );

      const finalResearch = await this.synthesizeFindings(sessionId, query, verifiedFindings);
    
    await this.orchestrator.logActivity(
      sessionId,
      this.name,
      'completion',
        `Deep research completed. Analyzed ${finalResearch.sources.length} sources with ${finalResearch.confidenceScore}% confidence across multiple materials science domains.`
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
      console.log(`[DEBUG] Starting Perplexity API call for: "${query}"`);
      
      const response = await this.perplexityAPI.post('/chat/completions', {
        model: config.perplexity.deepResearchModel,
        messages: [
          {
            role: 'system',
            content: `You are a professional materials science researcher with 20 years of experience. Provide accurate and comprehensive research on materials, properties, applications, and scientific developments based on the user's query. Use only primary and secondary sources when possible.

Understand that materials science is built on the following paradigm of structure-property-processing-performance:
-- Structure: This portion of the paradigm accounts for the chemical make-up, short- and long-range order, microstructures, defects, atomic/molecular arrangement, crystallography, etc. of the material.
-- Properties: This portion of the paradigm accounts for the observable / measurable characteristics used to describe a material. Examples include mechanical, electrical, thermal, optical, magnetic characteristics
-- Processing: This portion of the paradigm accounts for the procedures for synthesizing, forming, or assembling materials into a desired structure. Examples include manufacturing methods, synthesis techniques, fabrication processes.
-- Performance: This portion of the paradigm accounts for how materials behave in real-world applications and environments, particularly the capability of a materials system to meet a given set of application requirements.
Other components of the paradigm include:
-- Characterization: This portion of the paradigm accounts for the methods used to measure, describe, quantify, and evaluate material properties and performance. Examples include microscopy, spectroscopy, mechanical testing, etc.
-- Design: This portion of the paradigm accounts for the process of selecting and optimizing materials and processing parameters to meet specific performance requirements. Examples include material selection, design for manufacturing, and process optimization.
-- Sustainability: This portion of the paradigm accounts for the holistic view of role and life cycle of materials.

These components are interconnected - changes in one affect the others. For example, considering structure to processing, a materials scientist would consider how can a structure be achieved through processing. 
Considering processing to performance, a materials engineer would think about how does the achieved structure evolve during use impacting durability, component life, etc.
Considering performance to properties, a materials scientist or engineer would need to understand how performance translates to specific materials properties.
Considering properties to structure, a materials scientist or engineer would think about what structure is necessary to achieve the desired combination of properties.

Use this paradigm to guide your analysis and identify important relationships, but focus your research scope appropriately for the specific query.

To write the report, please:
1. Structure the report using markdown formatting with:
   - Clear headings and subheadings (## and ###)
   - Bullet points for lists of information
   - Numbered lists for sequential steps or prioritized items
   - Bold or italic text for emphasis on critical concepts
   - Code blocks when technical information is present
 2. Use the following exact structure for the report:
## Restatement of the Query and Research Methodology
[Insert brief statement of (1) your understanding of the query within the context of the materials science paradigm and (2) your research methodology in view of the same]

## Summary
[Insert brief summary of key findings]

## Analysis
[Insert detailed analysis based on deep research, with sources and citations embedded after each sentence or finding]

## Considerations 
[Insert any considerations that are relevant to the query, including recent research and developments, research gaps, contradictory viewpoints, or technological advances]

## Conclusion
[Insert conclusion based on the analysis and considerations]`
          },
          {
            role: 'user',
            content: `Research and analyze: "${query}". Please provide a comprehensive research report with detailed analysis, sources, and citations. Use proper markdown formatting with clear headers and structure as specified in the system message. 

IMPORTANT: You will have access to multiple sources - please use AS MANY OF THEM AS POSSIBLE throughout your analysis. Don't limit yourself to just the first 2-3 sources. Distribute your citations across ALL available sources. Each section should reference different sources, and each major claim should be backed by appropriate citations. Use numbered citations [1], [2], [3], [4], [5], etc. frequently and vary which sources you cite for different aspects of your analysis.`
          }
        ],
        temperature: 0.2,
        max_tokens: 4000,
        top_p: 0.9,
        return_citations: true,
        return_images: false,
        return_related_questions: false
      });

      console.log(`[DEBUG] Perplexity API Response Status:`, response.status);
      console.log(`[DEBUG] Response Data Keys:`, Object.keys(response.data));
      
      const researchContent = response.data.choices[0].message.content;
      let citations = response.data.citations || [];

      console.log(`[DEBUG] Research Content Preview:`, researchContent.substring(0, 200) + '...');
      console.log(`[DEBUG] API Citations Found:`, citations.length);
      console.log(`[DEBUG] API Citations:`, citations);

      // Check if citations are embedded in the content but not in separate array
      const contentHasCitations = /\[\d+\]/.test(researchContent);
      console.log(`[DEBUG] Content has citation numbers:`, contentHasCitations);

      // If no API citations but content has numbered citations, try to extract from response
      if (citations.length === 0 && contentHasCitations) {
        console.log(`[DEBUG] Attempting to extract citations from response metadata...`);
        
        // Check if citations are in a different part of the response
        if (response.data.web_results) {
          citations = response.data.web_results.map((result, index) => ({
            url: result.url,
            title: result.title || `Source ${index + 1}`,
            snippet: result.body || result.snippet || '',
            index: index + 1
          }));
          console.log(`[DEBUG] Extracted citations from web_results:`, citations);
        } else if (response.data.sources) {
          citations = response.data.sources.map((source, index) => ({
            url: source.url,
            title: source.title || `Source ${index + 1}`,
            snippet: source.snippet || source.text || '',
            index: index + 1
          }));
          console.log(`[DEBUG] Extracted citations from sources:`, citations);
        } else {
          console.log(`[DEBUG] Full Response Structure:`, JSON.stringify(response.data, null, 2));
        }
      }

      console.log(`[DEBUG] Final Citations Count:`, citations.length);

      return {
        content: this.cleanMarkdown(researchContent),
        citations: citations,
        timestamp: new Date().toISOString(),
        query: query,
        model: config.perplexity.deepResearchModel
      };

    } catch (error) {
      console.error('[DEBUG] Perplexity API Error Details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(`Deep research failed: ${error.response?.data?.error?.message || error.message}`);
    }
  }
  // Follow-up research agent
  // async performFollowUpResearch(sessionId, originalQuery, initialResearch) {
  //   // Extract key topics from initial research for follow-up
  //   const followUpQuery = `Based on the research about "${originalQuery}", 
  //   provide additional detailed analysis on the most important aspects, 
  //   recent developments, and any contradictory viewpoints. 
  //   Focus on filling gaps and adding depth to: ${this.extractKeyTopics(initialResearch.content)}`;

  //   try {
  //     const response = await this.perplexityAPI.post('/chat/completions', {
  //       model: config.perplexity.deepResearchModel,
  //       messages: [
  //         {
  //           role: 'system',
  //           content: 'You are conducting follow-up materials science research to add depth and nuance to initial findings. Focus on recent developments, experimental results, technological applications, and detailed analysis. Use the materials science tetrahedron framework (Structure-Properties-Processing-Performance) to guide your analysis and identify important relationships. Provide your response using proper markdown formatting with clear headers and structured sections.'
  //         },
  //         {
  //           role: 'user',
  //           content: followUpQuery
  //         }
  //       ],
  //       temperature: 0.3,
  //       max_tokens: 3000,
  //       return_citations: true
  //     });

  //     return {
  //       content: this.cleanMarkdown(response.data.choices[0].message.content),
  //       citations: response.data.citations || [],
  //       timestamp: new Date().toISOString(),
  //       type: 'follow_up'
  //     };

  //   } catch (error) {
  //     console.warn('Follow-up research failed, continuing with initial research only:', error.message);
  //     return null;
  //   }
  // }

  // async verifyAndAssessSources(sessionId, primaryResearch, followUpResearch) {
  //   // Combine citations from both research phases
  //   const allCitations = [
  //     ...primaryResearch.citations,
  //     ...(followUpResearch?.citations || [])
  //   ];

  //   // Convert citations to structured source objects
  //   const sources = allCitations.map((citation, index) => {
  //     // Handle both string URLs and object citations
  //     const url = typeof citation === 'string' ? citation : citation.url;
  //     const title = typeof citation === 'object' && citation.title ? 
  //       citation.title : 
  //       this.generateTitleFromUrl(url);
  //     const snippet = typeof citation === 'object' && citation.snippet ? 
  //       citation.snippet : 
  //       `Source content from ${this.getDomainFromUrl(url)}`;

  //     return {
  //       id: index + 1,
  //       title: title,
  //       url: url,
  //       snippet: snippet,
  //       credibilityScore: this.assessSourceCredibility({ url, title }),
  //       type: this.categorizeSource({ url }),
  //       accessDate: new Date().toISOString()
  //     };
  //   });

  //   console.log(`[DEBUG] Converted ${allCitations.length} citations to ${sources.length} structured sources`);
  //   console.log(`[DEBUG] Sample source:`, sources[0]);

  //   return {
  //     primaryResearch,
  //     followUpResearch,
  //     sources,
  //     totalSources: sources.length,
  //     averageCredibility: sources.reduce((sum, s) => sum + s.credibilityScore, 0) / sources.length
  //   };
  // }

  // generateTitleFromUrl(url) {
  //   try {
  //     const domain = new URL(url).hostname.replace('www.', '');
      
  //     // Extract meaningful part from path
  //     const path = new URL(url).pathname;
  //     const pathParts = path.split('/').filter(part => part && part.length > 2);
      
  //     if (pathParts.length > 0) {
  //       const titlePart = pathParts[pathParts.length - 1]
  //         .replace(/-/g, ' ')
  //         .replace(/_/g, ' ')
  //         .split(' ')
  //         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  //         .join(' ');
  //       return `${titlePart} - ${domain}`;
  //     }
      
  //     return `Research Source - ${domain}`;
  //   } catch {
  //     return 'Research Source';
  //   }
  // }

  // getDomainFromUrl(url) {
  //   try {
  //     return new URL(url).hostname.replace('www.', '');
  //   } catch {
  //     return 'Unknown Domain';
  //   }
  // }

  // async synthesizeFindings(sessionId, query, verifiedFindings) {
  //   const { primaryResearch, followUpResearch, sources } = verifiedFindings;

  //   // Extract key findings and themes
  //   const keyFindings = this.extractKeyFindings(primaryResearch.content, followUpResearch?.content);
  //   const topics = this.extractTopics(query, primaryResearch.content);

  //   // Calculate overall confidence based on source quality and consistency
  //   const confidenceScore = this.calculateConfidenceScore(sources, keyFindings);
    
  //   return {
  //     query,
  //     executiveSummary: this.generateExecutiveSummary(primaryResearch.content),
  //     keyFindings,
  //     detailedAnalysis: {
  //       primaryResearch: primaryResearch.content,
  //       followUpResearch: followUpResearch?.content || null
  //     },
  //     sources,
  //     topics,
  //     methodology: 'AI-powered deep research using Perplexity with multi-phase analysis and source verification',
  //     confidenceScore,
  //     limitations: [
  //       'Analysis based on publicly available information',
  //       'Information current as of research date',
  //       'AI-generated synthesis may have interpretation limitations',
  //       'Source availability and accessibility may affect completeness'
  //     ],
  //     metadata: {
  //       researchDuration: 'Multi-phase deep research',
  //       totalSources: sources.length,
  //       averageSourceCredibility: verifiedFindings.averageCredibility,
  //       researchModel: config.perplexity.deepResearchModel,
  //       timestamp: new Date().toISOString()
  //     }
  //   };
  // }

  extractKeyTopics(content) {
    // Simple extraction of key topics from content
    const sentences = content.split('.').slice(0, 3);
    return sentences.join('. ').substring(0, 200) + '...';
  }

  extractKeyFindings(primaryContent, followUpContent = '') {
    const allContent = primaryContent + ' ' + (followUpContent || '');
    
    // More sophisticated extraction with better sentence filtering
    const sentences = allContent
      .split(/[.!?]+/)
      .filter(s => s.trim().length > 50 && s.trim().length < 300)
      .map(s => s.trim());
    
    const findings = [];
    const keywordPatterns = [
      /research shows|studies indicate|evidence suggests|data reveals|analysis shows/i,
      /according to|based on|findings show|results indicate|demonstrates/i,
      /significantly|importantly|notably|primarily|key|critical/i,
      /however|despite|although|nevertheless|conversely/i,
      /materials science|structure|property|processing|performance/i
    ];

    // Prioritize sentences with multiple keywords
    const scoredSentences = sentences.map(sentence => {
      const score = keywordPatterns.reduce((sum, pattern) => 
        sum + (pattern.test(sentence) ? 1 : 0), 0);
      return { sentence, score };
    });

    // Sort by score and take top findings
    const topFindings = scoredSentences
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(item => item.sentence);

    return topFindings.length > 0 ? topFindings : sentences.slice(0, 4);
  }

  extractTopics(query, content) {
    // Enhanced topic extraction with comprehensive materials science focus
    const materialsKeywords = [
      // Core tetrahedron concepts
      'materials', 'structure', 'properties', 'processing', 'performance', 'characterization', 'design', 'sustainability',
      
      // Material classes
      'composite', 'polymer', 'semiconductor', 'quantum', '2D materials', '3D materials', 
      'nano', 'bio', 'mechanical', 'chemical', 'electrical', 'thermal', 'optical', 'magnetic',
      'ceramic', 'metal', 'alloy', 
      
      // New categories from persona-crafter
      'sustainable', 'green chemistry', 'circular economy', 'life cycle assessment', 'bio-based', 'recyclable',
      'additive manufacturing', '3D printing', 'powder bed fusion', 'selective laser melting',
      'computational', 'simulation', 'modeling', 'DFT', 'molecular dynamics', 'machine learning', 'materials informatics',
      
      // Emerging fields
      'autonomous', 'digital twin', 'high-throughput', 'predictive modeling', 'data-driven',
      
      // Industry context
      'commercial', 'manufacturing', 'production', 'scale-up', 'cost', 'market', 'industrial',
      
      // Academic context
      'fundamental', 'theoretical', 'mechanism', 'novel', 'discovery', 'investigation'
    ];
    
    const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const contentWords = content.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    
    // Prioritize materials science terms with enhanced scoring
    const allWords = [...queryWords, ...contentWords];
    const topics = [...new Set(allWords)]
      .sort((a, b) => {
        const aScore = materialsKeywords.includes(a) ? 1 : 0;
        const bScore = materialsKeywords.includes(b) ? 1 : 0;
        return bScore - aScore;
      })
      .slice(0, 8); // Increased from 6 to 8 for better coverage
    
    return topics;
  }

  assessSourceCredibility(citation) {
    const url = citation.url || '';
    const title = citation.title || '';
    
    let score = 70; // Base score
    
    // Domain arrays - preserved your curated lists
    const academicDomains = ['.edu', '.ac.uk', '.ac.jp', '.ac.za', '.edu.cn', '.edu.hk', '.edu.in', '.edu.au', '.edu.it', 
        '.edu.es', '.nl', '.se', '.dk', '.edu.sg', '.ac.il', '.be', '.edu.tw'];
    const governmentDomains = ['.gov.cn', '.gov.hk', '.eu', '.gov.mo', '.gov', '.de', '.gov.uk', '.go.jp', '.gouv.fr', '.go.kr', '.gc.ca', '.gov.in', 
        '.admin.ch', '.gov.au', '.gov.it', '.gob.es', '.gov.se', '.gov.sg', '.gov.il', '.gov.be', '.gov.tw'];
    const materialsScienceSources = [
        'nature.com', 'science.org', 'sciencedirect.com', 'acta-materialia.org', 'cell.com', 'pubs.rsc.org', 
        'pubs.acs.org', 'link.springer.com', 'tms.org', 'asminternational.org', 'advanced.onlinelibrary.wiley.com', 'onlinelibrary.wiley.com'
    ];
    const reputableSources = ['bbc.com', 'reuters.com', 'ap.org', 'npr.org', 'phys.org', 'rsc.org', 'acs.org', 'mrs.org'];
    
    // Penalty arrays
    const blogSources = ['blog', 'blogger.com', 'medium.com', 'wordpress.com'];
    const forumSources = ['forum', 'reddit.com', 'quora.com', 'stackexchange.com'];
    const socialMedia = ['youtube.com', 'facebook.com', 'twitter.com', 'instagram.com'];
    
    // Additive scoring system - sources can accumulate multiple bonuses
    
    // Primary source type bonuses
    if (academicDomains.some(domain => url.includes(domain))) {
        score += 30;
    }
    
    if (governmentDomains.some(domain => url.includes(domain))) {
        score += 20;
    }
    
    // Domain-specific expertise bonus (can stack with academic/gov)
    if (materialsScienceSources.some(source => url.includes(source))) {
        score += 35;
    }
    
    // Reputable news sources bonus
    if (reputableSources.some(source => url.includes(source))) {
        score += 15;
    }
    
    // General organization bonus (only if not already scored above)
    if (url.includes('.org') && !this.hasReceivedPrimaryBonus(url, academicDomains, governmentDomains, materialsScienceSources, reputableSources)) {
        score += 15;
    }
    
    // Wikipedia special case
    if (url.includes('wikipedia.org')) {
        score += 10; // Increased from 5 - useful starting point
    }
    
    // Penalty system
    if (blogSources.some(source => url.includes(source))) {
        score -= 15;
    }
    
    if (forumSources.some(source => url.includes(source))) {
        score -= 20;
    }
    
    if (socialMedia.some(platform => url.includes(platform))) {
        score -= 25;
    }
    
    return Math.max(50, Math.min(100, score));
}

// Helper method to check if URL already received primary bonuses
hasReceivedPrimaryBonus(url, academicDomains, governmentDomains, materialsScienceSources, reputableSources) {
    return academicDomains.some(domain => url.includes(domain)) ||
           governmentDomains.some(domain => url.includes(domain)) ||
           materialsScienceSources.some(source => url.includes(source)) ||
           reputableSources.some(source => url.includes(source));
}

// Categorization of sources
categorizeSource(citation) {
    const url = citation.url || '';
    
    const academicDomains = ['.edu', '.ac.uk', '.ac.jp', '.ac.za', '.edu.cn', '.edu.hk', '.edu.in', '.edu.au'];
    const governmentDomains = ['.gov', '.gov.cn', '.gov.hk', '.eu', '.gov.uk', '.go.jp', '.gouv.fr', '.go.kr', '.gc.ca'];
    const materialsScienceSources = ['nature.com', 'science.org', 'sciencedirect.com', 'acta-materialia.org', 'tms.org', 'asminternational.org'];
    
    // Hierarchical categorization
    if (academicDomains.some(domain => url.includes(domain))) return 'academic';
    if (governmentDomains.some(domain => url.includes(domain))) return 'government';
    if (materialsScienceSources.some(source => url.includes(source))) return 'scientific_journal';
    if (url.includes('.org')) return 'organization';
    if (['bbc.com', 'reuters.com', 'ap.org', 'npr.org'].some(source => url.includes(source))) return 'news_media';
    if (url.includes('.com') || url.includes('.net')) return 'commercial';
    
    return 'web_source';
}

// Confidence calculation with source diversity consideration
calculateConfidenceScore(sources, keyFindings) {
    if (!sources.length) return 0;
    
    // Source quality score
    const sourceScore = sources.reduce((sum, s) => sum + (s.credibilityScore || 50), 0) / sources.length;
    
    // Source diversity bonus
    const sourceTypes = new Set(sources.map(s => this.categorizeSource(s)));
    const diversityBonus = Math.min(15, sourceTypes.size * 3);
    
    // Findings score with diminishing returns
    const findingsScore = Math.min(100, keyFindings.length * 8 + 60);
    
    // Source count score with diminishing returns
    const sourceCountScore = Math.min(25, Math.sqrt(sources.length) * 5);
    
    // Weighted calculation
    const baseScore = (sourceScore * 0.4) + (findingsScore * 0.3) + (sourceCountScore * 0.2) + (diversityBonus * 0.1);
    
    return Math.round(Math.min(100, baseScore));
}

  generateExecutiveSummary(content) {
    // Extract first substantial paragraph as executive summary
    const paragraphs = content.split('\n\n').filter(p => p.length > 100);
    return paragraphs[0]?.substring(0, 300) + '...' || 'Research analysis completed successfully.';
  }

  cleanMarkdown(text) {
    if (!text) return text;
    
    return text
      // Clean up extra whitespace but preserve markdown formatting
      .replace(/\n{4,}/g, '\n\n\n')  // Limit to max 3 consecutive line breaks
      .replace(/\r\n/g, '\n')        // Normalize line endings
      .replace(/\t/g, '  ')          // Convert tabs to spaces
      .trim();
  }
}