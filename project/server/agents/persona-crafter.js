export class PersonaCrafterAgent {
  constructor(orchestrator) {
    this.orchestrator = orchestrator;
    this.name = 'A2-Persona-Crafter';
    this.emergingKeywords = ['machine learning', 'AI-driven', 'autonomous', 'digital twin', 'high-throughput', 'materials informatics', 'predictive modeling', 'data-driven'];
    this.industryKeywords = ['commercial', 'manufacturing', 'production', 'scale-up', 'cost', 'market', 'industrial', 'supply chain'];
    this.academicKeywords = ['fundamental', 'theoretical', 'mechanism', 'novel', 'discovery', 'investigation', 'characterization', 'synthesis'];
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
      `Evaluation framework created with ${framework.criteria.length} criteria and ${framework.judgePersona.expertise.length} expertise domains. Confidence: ${(framework.confidence * 100).toFixed(1)}%`
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
    const queryAnalysis = this.analyzeQuery(query);
    const categories = this.categorizeQuery(query);
    const criteria = this.generateCriteria(categories, queryAnalysis);
    const judgePersona = this.createJudgePersona(categories, queryAnalysis);
    
    return {
      queryType: categories.primary,
      relevantCategories: categories.all,
      queryAnalysis,
      criteria,
      judgePersona,
      scoringMethod: 'Weighted multi-criteria assessment',
      maxScore: 100,
      passingThreshold: 70,
      confidence: categories.confidence,
      created: new Date().toISOString()
    };
  }
  analyzeQuery(query) {
    const queryLower = query.toLowerCase();
    
    // Assess query complexity
    const complexityIndicators = ['synthesis', 'characterization', 'optimization', 'design', 'modeling', 'analysis'];
    const complexityScore = complexityIndicators.filter(indicator => queryLower.includes(indicator)).length;
    
    // Detect context (industry vs academic)
    const industryScore = this.industryKeywords.filter(kw => queryLower.includes(kw)).length;
    const academicScore = this.academicKeywords.filter(kw => queryLower.includes(kw)).length;
    const context = industryScore > academicScore ? 'industry' : 'academic';
    
    // Check for emerging field indicators
    const isEmergingField = this.emergingKeywords.some(kw => queryLower.includes(kw));
    
    // Assess interdisciplinary nature
    const interdisciplinaryIndicators = ['multi', 'inter', 'cross', 'hybrid', 'composite', 'interface'];
    const isInterdisciplinary = interdisciplinaryIndicators.some(indicator => queryLower.includes(indicator));
    
    return {
      complexity: complexityScore > 2 ? 'high' : (complexityScore > 0 ? 'medium' : 'low'),
      context,
      isEmergingField,
      isInterdisciplinary,
      queryLength: query.split(' ').length
    };
  }

  categorizeQuery(query) {
    const categories = [
      { 
        name: 'Nanomaterials', 
        keywords: ['nanoparticles', 'nanotubes', 'nanowires', 'quantum dots', 'graphene', 'fullerenes', 'nano', 'nanotechnology', 'nanoscale', '2D materials', 'quantum', 'MOFs', 'perovskites', 'quantum confinement', 'surface plasmons', 'nanocomposites', 'self-assembly', 'bottom-up synthesis', 'top-down fabrication', 'nanocrystalline', 'monolayer', 'bilayer', 'heterostructure'] 
      },
      { 
        name: 'Polymers', 
        keywords: ['polymer', 'plastic', 'biodegradable', 'thermoplastic', 'thermoset', 'composite', 'polymerization', 'monomer', 'physical crosslink', 'dynamic crosslink', 'chemical crosslink', 'click chemistry', 'macromolecule', 'crosslinking', 'glass transition', 'viscoelasticity', 'rheology', 'degradation', 'additives', 'plasticizers', 'copolymers', 'elastomer', 'biopolymer', 'molecular weight', 'chain entanglement'] 
      },
      { 
        name: 'Metals and Alloys', 
        keywords: ['metal', 'alloy', 'steel', 'aluminum', 'titanium', 'copper', 'zinc', 'metallurgy', 'crystalline', 'metallic', 'precipitation hardening', 'work hardening', 'grain boundaries', 'dislocations', 'fatigue', 'corrosion', 'oxidation', 'intermetallics', 'phase diagram', 'microstructure', 'heat treatment'] 
      },
      { 
        name: 'Ceramics', 
        keywords: ['ceramic', 'glass', 'porcelain', 'refractory', 'oxide', 'silicate', 'inorganic', 'non-metallic', 'sintering', 'densification', 'grain growth', 'fracture toughness', 'thermal shock', 'dielectric', 'piezoelectric', 'ferroelectric'] 
      },
      { 
        name: 'Biomaterials', 
        keywords: ['biomaterial', 'biocompatible', 'medical device', 'tissue engineering', 'biodegradable', 'bioactive', 'implant', 'bio', 'biointegration', 'cytotoxicity', 'hemocompatibility', 'osseointegration', 'scaffold', 'hydrogel', 'drug delivery', 'regenerative medicine'] 
      },
      { 
        name: 'Electronic Materials', 
        keywords: ['semiconductor', 'conductor', 'insulator', 'electronic', 'photovoltaic', 'solar cell', 'transistor', 'integrated circuit', 'electrical', 'optical', 'magnetic', 'bandgap engineering', 'doping', 'heterojunctions', 'photoluminescence', 'ferroelectrics', 'superconductors', 'spintronics', 'quantum computing'] 
      },
      { 
        name: 'Energy Materials', 
        keywords: ['battery', 'fuel cell', 'catalyst', 'energy storage', 'lithium ion', 'hydrogen', 'renewable energy', 'electrode', 'thermal', 'electrolyte', 'anode', 'cathode', 'supercapacitor', 'thermoelectric', 'photocatalysis', 'energy conversion', 'power density'] 
      },
      { 
        name: 'Sustainable Materials', 
        keywords: ['sustainable', 'green chemistry', 'circular economy', 'life cycle assessment', 'bio-based', 'recyclable', 'renewable', 'eco-friendly', 'carbon footprint', 'environmental impact', 'waste reduction', 'upcycling', 'biodegradation'] 
      },
      { 
        name: 'Additive Manufacturing', 
        keywords: ['3D printing', 'additive manufacturing', 'powder bed fusion', 'selective laser melting', 'build orientation', 'layer adhesion', 'post-processing', 'support structures', 'print parameters', 'material jetting', 'stereolithography'] 
      },
      { 
        name: 'Computational Materials', 
        keywords: ['computational', 'simulation', 'modeling', 'DFT', 'molecular dynamics', 'finite element', 'machine learning', 'materials informatics', 'high-throughput screening', 'materials genome', 'artificial intelligence', 'data mining', 'predictive modeling'] 
      },
      { 
        name: 'General Materials Science', 
        keywords: ['material', 'property', 'structure', 'composition', 'characterization', 'synthesis', 'processing', 'application', 'performance', 'design', 'sustainability', 'mechanical', 'chemical', 'tetrahedron', 'structure-property', 'processing-performance', 'van der waals', 'covalent', 'ionic'] 
      }
    ];

    const queryLower = query.toLowerCase();
    
    // Enhanced scoring system with context awareness
    const categoryScores = categories.map(category => {
      const score = category.keywords.reduce((total, keyword) => {
        if (queryLower.includes(keyword)) {
          // Context-based weighting - longer keywords get higher scores
          const lengthWeight = keyword.length > 8 ? 3 : (keyword.length > 5 ? 2 : 1);
          // Check for compound terms
          const contextMultiplier = this.getContextMultiplier(keyword, queryLower);
          return total + lengthWeight * contextMultiplier;
        }
        return total;
      }, 0);
      return { ...category, score: score / category.keywords.length };
    });
    
    // Multi-label classification - return multiple relevant categories
    const maxScore = Math.max(...categoryScores.map(c => c.score));
    const threshold = maxScore * 0.6; // Categories within 60% of max score are relevant
    
    const relevantCategories = categoryScores
      .filter(c => c.score >= threshold && c.score > 0)
      .sort((a, b) => b.score - a.score);
    
    const primaryCategory = relevantCategories.length > 0 ? relevantCategories[0].name : 'General Materials Science';
    const confidence = Math.min(maxScore / 2.0, 1.0); // Normalize confidence score
    
    return {
      primary: primaryCategory,
      all: relevantCategories.map(c => ({ name: c.name, score: c.score })),
      confidence
    };
  }

  getContextMultiplier(keyword, queryText) {
    // Boost score if keyword appears in technical context
    const technicalIndicators = ['synthesis', 'characterization', 'properties', 'performance', 'analysis', 'fabrication', 'processing'];
    const hasContext = technicalIndicators.some(indicator => queryText.includes(indicator));
    return hasContext ? 1.5 : 1.0;
  }

  generateCriteria(categories, queryAnalysis) {
    const baseCriteria = [
      { name: 'Scientific Accuracy', weight: 0.20, description: 'Accuracy of scientific facts, data, and technical information presented in the research' },
      { name: 'Research Methodology', weight: 0.18, description: 'Quality and appropriateness of research methods, experimental design, and analytical approaches' },
      { name: 'Source Quality', weight: 0.18, description: 'Credibility and relevance of scientific sources, peer-reviewed literature, and authoritative references' },
      { name: 'Technical Depth', weight: 0.20, description: 'Depth of technical analysis, understanding of materials properties, and scientific principles. Considers materials science framework understanding as background context.' },
      { name: 'Safety and Ethics Awareness', weight: 0.12, description: 'Consideration of safety protocols, environmental impact, ethical implications, and regulatory compliance' },
      { name: 'Practical Implementation', weight: 0.12, description: 'Assessment of scalability, manufacturability, cost-effectiveness, and commercial viability' }
    ];

    // Enhanced specialized criteria
    const specializedCriteria = {
      'Nanomaterials': [
        { name: 'Nanoscale Phenomena Understanding', weight: 0.12, description: 'Deep understanding of size-dependent properties, quantum effects, and surface-to-volume ratio impacts' },
        { name: 'Advanced Characterization Mastery', weight: 0.10, description: 'Knowledge of nanoscale characterization techniques (TEM, SEM, AFM, STM, XPS, Raman)' },
        { name: 'Safety and Toxicology Awareness', weight: 0.08, description: 'Understanding of nanotoxicology, environmental fate, and safety protocols for nanomaterials' }
      ],
      'Polymers': [
        { name: 'Polymer Structure-Property Mastery', weight: 0.12, description: 'Deep understanding of molecular architecture effects on bulk properties and performance' },
        { name: 'Processing-Performance Optimization', weight: 0.10, description: 'Knowledge of polymer processing techniques and their impact on final properties' },
        { name: 'Sustainability Integration', weight: 0.08, description: 'Understanding of biodegradability, recyclability, and life cycle considerations' }
      ],
      'Metals and Alloys': [
        { name: 'Microstructure-Property Correlations', weight: 0.12, description: 'Understanding of phase relationships, grain structure, and defect impacts on properties' },
        { name: 'Processing-Structure Control', weight: 0.10, description: 'Knowledge of heat treatment, deformation processing, and microstructural evolution' },
        { name: 'Failure Analysis Expertise', weight: 0.08, description: 'Understanding of fatigue, corrosion, fracture mechanisms, and failure prevention' }
      ],
      'Ceramics': [
        { name: 'Ceramic Processing Science', weight: 0.12, description: 'Understanding of powder processing, sintering mechanisms, and densification control' },
        { name: 'Brittle Material Behavior', weight: 0.10, description: 'Knowledge of fracture mechanics, thermal shock, and reliability considerations' },
        { name: 'Functional Property Design', weight: 0.08, description: 'Understanding of dielectric, magnetic, and optical property optimization' }
      ],
      'Biomaterials': [
        { name: 'Biocompatibility Assessment', weight: 0.12, description: 'Deep understanding of biological interactions, immune response, and biointegration' },
        { name: 'Regulatory and Clinical Awareness', weight: 0.10, description: 'Knowledge of FDA approval processes, clinical testing, and medical device standards' },
        { name: 'Tissue Engineering Integration', weight: 0.08, description: 'Understanding of cell-material interactions and regenerative medicine applications' }
      ],
      'Electronic Materials': [
        { name: 'Electronic Property Engineering', weight: 0.12, description: 'Understanding of band structure, carrier transport, and electronic device physics' },
        { name: 'Device Integration Challenges', weight: 0.10, description: 'Knowledge of fabrication processes, interface engineering, and device reliability' },
        { name: 'Emerging Technology Awareness', weight: 0.08, description: 'Understanding of quantum materials, spintronics, and next-generation devices' }
      ],
      'Energy Materials': [
        { name: 'Electrochemical Mastery', weight: 0.12, description: 'Deep understanding of energy storage/conversion mechanisms and electrochemical stability' },
        { name: 'System Integration Perspective', weight: 0.10, description: 'Knowledge of device-level performance, safety, and system-level considerations' },
        { name: 'Sustainability and Lifecycle', weight: 0.08, description: 'Understanding of resource availability, recycling, and environmental impact' }
      ],
      'Sustainable Materials': [
        { name: 'Lifecycle Assessment Expertise', weight: 0.12, description: 'Comprehensive understanding of environmental impact assessment and circular economy principles' },
        { name: 'Green Chemistry Integration', weight: 0.10, description: 'Knowledge of sustainable synthesis routes and renewable feedstock utilization' },
        { name: 'Economic Viability Analysis', weight: 0.08, description: 'Understanding of cost-benefit analysis and market adoption barriers' }
      ],
      'Additive Manufacturing': [
        { name: 'Process-Structure-Property Understanding', weight: 0.12, description: 'Deep knowledge of how AM parameters affect microstructure and final properties' },
        { name: 'Design for AM Principles', weight: 0.10, description: 'Understanding of topology optimization, support strategies, and AM-specific design rules' },
        { name: 'Quality Control and Standards', weight: 0.08, description: 'Knowledge of process monitoring, defect detection, and AM qualification standards' }
      ],
      'Computational Materials': [
        { name: 'Modeling Method Selection', weight: 0.12, description: 'Understanding of appropriate computational methods for different materials problems' },
        { name: 'Validation and Verification', weight: 0.10, description: 'Knowledge of model validation against experiments and uncertainty quantification' },
        { name: 'High-Throughput Integration', weight: 0.08, description: 'Understanding of materials informatics and machine learning applications' }
      ],
      'General Materials Science': [
        { name: 'Cross-Disciplinary Integration', weight: 0.12, description: 'Effective integration of multiple materials science domains and interdisciplinary thinking' },
        { name: 'Systems-Level Thinking', weight: 0.10, description: 'Holistic approach considering multiple scales and application contexts' },
        { name: 'Innovation and Future Trends', weight: 0.08, description: 'Awareness of emerging trends and breakthrough potential' }
      ]
    };

    let criteria = [...baseCriteria];
    
    // Add specialized criteria for primary category
    if (specializedCriteria[categories.primary]) {
      criteria = criteria.concat(specializedCriteria[categories.primary]);
    }
    
    // Dynamic weight adjustment based on query analysis
    if (queryAnalysis.context === 'industry') {
      const practicalCriterion = criteria.find(c => c.name === 'Practical Implementation');
      if (practicalCriterion) practicalCriterion.weight *= 1.4;
    }
    
    if (queryAnalysis.isEmergingField) {
      const innovationCriterion = criteria.find(c => c.name === 'Innovation and Future Trends');
      if (innovationCriterion) innovationCriterion.weight *= 1.3;
    }
    
    if (queryAnalysis.complexity === 'high') {
      const technicalCriterion = criteria.find(c => c.name === 'Technical Depth');
      if (technicalCriterion) technicalCriterion.weight *= 1.2;
    }
    
    // Normalize weights to ensure they sum to 1
    const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
    criteria = criteria.map(c => ({ ...c, weight: c.weight / totalWeight }));

    return criteria;
  }

  createJudgePersona(categories, queryAnalysis) {
    const personas = {
      'Nanomaterials': {
        title: 'Senior Nanomaterials Scientist',
        expertise: ['Nanoscale Synthesis and Characterization', 'Quantum Size Effects and Surface Phenomena', 'Advanced Microscopy (TEM, SEM, AFM, STM)', 'Spectroscopic Analysis (XPS, Raman, FTIR)', 'Nanoparticle Functionalization and Assembly', 'Toxicology and Environmental Impact', 'Scale-up and Manufacturing Challenges', 'Regulatory and Safety Considerations', '2D Materials and Heterostructures', 'Bottom-up and Top-down Fabrication'],
        specializations: ['2D Materials', 'Quantum Dots', 'Nanocomposites', 'Bionanotechnology', 'Plasmonic Materials'],
        keyJournals: ['Nature Nanotechnology', 'ACS Nano', 'Small', 'Nano Letters', 'Advanced Materials'],
        experience: '12+ years in nanomaterials research and development',
        approach: 'Emphasizes safety, scalability, and real-world implementation alongside fundamental science. Strong focus on tetrahedron integration and sustainability considerations.'
      },
      'Polymers': {
        title: 'Polymer Science and Engineering Expert',
        expertise: ['Polymer Chemistry and Synthesis', 'Structure-Property Relationships', 'Processing Methods and Rheology', 'Polymer Characterization', 'Sustainable Polymers and Recycling', 'Polymer Composites and Nanocomposites', 'Biodegradable and Bio-based Polymers', 'Polymer Physics and Thermodynamics', 'Industrial Processing and Scale-up', 'Regulatory and Environmental Considerations'],
        specializations: ['Sustainable Polymers', 'High-Performance Polymers', 'Biomedical Polymers', 'Smart Polymers'],
        keyJournals: ['Macromolecules', 'Polymer', 'Journal of Polymer Science', 'Polymer Chemistry'],
        experience: '15+ years in polymer science and technology',
        approach: 'Practical focus on structure-property relationships and technological applications with strong emphasis on sustainability and circular economy principles.'
      },
      'Metals and Alloys': {
        title: 'Metallurgical Engineering Expert',
        expertise: ['Phase Diagrams and Thermodynamics', 'Microstructure-Property Relationships', 'Mechanical Behavior and Failure Analysis', 'Heat Treatment and Processing', 'Corrosion and Environmental Degradation', 'Advanced Characterization Techniques', 'Alloy Design and Development', 'Manufacturing Processes', 'Quality Control and Testing', 'Sustainability and Recycling'],
        specializations: ['High-Temperature Alloys', 'Lightweight Alloys', 'Additive Manufacturing of Metals', 'Corrosion Engineering'],
        keyJournals: ['Acta Materialia', 'Metallurgical and Materials Transactions', 'Materials Science and Engineering A', 'Corrosion Science'],
        experience: '18+ years in materials engineering and metallurgical research',
        approach: 'Systematic approach emphasizing processing-structure-property relationships with strong industrial perspective and sustainability focus.'
      },
      'Ceramics': {
        title: 'Ceramic Materials Expert',
        expertise: ['Ceramic Processing and Sintering', 'Microstructure Control and Characterization', 'Mechanical Properties and Fracture', 'Thermal and Electrical Properties', 'Advanced Ceramics and Composites', 'Functional Ceramics', 'Glass Science and Technology', 'Refractory Materials', 'Quality Control and Reliability', 'Environmental Applications'],
        specializations: ['Structural Ceramics', 'Electronic Ceramics', 'Bioceramics', 'Ultra-High Temperature Ceramics'],
        keyJournals: ['Journal of the American Ceramic Society', 'Ceramics International', 'Journal of the European Ceramic Society'],
        experience: '14+ years in ceramic materials science and engineering',
        approach: 'Holistic approach focusing on processing-microstructure-property relationships with emphasis on reliability and performance optimization.'
      },
      'Biomaterials': {
        title: 'Biomaterials and Biomedical Engineering Expert',
        expertise: ['Biocompatibility and Biological Response', 'Tissue Engineering and Regenerative Medicine', 'Medical Device Design and Development', 'Biomaterial-Tissue Interactions', 'Regulatory Affairs and Clinical Translation', 'Sterilization and Packaging', 'Bioactive and Biodegradable Materials', 'Drug Delivery Systems', 'Implant Design and Testing', 'Ethics and Patient Safety'],
        specializations: ['Orthopedic Biomaterials', 'Cardiovascular Materials', 'Neural Interfaces', 'Tissue Engineering Scaffolds'],
        keyJournals: ['Biomaterials', 'Acta Biomaterialia', 'Journal of Biomedical Materials Research', 'Tissue Engineering'],
        experience: '16+ years in biomaterials research and medical device development',
        approach: 'Patient-centered approach emphasizing safety, efficacy, and regulatory compliance with strong focus on clinical translation and ethical considerations.'
      },
      'Electronic Materials': {
        title: 'Electronic Materials and Device Physics Expert',
        expertise: ['Semiconductor Physics and Engineering', 'Electronic Device Fabrication', 'Materials for Electronics', 'Optoelectronic Materials', 'Magnetic and Spintronic Materials', 'Superconducting Materials', 'Quantum Materials and Devices', 'Thin Film Technology', 'Interface Engineering', 'Reliability and Failure Analysis'],
        specializations: ['Wide Bandgap Semiconductors', 'Organic Electronics', 'Quantum Computing Materials', 'Flexible Electronics'],
        keyJournals: ['Applied Physics Letters', 'Journal of Applied Physics', 'IEEE Electron Device Letters', 'Advanced Electronic Materials'],
        experience: '13+ years in electronic materials science and technology',
        approach: 'Technology-driven approach emphasizing device integration and performance optimization with focus on emerging applications and manufacturing scalability.'
      },
      'Energy Materials': {
        title: 'Energy Materials and Electrochemistry Expert',
        expertise: ['Battery Materials and Technology', 'Fuel Cell Materials and Systems', 'Catalysis and Electrocatalysis', 'Energy Storage Systems', 'Renewable Energy Materials', 'Electrochemical Characterization', 'Materials for Energy Conversion', 'System Integration and Safety', 'Lifecycle Assessment', 'Grid-Scale Energy Storage'],
        specializations: ['Next-Generation Batteries', 'Hydrogen Technologies', 'Solar Cell Materials', 'Thermoelectric Materials'],
        keyJournals: ['Nature Energy', 'Energy & Environmental Science', 'Journal of Power Sources', 'Advanced Energy Materials'],
        experience: '15+ years in energy materials research and development',
        approach: 'Systems-level approach emphasizing performance, safety, and sustainability with strong focus on commercial viability and environmental impact.'
      },
      'Sustainable Materials': {
        title: 'Sustainable Materials and Green Chemistry Expert',
        expertise: ['Life Cycle Assessment', 'Circular Economy Principles', 'Bio-based Materials', 'Green Chemistry and Processing', 'Recycling and Upcycling Technologies', 'Environmental Impact Assessment', 'Sustainable Manufacturing', 'Policy and Regulations', 'Economic Analysis', 'Social Impact Assessment'],
        specializations: ['Bio-based Polymers', 'Recycling Technologies', 'Carbon Footprint Analysis', 'Sustainable Composites'],
        keyJournals: ['Green Chemistry', 'Journal of Cleaner Production', 'Resources Conservation and Recycling', 'Sustainable Materials and Technologies'],
        experience: '12+ years in sustainable materials and environmental engineering',
        approach: 'Holistic sustainability approach integrating environmental, economic, and social considerations with focus on circular economy and climate impact.'
      },
      'Additive Manufacturing': {
        title: 'Additive Manufacturing and Digital Materials Expert',
        expertise: ['AM Process Physics and Modeling', 'Materials for Additive Manufacturing', 'Process Parameter Optimization', 'Quality Control and Characterization', 'Design for Additive Manufacturing', 'Post-Processing and Finishing', 'Multi-material and Functional Printing', 'Standards and Certification', 'Industrial Implementation', 'Cost Analysis and Economics'],
        specializations: ['Metal AM', 'Polymer AM', 'Ceramic AM', 'Multi-material Systems'],
        keyJournals: ['Additive Manufacturing', 'Materials & Design', 'Rapid Prototyping Journal', 'Progress in Materials Science'],
        experience: '10+ years in additive manufacturing research and industrial implementation',
        approach: 'Process-centric approach emphasizing design-manufacturing integration with focus on quality, repeatability, and industrial scalability.'
      },
      'Computational Materials': {
        title: 'Computational Materials Science and Informatics Expert',
        expertise: ['Density Functional Theory', 'Molecular Dynamics Simulation', 'Machine Learning for Materials', 'High-Throughput Screening', 'Materials Databases and Informatics', 'Multiscale Modeling', 'Uncertainty Quantification', 'Model Validation and Verification', 'Materials Genome Initiative', 'AI-Driven Discovery'],
        specializations: ['Materials Informatics', 'Quantum Materials Modeling', 'Predictive Materials Design', 'Autonomous Experimentation'],
        keyJournals: ['npj Computational Materials', 'Computational Materials Science', 'Materials Discovery', 'Digital Discovery'],
        experience: '11+ years in computational materials science and data science',
        approach: 'Data-driven approach integrating theory, computation, and experiment with emphasis on predictive modeling and accelerated discovery.'
      },
      'General Materials Science': {
        title: 'Materials Science and Engineering Expert',
        expertise: ['Fundamental Materials Science Principles', 'Structure-Property-Processing-Performance Relationships', 'Materials Characterization and Analysis', 'Materials Selection and Design', 'Interdisciplinary Integration', 'Innovation and Technology Transfer', 'Sustainability and Lifecycle Thinking', 'Quality Assurance and Standards', 'Project Management and Leadership', 'Technical Communication'],
        specializations: ['Materials Selection', 'Failure Analysis', 'Technology Integration', 'Innovation Management'],
        keyJournals: ['Materials Today', 'Progress in Materials Science', 'Annual Review of Materials Research', 'MRS Bulletin'],
        experience: '20+ years in materials science and engineering across multiple domains',
        approach: 'Comprehensive systems approach emphasizing interdisciplinary integration, practical applications, and holistic tetrahedron framework understanding with strong focus on innovation and sustainability.'
      }
    };

    let selectedPersona = personas[categories.primary] || personas['General Materials Science'];
    
    // Enhance persona based on query analysis
    if (queryAnalysis.context === 'industry') {
      selectedPersona = {
        ...selectedPersona,
        approach: selectedPersona.approach + ' Enhanced focus on commercial viability, manufacturing scalability, and market implementation.'
      };
    }
    
    if (queryAnalysis.isInterdisciplinary && categories.all.length > 1) {
      const secondaryExpertise = categories.all.slice(1, 3).map(cat => personas[cat.name]?.specializations?.[0]).filter(Boolean);
      selectedPersona = {
        ...selectedPersona,
        crossDisciplinaryExpertise: secondaryExpertise,
        approach: selectedPersona.approach + ' Strong interdisciplinary perspective with cross-domain integration capabilities.'
      };
    }
    
    return selectedPersona;
  }

  async simulateDelay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
