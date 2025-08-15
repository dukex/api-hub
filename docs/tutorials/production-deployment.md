# Production Deployment Guide

This guide covers deploying API Hub to production environments using Docker and container orchestration platforms.

## Quick Start with Docker

### 1. Environment Configuration

Create a production environment file:

```bash
# .env.production
GEMINI_API_KEY=your_gemini_api_key_here
GITHUB_TOKEN=your_github_token_here
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 2. API Configuration

Prepare your API specifications in `data/apis.json`:

```json
{
  "my-api": {
    "id": "my-api",
    "name": "My Production API",
    "team": "Platform Team",
    "description": "Core business API for our platform",
    "openAPIUrl": "https://api.mycompany.com/openapi.yaml",
    "docs": [
      {
        "url": "https://github.com/mycompany/my-api/blob/main/README.md",
        "name": "Getting Started Guide",
        "description": "Complete setup and usage guide",
        "provider": "github"
      }
    ]
  }
}
```

### 3. Build and Deploy

```bash
# Build the production image
docker build -t api-hub:latest .

# Run with environment file
docker run --env-file .env.production -p 3000:3000 -v $(pwd)/data:/app/data api-hub:latest
```

## Kubernetes Deployment

### Deployment Manifest

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-hub
spec:
  replicas: 3
  selector:
    matchLabels:
      app: api-hub
  template:
    metadata:
      labels:
        app: api-hub
    spec:
      containers:
      - name: api-hub
        image: api-hub:latest
        ports:
        - containerPort: 3000
        env:
        - name: GEMINI_API_KEY
          valueFrom:
            secretKeyRef:
              name: api-hub-secrets
              key: gemini-api-key
        - name: GITHUB_TOKEN
          valueFrom:
            secretKeyRef:
              name: api-hub-secrets
              key: github-token
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
---
apiVersion: v1
kind: Service
metadata:
  name: api-hub-service
spec:
  selector:
    app: api-hub
  ports:
  - port: 80
    targetPort: 3000
```

## Health Checks

The application provides a health endpoint at `/health` that returns:

```json
{"status":"ok","timestamp":"2024-01-15T10:30:00Z"}
```

## Troubleshooting

For common deployment issues, see [Troubleshooting Guide](../troubleshooting/common-issues.md).

For environment configuration, see [Environment Variables](../reference/environment-variables.md).