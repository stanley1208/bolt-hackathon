export const config = {
  // Perplexity Deep Research API Configuration (Required for Researcher Agent)
  perplexity: {
    apiKey: process.env.PERPLEXITY_API_KEY || 'your_perplexity_api_key_here',
    baseUrl: 'https://api.perplexity.ai',
    // Model Options (uncomment one):
    deepResearchModel: 'llama-3.1-sonar-large-128k-online', // Current: Best balance
    // deepResearchModel: 'llama-3.1-sonar-small-128k-online', // Budget: Faster & cheaper
    // deepResearchModel: 'sonar-pro', // Premium: Highest quality (if available)
    timeout: 300000, // 5 minutes for deep research
  },
  
  // Server Configuration
  server: {
    port: process.env.PORT || 3001,
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  },
  
  // Database Configuration
  database: {
    path: process.env.DATABASE_PATH || './data/marp.db',
  },
  
  // Agent Configuration
  agents: {
    maxConcurrentSessions: 5,
    researchTimeout: 300000, // 5 minutes
    maxSourcesPerQuery: 15,
    deepResearch: true, // Enable deep research mode
  }
}; 