# 🚀 MARP 2.0 - Real AI-Powered Multi-Agent Research Platform

## ✨ What's Changed

Your platform now uses **real AI agents** instead of mock simulations!

### 🔬 **New Research Agent**
- **Powered by Perplexity Deep Research API**
- Performs actual web research and analysis
- Multi-phase research with follow-up investigations
- Real source verification and credibility assessment
- Comprehensive reporting with citations

### 📊 **Enhanced Features**
- Real-time deep research analysis
- Actual source citations and links
- Executive summaries from AI analysis
- Source credibility scoring
- Multi-tab results with research details

---

## 🛠️ Setup Instructions

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

## 🎯 **How It Works Now**

### **Research Agent (A1)**
1. **Deep Research**: Uses Perplexity to perform comprehensive web research
2. **Follow-up Analysis**: Conducts additional research on key findings
3. **Source Verification**: Assesses credibility of all sources
4. **Synthesis**: Creates detailed analysis with citations

### **Persona-Crafter (A2)**
- Still creates evaluation frameworks (as before)
- Determines appropriate judge personas

### **Judge Agent (A3)**
- Evaluates the **real research** using AI criteria
- Provides detailed scoring and rationale

---

## 🔍 **Test It Out**

Try these research queries:

```
What are the latest developments in quantum computing?
```

```
How effective are renewable energy solutions in reducing carbon emissions?
```

```
What are the potential risks and benefits of AI in healthcare?
```

You'll see:
- ✅ **Real research** from actual web sources
- ✅ **Proper citations** with links
- ✅ **Source credibility** assessment
- ✅ **Executive summaries** from AI analysis
- ✅ **Multi-phase research** with follow-up

---

## 📈 **API Usage & Costs**

### **Perplexity API**
- **Model**: `llama-3.1-sonar-huge-128k-online`
- **Cost**: ~$0.02-0.05 per research query
- **Features**: Web search + AI analysis + citations

### **Optional: OpenAI (for Judge)**
- **Model**: `gpt-4o-mini`
- **Cost**: ~$0.001-0.003 per evaluation
- **Purpose**: Enhanced evaluation capabilities

---

## 🚨 **Important Notes**

1. **API Keys Required**: The platform won't work without valid API keys
2. **Rate Limits**: Perplexity has rate limits - don't spam queries
3. **Cost Awareness**: Each research query costs money (small amounts)
4. **Internet Required**: Research requires internet connectivity

---

## 🎉 **You Now Have Real AI Agents!**

Your platform has been transformed from a simulation into a **real AI-powered research system**. The agents now:

- ✅ **Actually research** topics using web search
- ✅ **Analyze real sources** and provide citations  
- ✅ **Generate comprehensive reports** with AI
- ✅ **Assess source credibility** automatically
- ✅ **Provide actionable insights** based on real data

**Test it out and see the difference!** 🚀 