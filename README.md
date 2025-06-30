# Disorderless.ai - Materials Science & Engineering Research Platform

> **First the findings. Then the verdict.**

An advanced AI-powered research platform that conducts deep materials science research and provides built-in trustworthiness assessment of findings.

## 🚀 Features

- **Deep Research Analysis**: AI-powered comprehensive research using Perplexity AI
- **Multi-Agent System**: Coordinated AI agents for research, persona crafting, and trustworthiness evaluation
- **Interactive Citations**: Clickable citations that link directly to source materials
- **Trust Assessment**: Built-in evaluation of research reliability and trustworthiness
- **Beautiful UI**: Modern glassmorphism design with premium animations
- **Real-time Monitoring**: Live agent activity tracking and progress visualization
- **Source Analysis**: Detailed credibility scoring and source categorization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** (comes with Node.js)
- **Perplexity AI API Key** (required for research functionality)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <https://github.com/stanley1208/bolt-hackathon/>
cd bolt-hackathon
```

### 2. Navigate to Project Directory

```bash
cd project
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure API Key

Open `config.js`, add your Perplexity AI API key, and select your deep research model:
   ```javascript
   // Perplexity Deep Research API Configuration (Required for Researcher Agent)
      perplexity: {
         apiKey: process.env.PERPLEXITY_API_KEY || 'your_perplexity_api_key',
         baseUrl: 'https://api.perplexity.ai',
         // Model Options (uncomment one):
         deepResearchModel: 'llama-3.1-sonar-large-128k-online', // Current: Best balance
         // deepResearchModel: 'llama-3.1-sonar-small-128k-online', // Budget: Faster & cheaper
         // deepResearchModel: 'sonar-pro', // Premium: Highest quality (if available)
         timeout: 300000, // 5 minutes for deep research
      },
   ... 
   }; 
   ```

### 5. Get Perplexity AI API Key

1. Visit [Perplexity AI](https://www.perplexity.ai/)
2. Sign up for an account
3. Navigate to API settings
4. Generate a new API key
5. Copy the key to your `config.js` file

## 🚦 Running the Project

### Development Mode

1. **Start the Backend Server:**
   ```bash
   npm run server
   ```
   The server will start on `http://localhost:3001`

2. **Start the Frontend (in a new terminal):**
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

### Production Mode

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm run server
   npm run preview
   ```

## 📁 Project Structure

```
project/
├── src/                    # Frontend React application
│   ├── components/         # React components
│   │   ├── AgentCard.tsx          # Individual agent display
│   │   ├── AgentDashboard.tsx     # Agent monitoring dashboard
│   │   ├── Header.tsx             # Application header
│   │   ├── QueryForm.tsx          # Research query input
│   │   ├── ResearchPlatform.tsx   # Main platform component
│   │   └── ResultsDisplay.tsx     # Research results viewer
│   ├── App.tsx            # Main application component
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles and animations
├── server/                 # Backend Node.js server
│   ├── agents/            # AI agent implementations
│   │   ├── judge.js              # Trustworthiness evaluation agent
│   │   ├── orchestrator.js       # Agent coordination system
│   │   ├── persona-crafter.js    # Research persona generation
│   │   └── researcher.js         # Research execution agent
│   ├── database/          # Data management
│   │   └── manager.js            # In-memory data storage
│   └── index.js           # Server entry point
├── config.js              # Configuration file
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🎯 How to Use

1. **Start a Research Query:**
   - Enter your materials science research question
   - Click "Begin Research"

2. **Monitor Agent Activity:**
   - Watch real-time progress in the Agent Dashboard
   - Track individual agent activities and progress

3. **Review Results:**
   - **Research Analysis**: View the comprehensive research report
   - **Source Analysis**: Examine source credibility and citations
   - **Research Trail**: See every website visited during research

4. **Interactive Features:**
   - Click citation numbers in the research text to jump to sources
   - View trust assessment and research confidence scores
   - Access detailed source information and credibility ratings

## ⚙️ Configuration Options

### API Configuration
- `perplexity.apiKey`: Your Perplexity AI API key
- `perplexity.deepResearchModel`: AI model for research (default: llama-3.1-sonar-large-128k-online)
- `perplexity.timeout`: Request timeout in milliseconds

### Server Configuration
- `server.port`: Backend server port (default: 3001)

## 🎨 Customization

### Styling
- Modify `src/index.css` for global styles
- Update `tailwind.config.js` for design system changes
- Component-specific styles are in individual `.tsx` files

### Agent Behavior
- Modify prompts in `server/agents/researcher.js`
- Adjust scoring algorithms in `server/agents/judge.js`
- Update agent coordination in `server/agents/orchestrator.js`

## 🐛 Troubleshooting

### Common Issues

**1. API Key Not Working**
- Ensure your Perplexity AI API key is valid and has sufficient credits
- Check that `config.js` exists and contains the correct API key

**2. Server Won't Start**
- Verify Node.js version (18.0+)
- Check if port 3001 is available
- Run `npm install` to ensure all dependencies are installed

**3. Frontend Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

**4. Research Not Working**
- Verify internet connection
- Check browser console for error messages
- Ensure backend server is running on port 3001

### Debug Mode
To enable debug logging, check the browser console and server logs for detailed information about API calls and agent activities.

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Review server logs for API-related errors
3. Verify your Perplexity AI API key and credits
4. Ensure all dependencies are properly installed

## 🧪 Technical Details

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Node.js + Express
- **AI Integration**: Perplexity AI API
- **Styling**: Tailwind CSS with custom animations
- **Architecture**: Multi-agent system with orchestrated coordination

---

**Happy Researching!** 🔬✨ 