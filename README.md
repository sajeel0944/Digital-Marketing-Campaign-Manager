# 📊 Digital Marketing Campaign Manager - Real-time Dashboard

A professional marketing campaign management platform that gives managers a complete overview at a glance. From budget tracking to AI-powered strategy generation - everything in one place!

## 🎯 Key Features

### 1. **📈 Real-time Dashboard**
Managers get instant insights:
- **Total Budget**: Total allocation for campaigns
- **Total Spend**: Total amount spent so far
- **Total Clicks**: Number of clicks and conversions received
- **Campaign Performance**: Real-time performance metrics for each campaign
- **Budget vs Spend Charts**: Visual representation of spending patterns

**Live Updates**: Data refreshes every 5 seconds through WebSocket connections

---

### 2. **🤖 AI Brief Builder**
Create professional marketing briefs without any technical knowledge:

**Provide:**
- 📝 Client name
- 🎯 Campaign objective
- 💰 Budget amount
- 🌍 Target audience

**AI Generates:**
- ✍️ **Compelling Headlines** - Optimized for social media
- 📋 **Marketing Strategy** - SEO, SEM, Social Media approach
- 💳 **Budget Allocation** - Optimal channel distribution
- 🎨 **Visual Direction** - Design guidelines and specifications
- 🏷️ **Campaign Tags** - Auto-categorization
- 📢 **Tone & Style Guide** - Brand voice consistency

**Technology**: OpenAI Agent + Playwright Web Search

---

### 3. **🔔 Real-time Notification System (WebSockets)**
Managers receive immediate alerts:

**Automatic Triggers:**
- 🚨 **Budget Alert** - When budget reaches 90% consumption
- 📊 **Performance Alerts** - For low-engagement campaigns
- ✅ **Campaign Status** - Campaign start, pause, and completion notifications

**Real-time**: Instant notifications via WebSocket connections
**Persistent**: All notifications stored in dashboard history

---

## 🏗️ Project Architecture

```
├── server/                    # FastAPI Backend
│   ├── main.py               # App entry point + WebSocket setup
│   ├── models.py             # Database models (User, Company, Campaign, Notification)
│   ├── routes/
│   │   ├── authRou.py        # Login/Signup
│   │   ├── compRou.py        # Company management
│   │   ├── campaignRou.py    # Campaign CRUD
│   │   ├── agentRou.py       # AI Brief Generation
│   │   └── notificationRou.py # WebSocket & Budget alerts
│   ├── Agent/
│   │   ├── assistant.py      # OpenAI Agent (AI Brief Builder)
│   │   ├── guardrails.py     # Safety guidelines
│   │   └── tool/
│   │       ├── web_search.py  # Market research
│   │       └── analyze_website_full.py # Competitor analysis
│   ├── auth/                 # JWT & Password hashing
│   ├── security/             # Rate limiting & dependencies
│   └── test/                 # Unit tests
│
├── client/                    # React + TypeScript Frontend
│   ├── src/
│   │   ├── App.tsx           # Main routes
│   │   ├── page/
│   │   │   ├── LoginPage     # Authentication
│   │   │   ├── DashboardPage # Real-time dashboard
│   │   │   ├── CompanyPage   # Company management
│   │   │   ├── CampaignsPage # Campaign list
│   │   │   └── CompanyCampaignDetail # Campaign details
│   │   ├── components/
│   │   │   ├── dashboard/    # Dashboard widgets
│   │   │   ├── campaigns/    # Campaign forms & tables
│   │   │   ├── companies/    # Company management
│   │   │   └── notifications/  # Real-time alerts
│   │   ├── hooks/            # Custom React hooks
│   │   ├── api/              # API client calls
│   │   ├── types/            # TypeScript interfaces
│   │   └── contexts/         # Theme context
│   └── public/               # Static files
│
└── docker-compose.yaml       # Container orchestration
```

---

## 🚀 Getting Started

### Prerequisites
- **Docker** & **Docker Compose** (recommended)
- Or alternatively:
  - **Node.js 22+** (Client)
  - **Python 3.13+** (Server)
  - **Neon DB** (PostgreSQL Database)

### Option 1: Docker (Recommended) 🐳

```bash
# Clone repository
git clone <repo-url>
cd FULL-STACK-DEVELOPER-Task

# Start all services
docker-compose up --build

# Services will be available at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000
# - Database: Neon DB (PostgreSQL)
```

### Option 2: Local Development

#### Backend Setup (Windows PowerShell):
```powershell
cd server

# Create virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -e .

# Create .env file
# DATABASE_URL=postgresql://user:password@localhost/marketing_db
# Or use Neon DB: postgresql://user:password@xxx.neon.tech/marketing_db
# OPENAI_API_KEY=sk-...
# JWT_SECRET=your-secret-key

# Start server
uvicorn main:app --reload --port 8000
```

