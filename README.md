# API Hub

🚀 **Simple OpenAPI Discovery Portal** - Create an elegant API portal for your OpenAPI specifications with minimal configuration.

## ✨ Features

- **📋 API Discovery**: Searchable and filterable list of APIs by name, team, and metadata
- **📖 Interactive Documentation**: Beautiful API docs powered by Swagger UI
- **🔧 Simple Configuration**: Just provide OpenAPI URLs and names - we handle the rest
- **🤖 AI-Powered Summaries**: Automatic API summaries using generative AI
- **🎨 Modern UI**: Clean, professional interface with intuitive navigation

## 🚀 Quick Start

1. **Clone and install**:
   ```bash
   git clone git@github.com:dukex/api-hub.git api-hub
   cd api-hub
   npm install
   ```

2. **Configure your APIs**:
   Edit `examples/specs/apis.json` to add your OpenAPI specifications:
   ```json
   {
     "your-api": {
       "id": "your-api",
       "name": "Your API Name",
       "team": "Your Team",
       "description": "Brief description of your API",
       "documentationUrl": "https://your-api.com/openapi.yaml"
     }
   }
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Visit your portal**: Open [http://localhost:9092](http://localhost:9092)

## 🐳 Docker Usage

You can also run API Hub using Docker:

```bash
docker run -p 3000:3000 -v ./specs:/app/data docker.io/dukex/api-hub
```

This mounts your local `specs` directory containing your `apis.json` configuration file to the container.

## 📝 Configuration

APIs are configured in `examples/specs/apis.json`. Each API entry requires:

- `id`: Unique identifier
- `name`: Display name
- `team`: Team or organization name
- `description`: Brief description
- `documentationUrl`: URL to your OpenAPI/Swagger specification

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

## 🎨 Design

- **Primary**: Vivid blue (#4285F4) for trust and innovation
- **Background**: Light gray (#F5F5F5) for clean, modern feel
- **Accent**: Orange (#FF9800) for interactive elements
- **Typography**: Clean sans-serif for professional accessibility

| |
|-|
|![image](https://github.com/user-attachments/assets/66a790aa-8333-4c3e-8d98-f4dce978fb60) |
|![image](https://github.com/user-attachments/assets/eff85fe4-bb92-46fc-8660-21de11010021) |
|![image](https://github.com/user-attachments/assets/82733dc2-7f35-4aac-ac63-419053631571) |
|![image](https://github.com/user-attachments/assets/b0d7f35d-9541-4874-83f8-410dbea2dc91) |




## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
