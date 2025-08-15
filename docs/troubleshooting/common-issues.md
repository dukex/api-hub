# Common Issues and Troubleshooting

This guide covers the most frequently encountered issues when deploying and using API Hub, along with their solutions.

## Quick Diagnosis

### Health Check

First, verify the application is running correctly:

```bash
# Check application health
curl http://localhost:3000/health

# Expected response
{"status":"ok","timestamp":"2024-01-15T10:30:00Z"}
```

### Service Status

Check which features are available:

```bash
# Check logs for service status
docker logs <container-name> | grep -E "(AI|GitHub|Configuration)"

# Look for these messages:
# ✅ AI summarization: Enabled
# ✅ GitHub documentation: Enabled  
# ✅ Configuration loaded: 5 APIs
```

## Application Startup Issues

### Container Fails to Start

**Symptoms:**
- Container exits immediately
- "Application failed to start" errors
- Port binding failures

**Common Causes:**

1. **Missing Configuration File**
   ```bash
   Error: ENOENT: no such file or directory, open '/app/data/apis.json'
   ```
   
   **Solution:**
   ```bash
   # Ensure configuration is mounted correctly
   docker run -v $(pwd)/data:/app/data api-hub:latest
   
   # Or create minimal configuration
   echo '{}' > data/apis.json
   ```

2. **Invalid JSON Configuration**
   ```bash
   SyntaxError: Unexpected token '}' in JSON at position 123
   ```
   
   **Solution:**
   ```bash
   # Validate JSON syntax
   cat data/apis.json | jq .
   
   # Fix syntax errors - common issues: trailing commas, unescaped quotes
   ```

3. **Port Already in Use**
   ```bash
   Error: listen EADDRINUSE :::3000
   ```
   
   **Solution:**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill the process or use different port
   docker run -p 8080:3000 api-hub:latest
   ```

### Environment Variable Issues

**Missing Environment Variables**
```bash
Warning: GEMINI_API_KEY not found. AI summarization disabled.
Warning: GITHUB_TOKEN not found. GitHub documentation disabled.
```

**Solution:**
```bash
# Create environment file
cat > .env << EOF
GEMINI_API_KEY=your_api_key_here
GITHUB_TOKEN=your_github_token_here
EOF

# Use with Docker
docker run --env-file .env api-hub:latest
```

## Configuration Issues

### APIs Not Displaying

**Symptoms:**
- Empty API list on homepage
- "No APIs found" message

**Diagnosis:**
```bash
# Check configuration file exists and is readable
ls -la data/apis.json

# Validate JSON structure
jq . data/apis.json

# Check application logs
docker logs <container> | grep -i "configuration"
```

**Common Solutions:**

1. **Empty or Invalid Configuration**
   ```json
   // ❌ Invalid - empty object
   {}
   
   // ✅ Valid - minimal API
   {
     "example-api": {
       "id": "example-api",
       "name": "Example API",
       "team": "Platform",
       "description": "Example API for testing",
       "openAPIUrl": "/example-openapi.yaml"
     }
   }
   ```

2. **File Permissions**
   ```bash
   # Ensure file is readable
   chmod 644 data/apis.json
   
   # Check Docker mount permissions
   ls -la data/
   ```

### OpenAPI Specification Issues

**Symptoms:**
- API cards show but no specification loads
- "Failed to load OpenAPI spec" errors

**Common Issues:**

1. **URL Not Accessible**
   ```bash
   # Test URL accessibility from container
   docker exec <container> curl -I https://api.example.com/openapi.yaml
   
   # Expected: 200 OK
   # If 404/403: Check URL and permissions
   ```

2. **Local File Not Found**
   ```bash
   # For openAPIUrl: "/specs/my-api.yaml"
   # File should be at: public/specs/my-api.yaml
   
   ls -la public/specs/
   ```

## AI Integration Issues

### AI Summarization Not Working

**Symptoms:**
- No AI summaries on API cards
- "AI summarization failed" in logs

**Diagnosis:**
```bash
# Check if AI service is enabled
docker logs <container> | grep -i "gemini\\|ai"

# Test API key validity
curl -H "Authorization: Bearer $GEMINI_API_KEY" \
  https://generativelanguage.googleapis.com/v1/models
```

**Common Solutions:**

1. **Invalid API Key**
   ```bash
   Error: 401 Unauthorized - Invalid API key
   ```
   
   **Solution:**
   - Verify API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Ensure no extra spaces or characters
   - Check key has Gemini API access

2. **API Quota Exceeded**
   ```bash
   Error: 429 Too Many Requests - Quota exceeded
   ```
   
   **Solution:**
   - Check quota usage in Google Cloud Console
   - Consider upgrading API plan

3. **Network Connectivity**
   ```bash
   Error: ENOTFOUND generativelanguage.googleapis.com
   ```
   
   **Solution:**
   ```bash
   # Test network connectivity
   nslookup generativelanguage.googleapis.com
   
   # Check firewall/proxy settings
   curl -v https://generativelanguage.googleapis.com
   ```

## GitHub Integration Issues

### Documentation Not Loading

**Symptoms:**
- Documentation links show but content doesn't load
- "Failed to fetch documentation" errors

**Diagnosis:**
```bash
# Test GitHub token
curl -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/user

