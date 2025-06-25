# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

API Hub is a Next.js 15 application that creates an elegant OpenAPI discovery portal. It allows organizations to catalog and discover their APIs through a clean, searchable interface with AI-powered summaries.

## Development Commands

- `npm run dev` - Start development server with Turbopack on port 3000
- `npm run build` - Build for production
- `npm run start` - Start production server  
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start Genkit AI development server
- `npm run genkit:watch` - Start Genkit AI development server with watch mode

## Architecture

The application follows a clean architecture pattern with clear separation of concerns:

### Domain Layer (`src/domain/`)
The core business logic resides here:
- `api/entity.ts` - API entity definitions, DTOs, and APIDocumentation interface
- `api/repository.ts` - APIDataRepository interface for API data operations
- `api/service.ts` - Business logic for API operations including AI summarization and documentation handling
- `documentation/repository.ts` - DocumentationRepository interface for fetching documentation content
- `documentation/service.ts` - Business logic for documentation operations and ID generation

### Adapters Layer (`src/adapters/`)
Infrastructure implementations:
- `file_repositories/api/repository.ts` - File-based API data repository implementation that reads from `data/apis.json`
- `github_repositories/documentation/repository.ts` - GitHub-based documentation repository using Octokit API client

### Application Layer (`src/app/`)
Next.js App Router structure with API routes and pages:
- APIs are configured in `data/apis.json` (mapped from examples during Docker build)
- Health check endpoint at `/health`
- Revalidation endpoint at `/api/revalidate`

### Shared Services (`src/lib/`)
- `api-repository.ts` - Singleton instances of repository and service
- `utils.ts` - Shared utilities

### AI Integration (`src/ai/`)
Google AI (Gemini) integration for API summarization:
- Requires `GEMINI_API_KEY` environment variable
- `flows/summarize-api.ts` - AI flow for generating API summaries from OpenAPI specs

## Key Dependencies

- **Next.js 15** with App Router and Turbopack
- **Radix UI** for component primitives
- **Tailwind CSS** with shadcn/ui components
- **Google AI (Genkit)** for AI-powered API summarization
- **Element React** for interactive API documentation
- **React Query** for data fetching and caching
- **Octokit** for GitHub API integration
- **React Markdown** with rehype-highlight and remark-gfm for documentation rendering

## Configuration

API specifications are configured in `data/apis.json` with the following structure:
```json
{
  "api-id": {
    "id": "api-id",
    "name": "API Name",
    "team": "Team Name", 
    "description": "Description",
    "documentatopenAPIUrlionUrl": "https://api.example.com/openapi.yaml",
    "docs": [
      {
        "url": "https://github.com/owner/repo/blob/main/README.md",
        "name": "Getting Started Guide",
        "description": "Complete setup and usage guide",
        "provider": "github"
      }
    ]
  }
}
```

The `openAPIUrl` can be:
- External URL (http/https)
- Local file path starting with "/" (relative to public/ directory)

The `docs` array contains additional documentation links:
- `url`: GitHub URL (blob or raw format)
- `name`: Display name for the documentation
- `description`: Brief description of the documentation content
- `provider`: Currently only "github" is supported

### Environment Variables

- `GEMINI_API_KEY`: Required for AI-powered API summarization
- `GITHUB_TOKEN`: Required for fetching documentation from GitHub repositories

## Docker & Deployment

- `Dockerfile` for containerization
- `docker-compose.yaml` for local development
- Makefile includes bump and release commands for versioning and Docker publishing
- Default port mapping: 3000:3000
- Volume mount: `./specs:/app/data` for configuration

## Documentation Features

- Documentation is rendered at `/apis/{api_id}/docs/{doc_id}` where `doc_id` is generated from the documentation name
- GitHub documentation repository adapter supports both `github.com/blob/` and `raw.githubusercontent.com` URL formats
- Markdown rendering with syntax highlighting and GitHub Flavored Markdown support
- Documentation links are displayed on individual API pages with provider badges