export class JudgeAgent {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.name = 'A3-Judge';
  }

  async evaluate(sessionId, query, researchResults, evaluationFramework) {
    await this.orchestrator.logActivity(
      sessionId,
      this.name,
      'initialization',
      `Taking on role of ${evaluationFramework.judgePersona.title} for comprehensive evaluation...`
    );

    const phases = [
      'Reviewing research findings and methodology',
      'Applying evaluation criteria and rubric',
      'Scoring each criterion with detailed rationale',
      'Calculating weighted overall assessment',
      'Formulating recommendations and insights',
      'Preparing final verdict and summary'
    ];

    const scores = {};
    
    for (let i = 0; i < phases.length; i++) {
      await this.simulateDelay(1000 + Math.random() * 1500);
      
      if (i === 2) { // Scoring phase
        for (const criterion of evaluationFramework.criteria) {
          const score = this.scoreCriterion(criterion, researchResults);
          scores[criterion.name] = score;
          
          await this.orchestrator.logActivity(
            sessionId,
            this.name,
            'scoring',
            `${criterion.name}: ${score.score}/100 - ${score.rationale}`,
            { criterion: criterion.name, score: score.score }
          );
          
          await this.simulateDelay(400);
        }
      }
      
      await this.orchestrator.logActivity(
        sessionId,
        this.name,
        'evaluation_phase',
        phases[i],
        { phase: i + 1, total: phases.length }
      );
    }

    const verdict = this.generateFinalVerdict(query, researchResults, evaluationFramework, scores);

    await this.orchestrator.logActivity(
      sessionId,
      this.name,
      'completion',
      `Final verdict: ${verdict.overallScore}/100 (${verdict.assessment}) - ${verdict.recommendation}`
    );

    await this.orchestrator.saveResult(
      sessionId,
      this.name,
      'final_verdict',
      verdict,
      verdict.overallScore,
      verdict.confidence
    );

    return verdict;
  }

  scoreCriterion(criterion, researchResults) {
    // Simulate realistic scoring based on criterion type
    let baseScore = 70 + Math.random() * 25; // 70-95 range
    
    // Adjust based on research quality indicators
    if (researchResults.confidenceScore > 85) baseScore += 5;
    if (researchResults.sources.length >= 4) baseScore += 3;
    if (researchResults.sources.some(s => s.type === 'academic')) baseScore += 5;
    
    const score = Math.min(100, Math.max(0, Math.round(baseScore)));
    
    const rationale = this.generateRationale(criterion, score, researchResults);
    
    return { score, rationale };
  }

  generateRationale(criterion, score, researchResults) {
    const rationales = {
      'Accuracy': [
        'Information aligns with verified sources and established facts',
        'Claims are well-supported by credible evidence',
        'Factual consistency maintained throughout analysis'
      ],
      'Relevance': [
        'Research directly addresses the core query elements',
        'Findings maintain strong connection to requested topic',
        'Analysis stays focused on pertinent aspects'
      ],
      'Completeness': [
        'Comprehensive coverage of major topic dimensions',
        'Key aspects adequately explored and documented',
        'Analysis demonstrates thorough investigation approach'
      ],
      'Source Quality': [
        'Sources demonstrate high credibility and authority',
        'Mix of academic and authoritative references utilized',
        'Source selection shows appropriate discrimination'
      ],
      'Methodology': [
        'Research approach follows sound analytical principles',
        'Systematic methodology evident in investigation process',
        'Appropriate methods selected for query type'
      ]
    };

    const criterionRationales = rationales[criterion.name] || ['Standard evaluation criteria applied'];
    const selectedRationale = criterionRationales[Math.floor(Math.random() * criterionRationales.length)];
    
    if (score >= 90) return `Excellent: ${selectedRationale}`;
    if (score >= 80) return `Strong: ${selectedRationale}`;
    if (score >= 70) return `Good: ${selectedRationale}`;
    if (score >= 60) return `Fair: ${selectedRationale}`;
    return `Needs improvement: ${selectedRationale}`;
  }

  generateFinalVerdict(query, researchResults, evaluationFramework, scores) {
    // Calculate weighted overall score
    let overallScore = 0;
    for (const criterion of evaluationFramework.criteria) {
      const criterionScore = scores[criterion.name];
      overallScore += criterionScore.score * criterion.weight;
    }
    overallScore = Math.round(overallScore);

    // Determine assessment level
    let assessment, recommendation;
    if (overallScore >= 90) {
      assessment = 'Excellent';
      recommendation = 'Research exceeds standards with exceptional quality and thoroughness';
    } else if (overallScore >= 80) {
      assessment = 'High Quality';
      recommendation = 'Research meets high standards with strong evidence and analysis';
    } else if (overallScore >= 70) {
      assessment = 'Satisfactory';
      recommendation = 'Research meets basic requirements with adequate support';
    } else if (overallScore >= 60) {
      assessment = 'Needs Enhancement';
      recommendation = 'Research requires additional verification and depth';
    } else {
      assessment = 'Insufficient';
      recommendation = 'Research needs significant improvement in multiple areas';
    }

    return {
      sessionId: null,
      query,
      overallScore,
      assessment,
      recommendation,
      detailedScores: scores,
      evaluationFramework: evaluationFramework.queryType,
      judgePersona: evaluationFramework.judgePersona.title,
      confidence: Math.min(0.95, researchResults.confidenceScore / 100 + 0.1),
      strengths: this.identifyStrengths(scores),
      improvements: this.identifyImprovements(scores),
      timestamp: new Date().toISOString()
    };
  }

  identifyStrengths(scores) {
    return Object.entries(scores)
      .filter(([_, scoreData]) => scoreData.score >= 85)
      .map(([criterion, _]) => `Strong ${criterion.toLowerCase()} with reliable supporting evidence`);
  }

  identifyImprovements(scores) {
    return Object.entries(scores)
      .filter(([_, scoreData]) => scoreData.score < 75)
      .map(([criterion, _]) => `Enhanced ${criterion.toLowerCase()} would strengthen overall analysis`);
  }

  async simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}