# Expected: User information
# If 401: Invalid token
```

**Common Solutions:**

1. **Invalid GitHub Token**
   ```bash
   Error: 401 Unauthorized - Bad credentials
   ```
   
   **Solution:**
   - Generate new token at [GitHub Settings](https://github.com/settings/tokens)
   - Ensure token has `repo` or `public_repo` scope
   - For organization repos, token needs org access

2. **Repository Access**
   ```bash
   Error: 404 Not Found - Repository not found
   ```
   
   **Solution:**
   ```bash
   # Test repository access
   curl -H "Authorization: token $GITHUB_TOKEN" \
     https://api.github.com/repos/owner/repo
   
   # If 404: Check repository name and visibility
   # If 403: Check token permissions
   ```

3. **Rate Limiting**
   ```bash
   Error: 403 Forbidden - API rate limit exceeded
   ```
   
   **Solution:**
   - Authenticated requests: 5,000/hour
   - Implement caching to reduce API calls

4. **Invalid URL Format**
   ```json
   // ❌ Invalid formats
   "url": "github.com/owner/repo/blob/main/README.md"
   "url": "https://github.com/owner/repo/README.md"
   
   // ✅ Valid formats
   "url": "https://github.com/owner/repo/blob/main/README.md"
   "url": "https://raw.githubusercontent.com/owner/repo/main/README.md"
   ```

## Performance Issues

### Slow Page Loading

**Symptoms:**
- Long loading times for API list
- Timeouts when accessing documentation

**Diagnosis:**
```bash
# Check application performance
time curl http://localhost:3000/

# Monitor resource usage
docker stats <container>

# Check external API response times
time curl https://api.github.com/
time curl https://generativelanguage.googleapis.com/
```

**Solutions:**

1. **High Memory Usage**
   ```bash
   # Increase container memory limit
   docker run -m 1g api-hub:latest
   ```

2. **External API Latency**
   - Implement caching
   - Check network connectivity to external services

## Data and Content Issues

### Missing API Documentation

**Symptoms:**
- API shows in list but documentation is empty
- Broken markdown rendering

**Solutions:**

1. **Check Documentation URLs**
   ```bash
   # Test URL accessibility
   curl -I "https://github.com/owner/repo/blob/main/README.md"
   
   # For GitHub, try raw URL
   curl "https://raw.githubusercontent.com/owner/repo/main/README.md"
   ```

2. **Validate Markdown Content**
   - Check for valid markdown
   - Ensure no binary content
   - Verify character encoding (UTF-8)

### Incorrect API Information

**Symptoms:**
- Wrong team names or descriptions
- Outdated API specifications

**Solutions:**
```bash
# Update configuration
vim data/apis.json

# Trigger revalidation
curl -X POST http://localhost:3000/api/revalidate

# Or restart container
docker restart <container>
```

## Debugging Tools

### Enable Debug Logging

```bash
# Set debug environment variables
LOG_LEVEL=debug
REQUEST_LOGGING=true

# Run with debug logging
docker run -e LOG_LEVEL=debug -e REQUEST_LOGGING=true api-hub:latest
```

### Container Inspection

```bash
# Execute shell in running container
docker exec -it <container> /bin/sh

# Check file system
ls -la /app/data/
cat /app/data/apis.json

# Check environment variables
env | grep -E "(GEMINI|GITHUB|NODE)"

# Test internal connectivity
curl http://localhost:3000/health
```

### Log Analysis

```bash
# View recent logs
docker logs --tail 100 <container>

# Follow logs in real-time
docker logs -f <container>

# Filter specific errors
docker logs <container> 2>&1 | grep -i error
```

## Recovery Procedures

### Configuration Recovery

```bash
# Backup current configuration
cp data/apis.json data/apis.json.backup

# Restore from backup
cp data/apis.json.backup data/apis.json

# Reset to minimal configuration
cat > data/apis.json << EOF
{
  "example": {
    "id": "example",
    "name": "Example API",
    "team": "Platform",
    "description": "Test API",
    "openAPIUrl": "https://petstore3.swagger.io/api/v3/openapi.json"
  }
}
EOF
```

### Service Recovery

```bash
# Restart application
docker restart <container>

# Force pull latest image
docker pull api-hub:latest
docker run api-hub:latest
```

## Getting Help

### Collecting Debug Information

When reporting issues, collect:

```bash
# System information
docker version
docker-compose version
uname -a

# Application information
docker logs <container> --tail 500
docker inspect <container>
cat data/apis.json

# Environment (remove sensitive data)
env | grep -E "(NODE|LOG|GEMINI|GITHUB)" | sed 's/=.*/=***REDACTED***/'
```

For additional deployment guidance, see [Production Deployment Guide](../tutorials/production-deployment.md) and [Environment Variables Reference](../reference/environment-variables.md).