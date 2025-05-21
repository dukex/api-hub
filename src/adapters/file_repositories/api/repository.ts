import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import type { API, CreateAPIDTO, UpdateAPIDTO } from '@/domain/api/entity';
import type { APIRepository } from '@/domain/api/repository';

/**
 * File-based implementation of the API Repository
 * Stores API metadata in a JSON file and specifications in separate files
 */
export class FileAPIRepository implements APIRepository {
  private apiDataPath: string;
  private specDirectory: string; // Relative to public folder
  private apis: Record<string, API> = {};
  private initialized = false;

  /**
   * Creates a new FileAPIRepository
   * @param apiDataPath - Path to the JSON file storing API metadata
   * @param specDirectory - Directory path for API specification files (relative to public)
   */
  constructor(
    apiDataPath = path.join(process.cwd(), 'src', 'adapters', 'file_repositories', 'api', 'data', 'apis.json'),
    specDirectory = 'api-specs' // This will be joined with public path later
  ) {
    this.apiDataPath = apiDataPath;
    this.specDirectory = specDirectory;
  }

  /**
   * Initializes the repository by loading data from disk
   * Creates necessary directories and files if they don't exist
   */
  private async initialize(): Promise<void> {
    if (this.initialized) return;

    // Ensure directories exist
    await fs.mkdir(path.dirname(this.apiDataPath), { recursive: true });
    const publicSpecDir = path.join(process.cwd(), 'public', this.specDirectory);
    await fs.mkdir(publicSpecDir, { recursive: true });

    try {
      // Load API data from file
      const data = await fs.readFile(this.apiDataPath, 'utf-8');
      const rawApis = JSON.parse(data) as Record<string, any>;
      this.apis = {};
      for (const id in rawApis) {
        const api = rawApis[id];
        this.apis[id] = {
          ...api,
          createdAt: api.createdAt ? new Date(api.createdAt) : undefined,
          updatedAt: api.updatedAt ? new Date(api.updatedAt) : undefined,
        };
      }
    } catch (error) {
      // If file doesn't exist or is invalid, create a new empty one
      this.apis = {}; // Start with empty data if file not found or parsing error
      await this.saveData(); // Create the file if it doesn't exist
    }

    this.initialized = true;
  }

  /**
   * Saves current API data to disk
   */
  private async saveData(): Promise<void> {
    await fs.writeFile(this.apiDataPath, JSON.stringify(this.apis, null, 2));
  }

  /**
   * Retrieves all APIs from the repository
   */
  async findAll(filters?: { name?: string; team?: string }): Promise<API[]> {
    await this.initialize();
    let apis = Object.values(this.apis);

    if (filters?.name) {
      apis = apis.filter(api => api.name.toLowerCase().includes(filters.name!.toLowerCase()));
    }
    if (filters?.team) {
      apis = apis.filter(api => api.team.toLowerCase().includes(filters.team!.toLowerCase()));
    }
    
    return apis;
  }

  /**
   * Retrieves a specific API by ID
   */
  async findById(id: string): Promise<API | null> {
    await this.initialize();
    return this.apis[id] || null;
  }

  /**
   * Retrieves APIs filtered by team
   */
  async findByTeam(team: string): Promise<API[]> {
    await this.initialize();
    return Object.values(this.apis).filter(api => api.team === team);
  }

  /**
   * Creates a new API in the repository
   */
  async create(apiData: CreateAPIDTO): Promise<API> {
    await this.initialize();
    
    const id = uuidv4();
    const now = new Date();
    
    const api: API = {
      ...apiData,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.apis[id] = api;
    await this.saveData();
    
    return api;
  }

  /**
   * Updates an existing API in the repository
   */
  async update(id: string, data: UpdateAPIDTO): Promise<API | null> {
    await this.initialize();
    
    if (!this.apis[id]) return null;
    
    this.apis[id] = {
      ...this.apis[id],
      ...data,
      updatedAt: new Date()
    };
    
    await this.saveData();
    return this.apis[id];
  }

  /**
   * Deletes an API from the repository
   */
  async delete(id: string): Promise<boolean> {
    await this.initialize();
    
    if (!this.apis[id]) return false;
    
    delete this.apis[id];
    await this.saveData();
    
    return true;
  }

  /**
   * Retrieves the API specification document.
   * If documentationUrl starts with '/', it's treated as a local path relative to `public`.
   * Example: `/api-specs/petstore.json` -> `public/api-specs/petstore.json`.
   * If it's an external URL, it returns the URL string.
   */
  async getSpecification(id: string): Promise<string | null> {
    await this.initialize();
    
    const api = this.apis[id];
    if (!api) return null;
    
    try {
      // Handle local files relative to public directory
      if (api.documentationUrl.startsWith('/')) {
        // Ensure documentationUrl correctly points within this.specDirectory, e.g. /api-specs/file.json
        const filePath = path.join(process.cwd(), 'public', api.documentationUrl);
        return await fs.readFile(filePath, 'utf-8');
      }
      
      // Handle external URLs by returning the URL directly
      // The service/frontend will handle fetching from this URL
      if (api.documentationUrl.startsWith('http://') || api.documentationUrl.startsWith('https://')) {
        return api.documentationUrl;
      }

      // If it's not an absolute path or a URL, assume it's a file name within the specDirectory
      // This part might need refinement based on how documentationUrl is structured for non-URL, non-absolute paths
      const fallbackFilePath = path.join(process.cwd(), 'public', this.specDirectory, api.documentationUrl);
      return await fs.readFile(fallbackFilePath, 'utf-8');

    } catch (error) {
      console.error(`Error reading API specification for ${id} (URL: ${api.documentationUrl}):`, error);
      return null;
    }
  }
}
