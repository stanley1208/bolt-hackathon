export class Judge {
  constructor() {
  }

  async evaluateResearch(query, researchResults, evaluationFramework, judgePersona) {
    try {
      console.log('Judge: Starting local evaluation...');
      
      // Perform local evaluation based on research results and framework
      const evaluation = this.performLocalEvaluation(query, researchResults, evaluationFramework, judgePersona);
      
      console.log('Judge: Local evaluation completed successfully');
      
      return evaluation;
      
    } catch (error) {
      console.error('Judge evaluation error:', error);
      throw new Error(`Judge evaluation failed: ${error.message}`);
    }
  }

  performLocalEvaluation(query, researchResults, evaluationFramework, judgePersona) {
    // Extract criteria from framework
    const criteria = evaluationFramework.criteria || [];
    
    // Initialize scores
    const detailedScores = {};
    let totalScore = 0;
    const strengths = [];
    const improvements = [];
    
    // Evaluate each criterion
    criteria.forEach(criterion => {
      const score = this.evaluateCriterion(criterion, researchResults, query);
      detailedScores[criterion.name] = {
        score: score.score,
        rationale: score.rationale,
        strengths: score.strengths,
        improvements: score.improvements
      };
      
      totalScore += score.score;
      
      if (score.strengths) strengths.push(...score.strengths);
      if (score.improvements) improvements.push(...score.improvements);
    });
    
    // Calculate overall score (0-100)
    const overallScore = criteria.length > 0 ? Math.round(totalScore / criteria.length * 10) : 0;
    
    // Determine assessment level
    const assessment = this.getAssessmentLevel(overallScore);
    
    // Generate recommendation
    const recommendation = this.generateRecommendation(overallScore, researchResults, judgePersona);
    
    return {
      query: researchResults.query,
      overallScore,
      assessment,
      recommendation,
      detailedScores,
      confidence: Math.min(95, overallScore + 5), // Confidence based on score
      strengths: [...new Set(strengths)].slice(0, 5), // Remove duplicates, limit to 5
      improvements: [...new Set(improvements)].slice(0, 5), // Remove duplicates, limit to 5
      timestamp: new Date().toISOString()
    };
  }

  evaluateCriterion(criterion, researchResults, query) {
    const { name, weight, description } = criterion;
    let score = 5; // Default middle score
    let rationale = '';
    let strengths = [];
    let improvements = [];
    
    // Evaluate based on criterion type
    switch (name) {
      case 'Scientific Accuracy':
        score = this.evaluateScientificAccuracy(researchResults);
        rationale = 'Evaluated consistency with materials science principles and source credibility';
        break;
        
      case 'Technical Depth':
        score = this.evaluateTechnicalDepth(researchResults);
        rationale = 'Assessed depth of technical analysis and materials science terminology usage';
        break;
        
      case 'Source Quality':
        score = this.evaluateSourceQuality(researchResults);
        rationale = 'Analyzed source credibility, diversity, and relevance to materials science';
        break;
        
      case 'Research Completeness':
        score = this.evaluateResearchCompleteness(researchResults);
        rationale = 'Assessed comprehensiveness of research coverage and analysis depth';
        break;
        
      default:
        score = this.evaluateGenericCriterion(criterion, researchResults);
        rationale = `Evaluated ${name.toLowerCase()} based on research quality and relevance`;
    }
    
    // Generate strengths and improvements
    if (score >= 7) {
      strengths.push(`Strong ${name.toLowerCase()} demonstrated`);
    } else if (score <= 3) {
      improvements.push(`Needs improvement in ${name.toLowerCase()}`);
    }
    
    return { score, rationale, strengths, improvements };
  }

  evaluateScientificAccuracy(researchResults) {
    let score = 5;
    
    // Check source credibility
    if (researchResults.metadata?.averageSourceCredibility > 80) score += 2;
    else if (researchResults.metadata?.averageSourceCredibility < 60) score -= 2;
    
    // Check for materials science terminology
    const content = JSON.stringify(researchResults).toLowerCase();
    const materialsTerms = ['structure', 'properties', 'processing', 'performance', 'material', 'crystal', 'phase'];
    const termCount = materialsTerms.filter(term => content.includes(term)).length;
    if (termCount >= 5) score += 1;
    else if (termCount < 2) score -= 1;
    
    return Math.max(1, Math.min(10, score));
  }

  evaluateTechnicalDepth(researchResults) {
    let score = 5;
    
    // Check analysis length and detail
    const analysisLength = researchResults.detailedAnalysis?.primaryResearch?.length || 0;
    if (analysisLength > 2000) score += 2;
    else if (analysisLength < 500) score -= 2;
    
    // Check for technical concepts and materials science terminology
    const content = JSON.stringify(researchResults).toLowerCase();
    const technicalTerms = ['microstructure', 'thermodynamics', 'kinetics', 'characterization', 'mechanical properties'];
    const termCount = technicalTerms.filter(term => content.includes(term)).length;
    if (termCount >= 3) score += 1;
    else if (termCount === 0) score -= 1;
    
    // Check for appropriate materials science context (tetrahedron as background)
    const materialsTerms = ['structure', 'properties', 'processing', 'performance', 'material', 'crystal', 'phase'];
    const materialsTermCount = materialsTerms.filter(term => content.includes(term)).length;
    if (materialsTermCount >= 4) score += 1; // Good materials science coverage
    
    return Math.max(1, Math.min(10, score));
  }

  evaluateSourceQuality(researchResults) {
    let score = 5;
    
    // Check number of sources
    const sourceCount = researchResults.sources?.length || 0;
    if (sourceCount >= 10) score += 2;
    else if (sourceCount >= 5) score += 1;
    else if (sourceCount < 3) score -= 1;
    
    // Check source credibility
    if (researchResults.metadata?.averageSourceCredibility > 85) score += 1;
    else if (researchResults.metadata?.averageSourceCredibility < 50) score -= 1;
    
    return Math.max(1, Math.min(10, score));
  }

  evaluateResearchCompleteness(researchResults) {
    let score = 5;
    
    // Check if all research sections are present
    const hasKeyFindings = researchResults.keyFindings && researchResults.keyFindings.length > 0;
    const hasDetailedAnalysis = researchResults.detailedAnalysis?.primaryResearch;
    const hasSources = researchResults.sources && researchResults.sources.length > 0;
    
    if (hasKeyFindings && hasDetailedAnalysis && hasSources) score += 2;
    else if (!hasKeyFindings || !hasDetailedAnalysis || !hasSources) score -= 2;
    
    return Math.max(1, Math.min(10, score));
  }

  evaluateGenericCriterion(criterion, researchResults) {
    // Generic evaluation based on research quality indicators
    let score = 5;
    
    const content = JSON.stringify(researchResults).toLowerCase();
    const queryTerms = criterion.description?.toLowerCase().split(' ') || [];
    const relevanceScore = queryTerms.filter(term => 
      term.length > 3 && content.includes(term)
    ).length;
    
    if (relevanceScore >= 3) score += 2;
    else if (relevanceScore === 0) score -= 1;
    
    return Math.max(1, Math.min(10, score));
  }

  getAssessmentLevel(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'High Quality';
    if (score >= 70) return 'Satisfactory';
    if (score >= 60) return 'Needs Enhancement';
    return 'Insufficient';
  }

  generateRecommendation(score, researchResults, judgePersona) {
    const personaTitle = judgePersona?.title || 'Materials Science Expert';
    
    if (score >= 90) {
      return `Excellent research demonstrating comprehensive understanding of materials science principles. ${personaTitle} assessment: Outstanding quality with strong tetrahedron framework integration.`;
    } else if (score >= 80) {
      return `High-quality research with solid materials science foundation. ${personaTitle} assessment: Strong technical analysis with good source credibility.`;
    } else if (score >= 70) {
      return `Satisfactory research meeting basic materials science requirements. ${personaTitle} assessment: Adequate coverage with room for technical depth improvement.`;
    } else if (score >= 60) {
      return `Research needs enhancement in materials science analysis. ${personaTitle} assessment: Requires improved technical depth and tetrahedron framework integration.`;
    } else {
      return `Insufficient research quality for materials science standards. ${personaTitle} assessment: Significant improvements needed in technical accuracy and completeness.`;
    }
  }
}