# API Hub Documentation

Welcome to the comprehensive documentation for API Hub - an elegant OpenAPI discovery portal built with Next.js 15.

## Quick Start

- **[Production Deployment Guide](tutorials/production-deployment.md)** - Deploy to production environments
- **[Environment Variables](reference/environment-variables.md)** - Configure your environment
- **[API Configuration](configuration/api-specification.md)** - Set up your APIs

## Documentation Structure

This documentation follows the [Documentation System](https://documentation.divio.com/) framework with four types of content:

### 📚 Tutorials
Step-by-step learning-oriented guides:
- **[Production Deployment](tutorials/production-deployment.md)** - Complete deployment guide for Docker, Kubernetes, and cloud platforms

### 🔧 How-To Guides
Problem-oriented practical guides:
- **[Common Issues](troubleshooting/common-issues.md)** - Troubleshooting and problem resolution

### 📖 Reference
Information-oriented technical reference:
- **[Environment Variables](reference/environment-variables.md)** - Complete environment configuration reference
- **[API Configuration Schema](configuration/api-specification.md)** - JSON schema and examples

### 💡 Explanation
Understanding-oriented theoretical knowledge:
- **[Architecture Overview](architecture/overview.md)** - System design and architectural decisions

## Quick Links

### For Developers
- [Architecture Overview](architecture/overview.md) - Understand the clean architecture pattern
- [API Configuration](configuration/api-specification.md) - Configure your APIs
- [Environment Setup](reference/environment-variables.md) - Development environment

### For DevOps
- [Production Deployment](tutorials/production-deployment.md) - Docker, Kubernetes, cloud deployment
- [Environment Variables](reference/environment-variables.md) - Security and configuration
- [Troubleshooting](troubleshooting/common-issues.md) - Common deployment issues

### For Platform Teams
- [Architecture Overview](architecture/overview.md) - System design decisions
- [API Configuration](configuration/api-specification.md) - API catalog management
- [Troubleshooting](troubleshooting/common-issues.md) - Operational support

## What is API Hub?

API Hub is a Next.js 15 application that creates an elegant discovery portal for OpenAPI specifications. It features:

- **🔍 API Discovery**: Elegant catalog of your organization's APIs
- **🤖 AI Summaries**: Powered by Google Gemini for intelligent API descriptions
- **📚 Documentation**: Integrated GitHub documentation viewing
- **⚡ Modern Stack**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **🏗️ Clean Architecture**: Domain-driven design with clear separation of concerns
- **🐳 Production Ready**: Docker containerization with Kubernetes support

## Key Features

### AI-Powered Summaries
Automatically generates intelligent summaries of your APIs using Google Gemini AI, making it easier for developers to understand what each API does at a glance.

### GitHub Integration
Seamlessly integrates with GitHub repositories to display documentation directly in the portal, supporting both public and private repositories.

### Clean Architecture
Built using clean architecture principles with domain, adapter, and application layers for maximum maintainability and testability.

### Enterprise Ready
- Docker containerization for consistent deployments
- Kubernetes manifests for scalable orchestration
- Environment-based configuration management
- Health checks and monitoring support
- Security best practices built-in

## Technology Stack

- **Frontend**: Next.js 15 with App Router, React Server Components
- **Styling**: Tailwind CSS with shadcn/ui components
- **AI**: Google AI (Gemini) via Genkit framework
- **Integration**: GitHub API via Octokit
- **Infrastructure**: Docker, Kubernetes, multi-cloud support
- **Language**: TypeScript with strict type checking

## Documentation Status

| Document | Status | Description |
|----------|--------|-------------|
| [Production Deployment](tutorials/production-deployment.md) | ✅ Complete | Docker, Kubernetes, cloud deployment guide |
| [Environment Variables](reference/environment-variables.md) | ✅ Complete | Complete environment configuration reference |
| [Architecture Overview](architecture/overview.md) | ✅ Complete | Clean architecture explanation with diagrams |
| [API Configuration](configuration/api-specification.md) | ✅ Complete | JSON schema and configuration guide |
| [Troubleshooting](troubleshooting/common-issues.md) | ✅ Complete | Common issues and resolution guide |

## Getting Started

1. **Read the [Architecture Overview](architecture/overview.md)** to understand the system design
2. **Follow the [Production Deployment Guide](tutorials/production-deployment.md)** for your deployment scenario
3. **Configure your APIs** using the [API Configuration Schema](configuration/api-specification.md)
4. **Set up environment variables** using the [Environment Variables Reference](reference/environment-variables.md)

## Contributing to Documentation

This documentation is maintained alongside the codebase. When making changes:

1. Update relevant documentation sections
2. Follow the four-type documentation structure
3. Include practical examples and code snippets
4. Test all deployment instructions
5. Keep troubleshooting guides current

## Support

For support and questions:

1. **Check the [Troubleshooting Guide](troubleshooting/common-issues.md)** for common issues
2. **Review [Environment Variables](reference/environment-variables.md)** for configuration problems
3. **Consult [Architecture Overview](architecture/overview.md)** for design questions
4. **Create GitHub issues** for bugs and feature requests

---

*This documentation was created following enterprise documentation standards and is maintained as part of the API Hub project.*