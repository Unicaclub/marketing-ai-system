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

# Database operations
cd mcp-ai-backend && python migrate.py init    # Initialize database
cd mcp-ai-backend && python migrate.py reset   # Reset database
cd mcp-ai-backend && python migrate.py seed    # Seed with initial data
cd mcp-ai-backend && python migrate.py check   # Check connection

# Test functionality
cd . && python test_functionality.py

# Start queue processor (for automation delays and scheduling)
cd mcp-ai-backend && python start_queue_processor.py

# Run with production server (waitress)
cd mcp-ai-backend && python -m waitress --host=0.0.0.0 --port=5000 src.main:app

# Run with gunicorn (production)
cd mcp-ai-backend && gunicorn src.main:app
```

## Architecture

### Frontend Structure
- **Components**: Organized by feature (auth/, admin/, platforms/, ui/)
- **Context**: `AuthContext` for authentication state management
- **Routing**: React Router with protected routes using Layout component
- **Styling**: TailwindCSS with shadcn/ui component library
- **API Communication**: Fetch API with `VITE_API_URL` environment variable

### Backend Structure
- **Models**: SQLAlchemy models in `src/models/` (Campaign, MCPAgent, User, ProductDatabase, SalesInteraction, ZAPICredentials, UserAPIKey, Automation, Contact, Message, MessageTemplate, AutomationMetrics, QueuedMessage)
- **Routes**: Blueprint-based routing in `src/routes/` organized by feature (campaign, mcp_agent, sales_agent, platform integrations, automation)
- **Services**: Business logic layer in `src/services/` for complex operations (MCP agent service, sales strategy service, automation engine, queue processor)
- **Database**: Flexible configuration in `config.py` supporting PostgreSQL (production), MySQL, and SQLite (development)
- **Static Files**: Served from `src/static/` for production SPA deployment
- **Queue System**: Background processing for delayed messages and scheduled automations

### Key Models
- **MCPAgent**: AI agents with personality, sales approach, and performance metrics
- **Campaign**: Marketing campaigns with platform targeting, budgets, and content
- **SalesInteraction**: Customer interaction tracking with sentiment analysis and conversion probability
- **ConversationFlow**: Predefined conversation paths for sales agents
- **AgentKnowledge**: Knowledge base for AI agents (products, objections, scripts, FAQs)
- **Automation**: Marketing automation workflows with triggers and actions
- **Contact**: Customer contact management with tags, custom fields, and segmentation
- **Message**: Message history and tracking across all platforms
- **MessageTemplate**: Reusable message templates with dynamic variables
- **QueuedMessage**: Scheduled messages for delayed sending

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

## Automation System Features

### Implemented Features
- **Marketing Automation Workflows**: Complete automation builder with visual interface
- **Multi-trigger Support**: Keyword, schedule, and webhook-based triggers
- **Advanced Actions**: Send messages, add/remove tags, update custom fields, delays
- **Template System**: Reusable message templates with dynamic variables ({{name}}, {{phone}}, etc.)
- **Contact Segmentation**: Advanced filtering by tags, behavior, interaction history
- **Analytics Dashboard**: Performance metrics, conversion tracking, engagement analysis
- **Queue System**: Background processing for delayed messages and scheduled campaigns
- **Multi-platform Support**: WhatsApp, Telegram, Instagram integration ready

### Queue Processor
- Background service for processing scheduled messages and automations
- Runs separately from main Flask app: `python start_queue_processor.py`
- Handles delays, scheduling, and batch message processing
- Automatic cleanup of old data and metrics calculation

### API Endpoints
- `/api/automations` - CRUD operations for automation workflows
- `/api/contacts` - Contact management and segmentation
- `/api/templates` - Message template management
- `/api/messages` - Message history and sending
- `/api/webhook/<platform>` - Multi-platform webhook receivers
- `/api/contacts/segments` - Advanced contact segmentation
- `/api/automations/<id>/analytics` - Performance analytics

## Development Notes

- Frontend uses package manager: `pnpm@10.4.1`
- Backend serves static files from `src/static/` for production deployment
- CORS enabled for all origins in development (`origins="*"`)
- Database migrations handled via custom `migrate.py` script and Alembic (both available)
- Production deployment configured for Railway with Procfile (`web: gunicorn src.main:app`)
- Backend uses Waitress WSGI server for development, Gunicorn for production
- Frontend build outputs to `dist/` directory
- Path aliasing configured with `@` pointing to `src/` directory
- Queue processor should run as separate process in production for automation features