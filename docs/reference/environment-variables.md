# Environment Variables Reference

This document provides a comprehensive reference for all environment variables used in API Hub.

## Required Variables

### `GEMINI_API_KEY`

**Required for AI Features**

- **Description**: Google AI (Gemini) API key for AI-powered API summarization
- **Format**: String (API key from Google AI Studio)
- **Example**: `AIzaSyC7Kl2Pm9FhRnNQZ8X3VfGjH4NwP1K2L5Q`
- **Where to get**: [Google AI Studio](https://makersuite.google.com/app/apikey)
- **Impact if missing**: AI summarization features will be disabled

```bash
GEMINI_API_KEY=your_api_key_here
```

### `GITHUB_TOKEN`

**Required for GitHub Documentation**

- **Description**: GitHub Personal Access Token for fetching documentation from repositories
- **Format**: String (GitHub PAT with repo read permissions)
- **Example**: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- **Where to get**: [GitHub Settings > Personal access tokens](https://github.com/settings/tokens)
- **Required Scopes**: `public_repo` (for public repos) or `repo` (for private repos)
- **Impact if missing**: GitHub-hosted documentation will not be accessible

```bash
GITHUB_TOKEN=ghp_your_token_here
```

## Optional Variables

### `NODE_ENV`

**Environment Type**

- **Description**: Specifies the Node.js environment
- **Default**: `development`
- **Options**: `development`, `production`, `test`
- **Example**: `production`

```bash
NODE_ENV=production
```

### `PORT`

**Server Port**

- **Description**: Port number for the application server
- **Default**: `3000`
- **Format**: Integer (1-65535)
- **Example**: `8080`

```bash
PORT=3000
```

### `NEXT_TELEMETRY_DISABLED`

**Next.js Telemetry**

- **Description**: Disables Next.js anonymous telemetry
- **Default**: `false`
- **Options**: `true`, `false`, `1`, `0`
- **Recommendation**: Set to `1` in production for privacy

```bash
NEXT_TELEMETRY_DISABLED=1
```

## Environment File Examples

### Development (`.env.local`)

```bash
# AI Features
GEMINI_API_KEY=AIzaSyC7Kl2Pm9FhRnNQZ8X3VfGjH4NwP1K2L5Q

# GitHub Integration
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Development Settings
NODE_ENV=development
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

### Production (`.env.production`)

```bash
# AI Features (Required)
GEMINI_API_KEY=AIzaSyC7Kl2Pm9FhRnNQZ8X3VfGjH4NwP1K2L5Q

# GitHub Integration (Required)
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Production Settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
```

## Security Best Practices

1. **Never commit secrets to version control**
   - Use `.env.example` for templates
   - Add `.env*` to `.gitignore`

2. **Use secret management services**
   - Kubernetes Secrets
   - AWS Secrets Manager
   - Google Cloud Secret Manager

3. **Rotate secrets regularly**
   - GitHub tokens: Every 90 days
   - API keys: According to provider recommendations

## Troubleshooting

**"AI summarization disabled"**
- Check `GEMINI_API_KEY` is set and valid
- Verify Google AI service is accessible

**"GitHub documentation unavailable"**
- Verify `GITHUB_TOKEN` is set
- Check token has required repository permissions

For additional help, see [Troubleshooting Guide](../troubleshooting/common-issues.md).