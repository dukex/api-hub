# API Hub

🚀 **Simple OpenAPI Discovery Portal** - Create an elegant API portal for your OpenAPI specifications with minimal configuration.

## ✨ Features

- **📋 API Discovery**: Searchable and filterable list of APIs by name, team, and metadata
- **📖 Interactive Documentation**: Beautiful API docs powered by Swagger UI
- **🔧 Simple Configuration**: Just provide OpenAPI URLs and names - we handle the rest
- **🤖 AI-Powered Summaries**: Automatic API summaries using generative AI
- **🎨 Modern UI**: Clean, professional interface with intuitive navigation

| Screenshot | |
|-|-|
|![image](https://github.com/user-attachments/assets/66a790aa-8333-4c3e-8d98-f4dce978fb60) | Listing your APIs |
|![image](https://github.com/user-attachments/assets/a974e898-4da1-47d8-b29a-9e1fa777a652) | See API details with userful information about the API |
|![image](https://github.com/user-attachments/assets/82733dc2-7f35-4aac-ac63-419053631571) | Get the complete API documentation using only OpenAPI spec |


## 🚀 Quick Start

1. **Clone and install**:
   ```bash
   git clone git@github.com:dukex/api-hub.git api-hub
   cd api-hub
   npm install
   ```

2. **Configure your APIs**:
   Create `data/apis.json` to add your OpenAPI specifications:
   ```json
   {
     "your-api": {
       "id": "your-api",
       "name": "Your API Name",
       "team": "Your Team",
       "description": "Brief description of your API",
       "openAPIUrl": "https://your-api.com/openapi.yaml"
     }
   }
   ```



3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Visit your portal**: Open [http://localhost:3000](http://localhost:3000)

## 🐳 Docker Usage

You can also run API Hub using Docker:

```bash
docker run -p 3000:3000 -v ./examples/specs:/app/data docker.io/dukex/api-hub
```

This mounts your local `./examples/specs` directory containing your `apis.json` configuration file to the container.

## 📝 Configuration

APIs are configured in `./data/apis.json`. Each API entry requires:

- `id`: Unique identifier
- `name`: Display name
- `team`: Team or organization name
- `description`: Brief description
- `openAPIUrl`: URL to your OpenAPI/Swagger specification

## 🛠️ Development

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## 🤖 AI Features

The portal includes AI-powered API summarization powered by Google AI. To enable AI features, set the `GEMINI_API_KEY` environment variable:

```bash
export GEMINI_API_KEY=your_gemini_api_key_here
```

## 📚 Documentation Features

API Hub supports additional documentation from GitHub repositories. Each API can have multiple documentation links that are fetched and rendered as markdown. To enable GitHub documentation features, set the `GITHUB_TOKEN` environment variable:

```bash
export GITHUB_TOKEN=your_github_personal_access_token
```

### Adding Documentation to APIs

In your `apis.json` configuration, add a `docs` array to any API:

```json
{
  "my-api": {
    "id": "my-api",
    "name": "My API",
    "team": "Backend Team",
    "description": "A sample API",
    "openAPIUrl": "https://api.example.com/openapi.yaml",
    "docs": [
      {
        "url": "https://github.com/myorg/my-api/blob/main/README.md",
        "name": "Getting Started",
        "description": "Complete setup and usage guide",
        "provider": "github"
      },
      {
        "url": "https://github.com/myorg/my-api/blob/main/docs/advanced.md",
        "name": "Advanced Usage",
        "description": "Advanced configuration and examples",
        "provider": "github"
      }
    ]
  }
}
```

Documentation will be available at `/apis/{api-id}/docs/{doc-id}` where `doc-id` is generated from the documentation name.

## 🎨 Design

- **Primary**: Vivid blue (#4285F4) for trust and innovation
- **Background**: Light gray (#F5F5F5) for clean, modern feel
- **Accent**: Orange (#FF9800) for interactive elements
- **Typography**: Clean sans-serif for professional accessibility


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
