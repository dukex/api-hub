# Architecture Overview

API Hub follows a clean architecture pattern with clear separation of concerns, making it maintainable, testable, and scalable.

## Clean Architecture Principles

The application is structured in three main layers:

```
┌─────────────────────────────────────────────┐
│              Application Layer              │
│  ┌─────────────────────────────────────┐    │
│  │         Next.js App Router         │    │
│  │  ┌─────────────────────────────┐   │    │
│  │  │       UI Components         │   │    │
│  │  │  ┌─────────────────────┐    │   │    │
│  │  │  │   Domain Layer     │    │   │    │
│  │  │  │  ┌─────────────┐   │    │   │    │
│  │  │  │  │ Business    │   │    │   │    │
│  │  │  │  │ Logic       │   │    │   │    │
│  │  │  │  │ (Services)  │   │    │   │    │
│  │  │  │  └─────────────┘   │    │   │    │
│  │  │  └─────────────────────┘    │   │    │
│  │  └─────────────────────────────┘   │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
┌─────────────────────────────────────────────┐
│              Adapters Layer                 │
│  ┌─────────────┐  ┌─────────────┐  ┌──────┐ │
│  │ File Repo   │  │ GitHub      │  │ AI   │ │
│  │             │  │ Adapter     │  │ Svc  │ │
│  └─────────────┘  └─────────────┘  └──────┘ │
└─────────────────────────────────────────────┘
```

## Layer Breakdown

### Domain Layer (`/src/domain/`)

The core business logic with no external dependencies.

#### API Domain (`/src/domain/api/`)

**Entities (`entity.ts`)**
```typescript
interface API {
  id: string
  name: string
  team: string
  description: string
  openAPIUrl: string
  docs: APIDocumentation[]
  aiSummary?: string
}
```

**Repository Interface (`repository.ts`)**
```typescript
interface APIDataRepository {
  getAPIs(): Promise<API[]>
  getAPIById(id: string): Promise<API | null>
}
```

**Business Logic (`service.ts`)**
- API data operations with caching
- AI summarization orchestration
- Error handling and fallback strategies

#### Documentation Domain (`/src/domain/documentation/`)

**Repository Interface (`repository.ts`)**
```typescript
interface DocumentationRepository {
  getDocumentationContent(url: string): Promise<string>
}
```

**Business Logic (`service.ts`)**
- Documentation content fetching
- URL-safe ID generation
- Provider-specific URL handling

### Adapters Layer (`/src/adapters/`)

Infrastructure implementations that adapt external services to domain interfaces.

#### File Repositories (`/src/adapters/file_repositories/`)

**API Repository (`api/repository.ts`)**
- Reads configuration from `data/apis.json`
- Validates API specifications
- Implements caching for performance

#### GitHub Repositories (`/src/adapters/github_repositories/`)

**Documentation Repository (`documentation/repository.ts`)**
- GitHub API integration using Octokit
- Supports both blob and raw URL formats
- Handles authentication with personal access tokens

### Application Layer (`/src/app/`)

Next.js App Router structure with clean routing and component organization.

#### Route Structure
```
/src/app/
├── page.tsx                    # Home page with API listing
├── apis/
│   └── [id]/
│       ├── page.tsx           # API detail page
│       └── docs/
│           └── [docId]/
│               └── page.tsx   # Documentation viewer
├── api/
│   ├── health/
│   │   └── route.ts          # Health check endpoint
│   └── revalidate/
│       └── route.ts          # Cache revalidation
└── globals.css
```

## Data Flow

### API Discovery Flow

1. User visits homepage
2. App calls APIService.getAPIs()
3. Service reads from FileRepository
4. Optional AI summarization via AIService
5. Return enriched API list to UI

### Documentation Flow

1. User clicks documentation link
2. App calls DocumentationService.getContent(url)
3. Service delegates to GitHubRepository
4. Repository fetches via GitHub API
5. Return processed markdown content

## Dependency Injection

Services are composed using dependency injection:

```typescript
// /src/lib/api-repository.ts
const githubRepo = process.env.GITHUB_TOKEN 
  ? new GitHubDocumentationRepository(new Octokit({
      auth: process.env.GITHUB_TOKEN
    }))
  : null

const documentationService = new DocumentationService(githubRepo)
const apiRepository = new FileAPIDataRepository()
export const apiService = new APIService(apiRepository, documentationService)
```

## AI Integration Architecture

### Google AI (Gemini) Integration

API Service → AI Flow (Genkit) → Gemini API

**AI Flow Structure** (`/src/ai/flows/summarize-api.ts`)
- Genkit flow definition
- OpenAPI specification processing
- Prompt engineering for consistent summaries
- Error handling with graceful fallback

## Error Handling Strategy

### Layered Error Handling

1. **Domain Layer**: Business logic errors
2. **Adapter Layer**: Infrastructure errors (network, file system)
3. **Application Layer**: User-facing error boundaries

### Graceful Degradation

```typescript
class APIService {
  async getAPIWithSummary(api: API): Promise<API> {
    try {
      const summary = await this.aiService.summarizeAPI(api.openAPIUrl)
      return { ...api, aiSummary: summary }
    } catch (error) {
      // Graceful degradation - return API without summary
      console.warn('AI summarization failed:', error)
      return api
    }
  }
}
```

## Technology Stack

- **Frontend**: Next.js 15 with App Router, React Server Components
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI**: Google AI (Gemini) via Genkit framework
- **Integration**: GitHub API via Octokit
- **Infrastructure**: Docker, Kubernetes, multi-cloud support
- **Language**: TypeScript with strict type checking

This architecture provides a solid foundation for maintaining and extending API Hub while ensuring excellent performance, security, and developer experience.