#### Frontend Setup:
```bash
cd client

# Install dependencies
npm ci

# Create .env file
# VITE_API_URL=http://localhost:8000

# Start development server
npm run dev
# Open: http://localhost:5173
```

---

## 📚 API Endpoints

### 🔐 Authentication
```
POST   /api/signup           # Create new account
POST   /api/login            # User login
```

### 🏢 Companies
```
GET    /api/companies        # List all companies
POST   /api/companies        # Create new company
GET    /api/companies/:id    # Get company details
PUT    /api/companies/:id    # Update company
DELETE /api/companies/:id    # Delete company
```

### 📢 Campaigns
```
GET    /api/campaigns                      # Get all campaigns
POST   /api/campaigns/:company_id          # Create campaign for company
GET    /api/companies/:company_id/campaigns # Get company's campaigns
PUT    /api/campaigns/:id                  # Update campaign
DELETE /api/campaigns/:id                  # Delete campaign
```

### 🤖 AI Brief Builder
```
POST   /api/ai/create-brief                # Generate AI brief
GET    /api/ai/health                      # API health check
```

### 🔔 WebSocket (Real-time)
```
WS     /ws                   # WebSocket connection
       - Budget alerts
       - Live dashboard updates
       - Notification streaming
```

---

## 💾 Database Schema

### Users
```
id (PK)
email (unique)
password (hashed)
created_at
```

### Companies
```
id (PK)
client_name
status (active/paused)
budget
spend (total)
deleted_at (soft delete)
```

### Campaigns
```
id (PK)
company_id (FK)
campaign_title
budget
headlines (JSON)
channel_allocation (JSON)
tone_guide
visual_direction
tags (JSON)
deleted_at (soft delete)
```

### Notifications
```
id (PK)
company_id (FK)
message
read (boolean)
created_at
```

---

## 🔐 Security Features

### ✅ Authentication
- JWT-based authentication
- Bcrypt password hashing
- Protected routes

### ✅ Rate Limiting  
- 100 requests/minute per IP
- SlowAPI rate limiter

### ✅ Data Protection
- Soft deletes (never permanently delete)
- CORS enabled for frontend
- Environment variables for secrets

---

## 🛠️ Environment Variables

### Server (.env)
```env
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:password@your-project.neon.tech/marketing_db

# JWT
JWT_SECRET=your-secret-key-here
JWT_ALGORITHM=HS256

# OpenAI (for AI Brief Builder)
OPENAI_API_KEY=sk-your-api-key

# Development
DEBUG=false
LOG_LEVEL=INFO
```

### Client (.env)
```env
VITE_API_URL=http://api:8000
```

---

## 🧪 Testing

```bash
cd server

# Run all tests
pytest

# Run specific test
pytest test/test_campaign_service.py -v

# Generate coverage report
pytest --cov=routes --cov=Agent test/
```

---

## 📈 Features in Detail

### Dashboard Widgets
- **Stats Cards**: Budget, Spend, ROI, Click metrics
- **Charts**: 
  - Budget vs Spend (Line chart)
  - Campaign Performance (Bar chart)
  - Channel Allocation (Pie chart)
  - Company Performance (Table)

### Campaign Management
- Create campaigns from AI-generated briefs
- Edit campaign details
- Pause/Resume campaigns
- Track per-campaign metrics
- Bulk operations

### Notifications
- Real-time WebSocket updates
- Banner alerts for budget threshold
- Notification bell with unread count
- Notification history

---

## 🎨 Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router v7** - Navigation
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Recharts** - Data visualization
- **Framer Motion** - Animations

### Backend
- **FastAPI** - Web framework
- **SQLModel** - ORM
- **Neon DB (PostgreSQL)** - Database
- **OpenAI Agents** - AI capabilities
- **WebSockets** - Real-time updates
- **Pytest** - Testing
- **Uvicorn** - ASGI server

---

## 🚨 Troubleshooting

### Docker Issues
```bash
# Rebuild images
docker-compose down
docker-compose up --build --force-recreate

# View logs
docker-compose logs -f api
docker-compose logs -f client

# Or specific service
docker-compose logs -f api --tail=100
```

### Database Issues
```bash
# Connect to Neon DB (PostgreSQL):
# Use Neon Dashboard or psql:
# psql postgresql://user:password@your-project.neon.tech/marketing_db
```

### WebSocket Not Working
- Check browser console for errors
- Verify backend is running
- Check CORS settings in FastAPI

---

## 📝 Contributing

1. Create feature branch: `git checkout -b feature/xyz`
2. Commit changes: `git commit -m 'Add xyz'`
3. Push to branch: `git push origin feature/xyz`
4. Submit a Pull Request

---

## 📞 Support

- 📧 Email: support@marketing-dashboard.com
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions

---

## 📄 License

MIT License - freely use for commercial & personal projects

---

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [React Documentation](https://react.dev)
- [SQLModel](https://sqlmodel.tiangolo.com)
- [WebSocket Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

---

**Made with ❤️ for Digital Marketing Teams**
