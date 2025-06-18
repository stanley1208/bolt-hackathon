export class PersonaCrafterAgent {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.name = 'A2-Persona-Crafter';
  }

  async createFramework(sessionId, query) {
    await this.orchestrator.logActivity(
      sessionId,
      this.name,
      'initialization',
      'Analyzing query to determine optimal evaluation framework...'
    );

    const phases = [
      'Categorizing query type and domain',
      'Identifying relevant expertise requirements',
      'Designing evaluation criteria and metrics',
      'Calibrating scoring rubric and weights',
      'Defining judge persona characteristics',
      'Validating framework completeness'
    ];

    for (let i = 0; i < phases.length; i++) {
      await this.simulateDelay(600 + Math.random() * 1000);
      await this.orchestrator.logActivity(
        sessionId,
        this.name,
        'framework_phase',
        phases[i],
        { phase: i + 1, total: phases.length }
      );
    }

    const framework = this.generateEvaluationFramework(query);

    await this.orchestrator.logActivity(
      sessionId,
      this.name,
      'completion',
      `Evaluation framework created with ${framework.criteria.length} criteria and ${framework.judgePersona.expertise.length} expertise domains.`
    );

    await this.orchestrator.saveResult(
      sessionId,
      this.name,
      'evaluation_framework',
      framework
    );

    return framework;
  }

  generateEvaluationFramework(query) {
    const queryType = this.categorizeQuery(query);
    const criteria = this.generateCriteria(queryType);
    const judgePersona = this.createJudgePersona(queryType);
    
    return {
      queryType,
      criteria,
      judgePersona,
      scoringMethod: 'Weighted multi-criteria assessment',
      maxScore: 100,
      passingThreshold: 70,
      created: new Date().toISOString()
    };
  }

  categorizeQuery(query) {
    const categories = [
      { 
        name: 'Civil Code', 
        keywords: ['contract formation', 'offer acceptance', 'consideration', 'breach of contract', 'contract remedies', 'specific performance', 'damages', 'contract interpretation', 'parol evidence', 'statute of frauds', 'civ'] 
      },
      { 
        name: 'Commercial Code', 
        keywords: ['sale of goods', 'ucc', 'uniform commercial code', 'merchant', 'commercial reasonableness', 'goods', 'warehouse receipt', 'bill of lading', 'secured transactions', 'com'] 
      },
      { 
        name: 'Business and Professions Code', 
        keywords: ['contractor contract', 'home improvement contract', 'section 7159', 'professional services', 'licensed contractor', 'construction contract', 'bpc', 'contractor licensing'] 
      },
      { 
        name: 'Code of Civil Procedure', 
        keywords: ['contract lawsuit', 'contract litigation', 'contract dispute', 'contract enforcement', 'contract trial', 'contract appeal', 'ccp', 'civil procedure'] 
      },
      { 
        name: 'Evidence Code', 
        keywords: ['contract evidence', 'parol evidence rule', 'contract testimony', 'contract proof', 'contract admissibility', 'evid', 'evidence'] 
      },
      { 
        name: 'Labor Code', 
        keywords: ['employment contract', 'labor contract', 'wage contract', 'non-compete', 'section 925', 'employment agreement', 'lab', 'labor'] 
      },
      { 
        name: 'Public Contract Code', 
        keywords: ['government contract', 'public contract', 'bidding contract', 'public works', 'government procurement', 'pcc', 'public contracting'] 
      },
      { 
        name: 'General Contract Law', 
        keywords: ['contract', 'agreement', 'terms', 'conditions', 'obligations', 'performance', 'breach', 'enforcement'] 
      }
    ];

    const queryLower = query.toLowerCase();
    for (const category of categories) {
      if (category.keywords.some(keyword => queryLower.includes(keyword))) {
        return category.name;
      }
    }
    
    return 'General Contract Law';
  }

  generateCriteria(queryType) {
    const baseCriteria = [
      { name: 'Contract Formation Analysis', weight: 0.25, description: 'Proper analysis of offer, acceptance, consideration, and capacity under California law' },
      { name: 'Contract Interpretation', weight: 0.20, description: 'Correct application of California contract interpretation principles and parol evidence rules' },
      { name: 'Statutory Compliance', weight: 0.20, description: 'Adherence to relevant California statutes (Civil Code, Commercial Code, etc.)' },
      { name: 'Case Law Integration', weight: 0.15, description: 'Proper citation and application of California contract law precedent' },
      { name: 'Practical Application', weight: 0.20, description: 'Actionable legal guidance for contract drafting, performance, and enforcement' }
    ];

    // Add specialized criteria based on California code type
    const specializedCriteria = {
      'Civil Code': [
        { name: 'Contract Formation Elements', weight: 0.1, description: 'Analysis of offer, acceptance, consideration, capacity, and mutual assent' },
        { name: 'Breach and Remedies', weight: 0.1, description: 'Understanding of material breach, anticipatory breach, and available remedies' }
      ],
      'Commercial Code': [
        { name: 'UCC Article 2 Analysis', weight: 0.1, description: 'Proper application of sale of goods provisions and merchant standards' },
        { name: 'Commercial Reasonableness', weight: 0.1, description: 'Understanding of commercial standards and industry practices' }
      ],
      'Business and Professions Code': [
        { name: 'Professional Contract Requirements', weight: 0.1, description: 'Understanding of licensed professional contract obligations and disclosures' },
        { name: 'Contractor Law Compliance', weight: 0.1, description: 'Knowledge of construction contract requirements under Section 7159' }
      ],
      'Code of Civil Procedure': [
        { name: 'Contract Litigation Analysis', weight: 0.1, description: 'Understanding of contract dispute procedures and remedies' },
        { name: 'Enforcement Procedures', weight: 0.1, description: 'Knowledge of contract enforcement mechanisms and judicial remedies' }
      ],
      'Evidence Code': [
        { name: 'Contract Evidence Standards', weight: 0.1, description: 'Knowledge of evidence rules for proving contract terms and performance' },
        { name: 'Parol Evidence Application', weight: 0.1, description: 'Proper application of parol evidence rule in contract interpretation' }
      ],
      'Labor Code': [
        { name: 'Employment Contract Analysis', weight: 0.1, description: 'Understanding of California employment contract restrictions and requirements' },
        { name: 'Non-Compete Enforcement', weight: 0.1, description: 'Knowledge of Section 925 restrictions on non-compete agreements' }
      ],
      'Public Contract Code': [
        { name: 'Government Contract Procedures', weight: 0.1, description: 'Understanding of public agency contracting and bidding requirements' },
        { name: 'Public Bidding Compliance', weight: 0.1, description: 'Knowledge of competitive bidding and procurement procedures' }
      ],
      'General Contract Law': [
        { name: 'Multi-Code Integration', weight: 0.1, description: 'Effective integration of multiple California codes in contract analysis' },
        { name: 'Comprehensive Contract Analysis', weight: 0.1, description: 'Holistic approach to contract law across all relevant California codes' }
      ]
    };

    let criteria = [...baseCriteria];
    if (specializedCriteria[queryType]) {
      criteria = criteria.concat(specializedCriteria[queryType]);
      // Normalize weights
      const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
      criteria = criteria.map(c => ({ ...c, weight: c.weight / totalWeight }));
    }

    return criteria;
  }

  createJudgePersona(queryType) {
    const personas = {
      'Civil Code': {
        title: 'California Contract Law Judge',
        expertise: ['California Contract Formation', 'Contract Interpretation', 'Breach of Contract', 'Contract Remedies', 'Civil Code Analysis'],
        experience: '18+ years in California contract law as Superior Court judge and private practice attorney',
        approach: 'Methodical analysis of contract formation elements with emphasis on California Civil Code statutory interpretation and established precedent'
      },
      'Commercial Code': {
        title: 'California Commercial Law Judge',
        expertise: ['Uniform Commercial Code', 'Sale of Goods Contracts', 'Commercial Transactions', 'Merchant Standards', 'California Commercial Code'],
        experience: '15+ years in commercial litigation and business court assignments',
        approach: 'Practical focus on commercial reasonableness standards and UCC integration with California contract principles'
      },
      'Business and Professions Code': {
        title: 'California Professional Contracts Judge',
        expertise: ['Licensed Professional Contracts', 'Contractor Law', 'Professional Licensing', 'Construction Contracts', 'Business & Professions Code Section 7159'],
        experience: '20+ years handling professional licensing disputes and construction contract litigation',
        approach: 'Strict adherence to statutory disclosure requirements with focus on consumer protection in professional service contracts'
      },
      'Code of Civil Procedure': {
        title: 'California Contract Litigation Judge',
        expertise: ['Contract Dispute Resolution', 'Civil Procedure', 'Evidence in Contract Cases', 'Remedies and Enforcement', 'California Precedent Analysis'],
        experience: '16+ years presiding over contract litigation and commercial disputes',
        approach: 'Emphasis on procedural fairness and practical resolution of contract disputes with attention to California precedent'
      },
      'Evidence Code': {
        title: 'California Contract Evidence Specialist Judge',
        expertise: ['Contract Evidence Standards', 'Parol Evidence Rule', 'Contract Interpretation Evidence', 'California Evidence Code', 'Proof of Contract Terms'],
        experience: '14+ years specializing in complex contract evidence issues and interpretation disputes',
        approach: 'Careful application of evidence rules to contract interpretation with focus on admissibility of extrinsic evidence'
      },
      'Labor Code': {
        title: 'California Employment Contract Judge',
        expertise: ['Employment Contracts', 'California Labor Code', 'Wage and Hour Contracts', 'Non-Compete Agreements', 'Employment Law'],
        experience: '12+ years handling employment contract disputes and labor law violations',
        approach: 'Strong emphasis on California worker protection statutes and employment contract restrictions under Labor Code Section 925'
      },
      'Public Contract Code': {
        title: 'California Public Contract Judge',
        expertise: ['Government Contracting', 'Public Bidding Procedures', 'Public Contract Code', 'Administrative Law', 'Government Procurement'],
        experience: '17+ years in public law and government contract disputes',
        approach: 'Strict adherence to public contracting procedures with emphasis on transparency and competitive bidding requirements'
      },
      'General Contract Law': {
        title: 'Senior California Contract Law Judge',
        expertise: ['California Contract Law', 'Multi-Code Contract Analysis', 'Complex Commercial Disputes', 'Contract Interpretation', 'Legal Research and Analysis'],
        experience: '22+ years in comprehensive contract law practice and judicial service',
        approach: 'Comprehensive analysis integrating multiple California codes with emphasis on practical contract enforcement and equitable remedies'
      }
    };

    return personas[queryType] || personas['General Contract Law'];
  }

  async simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}