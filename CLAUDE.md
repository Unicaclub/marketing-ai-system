# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Marketing AI System with a full-stack architecture consisting of:
- **Frontend**: React application (`marketing-ai-system/`) using Vite, TailwindCSS, and shadcn/ui components
- **Backend**: Flask API (`mcp-ai-backend/`) with SQLAlchemy ORM, supporting multiple databases (PostgreSQL, MySQL, SQLite)

The system provides AI-powered marketing campaign management, multi-platform integration (WhatsApp, Instagram, Facebook), and intelligent sales agents with conversation flows.

## Development Commands

### Frontend (marketing-ai-system/)
```bash
# Development server
cd marketing-ai-system && npm run dev

# Production build
cd marketing-ai-system && npm run build

# Lint code
cd marketing-ai-system && npm run lint

# Preview build
cd marketing-ai-system && npm run preview
```

### Backend (mcp-ai-backend/)
```bash
# Install dependencies
cd mcp-ai-backend && pip install -r requirements.txt

# Run development server
cd mcp-ai-backend && python src/main.py

# Database migrations
cd mcp-ai-backend && python migrate.py

# Run with production server
cd mcp-ai-backend && python -m waitress --host=0.0.0.0 --port=5000 src.main:app
```

## Architecture

### Frontend Structure
- **Components**: Organized by feature (auth/, admin/, platforms/, ui/)
- **Context**: `AuthContext` for authentication state management
- **Routing**: React Router with protected routes using Layout component
- **Styling**: TailwindCSS with shadcn/ui component library
- **API Communication**: Fetch API with `VITE_API_URL` environment variable

### Backend Structure
- **Models**: SQLAlchemy models for core entities (Campaign, MCPAgent, User, ProductDatabase, SalesInteraction)
- **Routes**: Blueprint-based routing organized by feature
- **Services**: Business logic layer for complex operations
- **Database**: Flexible database configuration supporting PostgreSQL (production), MySQL, and SQLite (development)

### Key Models
- **MCPAgent**: AI agents with personality, sales approach, and performance metrics
- **Campaign**: Marketing campaigns with platform targeting, budgets, and content
- **SalesInteraction**: Customer interaction tracking with sentiment analysis and conversion probability
- **ConversationFlow**: Predefined conversation paths for sales agents
- **AgentKnowledge**: Knowledge base for AI agents (products, objections, scripts, FAQs)

## Database Configuration

The backend uses a flexible configuration system in `config.py`:
- **Production**: PostgreSQL (via `DATABASE_URL` environment variable)
- **Development**: PostgreSQL with local credentials
- **Testing**: SQLite in-memory database

Environment variables for database connection:
- `DATABASE_URL` (Railway/production)
- `POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`
- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DB`, `MYSQL_USER`, `MYSQL_PASSWORD`

## API Integration

### External APIs
- **OpenAI**: For AI agent responses and content generation
- **Z-API**: WhatsApp integration with webhook support
- **Facebook/Instagram APIs**: Social media platform management

### Authentication
- JWT-based authentication using `flask_jwt_extended`
- User registration and login through `/api/users` and `/api/login`
- User API key management for external service integration

## Platform Integrations

### WhatsApp (Z-API)
- Webhook endpoint: `/zapi/webhook`
- Settings management: `/api/user/whatsapp/settings`
- Message handling with AI agent responses

### Social Media Platforms
- Facebook Manager: Campaign creation and management
- Instagram Manager: Content and engagement tracking
- Platform-specific configuration storage

## Development Notes

- Frontend uses package manager: `pnpm@10.4.1`
- Backend serves static files from `src/static/` for production deployment
- CORS enabled for all origins in development
- Database migrations handled via Alembic
- Production deployment configured for Railway with Procfile and requirements.txt