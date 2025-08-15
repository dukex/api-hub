# API Configuration Specification

This document defines the complete schema and configuration options for the `data/apis.json` file, which controls how APIs are displayed and accessed in API Hub.

## Configuration File Location

- **Local development**: `data/apis.json`
- **Docker deployment**: Mounted to `/app/data/apis.json`
- **Kubernetes**: ConfigMap mounted at the same path

## Schema Overview

```json
{
  "api-identifier": {
    "id": "api-identifier",
    "name": "Human Readable API Name",
    "team": "Owning Team Name",
    "description": "Brief description of the API",
    "openAPIUrl": "URL or path to OpenAPI specification",
    "docs": [
      {
        "url": "Documentation URL",
        "name": "Documentation Title",
        "description": "Brief description",
        "provider": "github" | "link"
      }
    ]
  }
}
```

## Field Specifications

### Required Fields

#### `id` (string)
- **Description**: Unique identifier for the API
- **Format**: kebab-case recommended (e.g., `user-service`, `payment-api`)
- **Constraints**: 
  - Must be unique within the configuration
  - Used in URLs (`/apis/{id}`)
  - Should match the object key
- **Example**: `"user-management-api"`

#### `name` (string)
- **Description**: Human-readable name displayed in the UI
- **Format**: Proper case with spaces allowed
- **Constraints**: 1-100 characters, no HTML or markdown
- **Example**: `"User Management API"`

#### `team` (string)
- **Description**: Name of the team responsible for the API
- **Usage**: Displayed as a badge on API cards
- **Example**: `"Platform Engineering"`

#### `description` (string)
- **Description**: Brief overview of the API's purpose
- **Format**: Plain text, 1-2 sentences
- **Constraints**: 10-500 characters, no HTML or markdown
- **Example**: `"Handles user authentication, profile management, and access control."`

#### `openAPIUrl` (string)
- **Description**: URL or path to the OpenAPI/Swagger specification
- **Supported formats**:
  - **External URLs**: `https://api.example.com/openapi.yaml`
  - **Local files**: `/specs/my-api.yaml` (relative to `/public/` directory)
- **Example**: `"https://petstore3.swagger.io/api/v3/openapi.json"`

### Optional Fields

#### `docs` (array)
- **Description**: Additional documentation links
- **Default**: Empty array `[]`
- **Items**: Array of documentation objects

## Documentation Object Schema

### Required Fields

#### `url` (string)
- **Description**: URL to the documentation
- **Supported formats**:
  - **GitHub blob URLs**: `https://github.com/owner/repo/blob/branch/path/file.md`
  - **GitHub raw URLs**: `https://raw.githubusercontent.com/owner/repo/branch/path/file.md`
  - **External links**: Any HTTP/HTTPS URL

#### `name` (string)
- **Description**: Display name for the documentation link
- **Format**: Title case recommended
- **Example**: `"Getting Started Guide"`

#### `provider` (string)
- **Description**: Documentation provider type
- **Options**:
  - `"github"`: GitHub-hosted markdown files (requires `GITHUB_TOKEN`)
  - `"link"`: External links (opens in new tab)

### Optional Fields

#### `description` (string)
- **Description**: Brief description of the documentation content
- **Example**: `"Complete setup and integration guide for new developers"`

## Complete Example

```json
{
  "user-service": {
    "id": "user-service",
    "name": "User Management Service",
    "team": "Identity & Access",
    "description": "Comprehensive user management including authentication, profiles, and permissions.",
    "openAPIUrl": "https://api.mycompany.com/user-service/openapi.yaml",
    "docs": [
      {
        "url": "https://github.com/mycompany/user-service/blob/main/README.md",
        "name": "Getting Started",
        "description": "Quick setup and basic usage examples",
        "provider": "github"
      },
      {
        "url": "https://github.com/mycompany/user-service/blob/main/docs/authentication.md",
        "name": "Authentication Guide",
        "description": "Detailed authentication and token management",
        "provider": "github"
      },
      {
        "url": "https://wiki.mycompany.com/user-service",
        "name": "Internal Wiki",
        "description": "Internal documentation and troubleshooting",
        "provider": "link"
      }
    ]
  },
  "payment-api": {
    "id": "payment-api",
    "name": "Payment Processing API",
    "team": "Payments",
    "description": "Secure payment processing with support for multiple payment methods.",
    "openAPIUrl": "/specs/payment-api.yaml",
    "docs": [
      {
        "url": "https://github.com/mycompany/payment-api/blob/main/INTEGRATION.md",
        "name": "Integration Guide",
        "provider": "github"
      }
    ]
  }
}
```

## Validation Rules

### File Structure
- Must be valid JSON
- Root must be an object (not array)
- Each API key must match its `id` field

### Field Validation
- All required fields must be present and non-empty
- URLs must be valid and accessible
- `provider` must be one of the supported values
- No duplicate `id` values across APIs

### OpenAPI Specification Requirements
- Must be a valid OpenAPI 3.x or Swagger 2.x specification
- Must be accessible from the application server
- Content-Type should be `application/json` or `application/yaml`

## Best Practices

### API Organization

```json
{
  "user-service": { "id": "user-service", "name": "User Service" },
  "payment-api": { "id": "payment-api", "name": "Payment API" },
  "notification-service": { "id": "notification-service", "name": "Notification Service" }
}
```

### Documentation Strategy

```json
"docs": [
  {
    "name": "Quick Start",
    "description": "Get up and running in 5 minutes",
    "provider": "github"
  },
  {
    "name": "API Reference",
    "description": "Complete endpoint documentation",
    "provider": "github"
  },
  {
    "name": "Advanced Usage",
    "description": "Complex scenarios and best practices",
    "provider": "github"
  }
]
```

## Troubleshooting

### Common Configuration Errors

**Invalid JSON syntax**
- Validate JSON using a linter
- Check for trailing commas
- Ensure proper quote escaping

**Missing required fields**
- Verify all required fields are present
- Check field spelling and case sensitivity

**Invalid OpenAPI URL**
- Verify URL is accessible from the application server
- Check network connectivity and firewall rules

**GitHub documentation not loading**
- Verify `GITHUB_TOKEN` environment variable is set
- Check token has read access to repositories

For additional troubleshooting, see [Common Issues Guide](../troubleshooting/common-issues.md).