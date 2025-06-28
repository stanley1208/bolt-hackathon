# Real AI-Powered Multi-Agent Materials Science Research Platform

### **Materials Science Research Agent**
- **Powered by Perplexity Deep Research API**
- Performs actual web research and analysis on materials, properties, and applications
- Multi-phase research with follow-up investigations
- Real source verification and credibility assessment
- Comprehensive materials science reporting with citations

### **Enhanced Features**
- Real-time deep materials science research analysis
- Actual source citations and links
- Executive summaries from AI analysis
- Source credibility scoring
- Multi-tab results with research details

---

## Setup Instructions

### 1. **Get Your Perplexity API Key**

1. Go to [Perplexity AI API](https://docs.perplexity.ai/)
2. Sign up for an account
3. Generate an API key
4. Copy your API key

### 2. **Configure Environment Variables**

Create a `.env` file in the project root:

```bash
# In /project/.env
PERPLEXITY_API_KEY=your_actual_perplexity_api_key_here
OPENAI_API_KEY=your_openai_key_for_judge_agent_here
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. **Install & Run**

```bash
cd project
npm install
npm run dev
```

The platform will start:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5173

---

## How It Works Now

### **Materials Science Research Agent (A1)**
1. **Deep Research**: Uses Perplexity to perform comprehensive materials science research
2. **Follow-up Analysis**: Conducts additional research on key findings and recent developments
3. **Source Verification**: Assesses credibility of all scientific sources
4. **Synthesis**: Creates detailed materials science analysis with citations

### **Persona-Crafter (A2)**
- Creates evaluation frameworks for materials science domains
- Determines appropriate materials science expert personas for A3

### **Judge Agent (A3)**
- Evaluates the research conducted by A1 using materials science criteria determined by A2
- Provides detailed scoring and rationale from expert perspective

---

## Test It Out

Try these materials science research queries:

```
What are the properties and applications of graphene?
```

```
How do carbon nanotubes compare to other nanomaterials?
```

```
What are the latest developments in biodegradable polymers?
```

```
Research the mechanical properties of titanium alloys
```

```
What are the applications of quantum dots in electronics?
```

You'll see:

- **Proper citations** with links to scientific literature
- **Source credibility** assessment for web sources
- **Executive summaries** from AI analysis
- **Multi-phase research** with follow-up

---

## API Usage & Costs

### **Perplexity API**
- **Model**: `llama-3.1-sonar-huge-128k-online`
- **Cost**: ~$0.02-0.05 per research query
- **Features**: Web search + AI analysis + citations

### **Optional: OpenAI (for Judge)**
- **Model**: `gpt-4o-mini`
- **Cost**: ~$0.001-0.003 per evaluation
- **Purpose**: Enhanced evaluation capabilities

---

## Important Notes

1. **API Keys Required**: The platform won't work without valid API keys
2. **Rate Limits**: Perplexity has rate limits - don't spam queries
3. **Cost Awareness**: Each research query costs money (small amounts)
4. **Internet Required**: Research requires internet connectivity

---

**Test it out and see the difference!** 