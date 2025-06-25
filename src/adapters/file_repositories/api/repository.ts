import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { API, CreateAPIDTO, UpdateAPIDTO } from "@/domain/api/entity";
import type { APIDataRepository } from "@/domain/api/repository";

export class FileAPIDataRepository implements APIDataRepository {
  private apiDataPath: string;
  private apis: Record<string, API> = {};
  private initialized = false;

  constructor(apiDataPath = path.join(process.cwd(), "data", "apis.json")) {
    this.apiDataPath = apiDataPath;
  }

  private async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const data = await fs.readFile(this.apiDataPath, "utf-8");
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
      console.error(`Error reading API data from ${this.apiDataPath}:`, error);
      this.apis = {};
      await this.saveData();
    }

    this.initialized = true;
  }

  private async saveData(): Promise<void> {}

  async findAll(filters: {
    query: { name?: string };
    order: {
      by: "name" | "team";
      order: "asc" | "desc";
    };
  }): Promise<API[]> {
    await this.initialize();
    let apis = Object.values(this.apis);

    if (filters?.query.name) {
      apis = apis.filter((api) =>
        api.name.toLowerCase().includes(filters.query.name!.toLowerCase())
      );
    }

    apis.sort((a, b) => {
      if (filters.order.by === "name") {
        return filters.order.order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      if (filters.order.by === "team") {
        return filters.order.order === "asc"
          ? a.team.localeCompare(b.team)
          : b.team.localeCompare(a.team);
      }

      return 0;
    });

    return apis;
  }

  async findById(id: string): Promise<API | null> {
    await this.initialize();
    return this.apis[id] || null;
  }

  async create(apiData: CreateAPIDTO): Promise<API> {
    await this.initialize();

    const id = uuidv4();
    const now = new Date();

    const api: API = {
      ...apiData,
      id,
      createdAt: now,
      updatedAt: now,
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
      updatedAt: new Date(),
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
   * If openAPIUrl starts with '/', it's treated as a local path relative to `public`.
   * Example: `/api-specs/petstore.json` -> `public/api-specs/petstore.json`.
   * If it's an external URL, it returns the URL string.
   */
  async getSpecification(id: string): Promise<string | null> {
    await this.initialize();

    const api = this.apis[id];
    if (!api) return null;

    try {
      // Handle local files relative to public directory
      if (api.openAPIUrl.startsWith("/")) {
        // Ensure openAPIUrl correctly points within this.specDirectory, e.g. /api-specs/file.json
        const filePath = path.join(process.cwd(), "public", api.openAPIUrl);
        return await fs.readFile(filePath, "utf-8");
      }

      // Handle external URLs by returning the URL directly
      // The service/frontend will handle fetching from this URL
      if (
        api.openAPIUrl.startsWith("http://") ||
        api.openAPIUrl.startsWith("https://")
      ) {
        return api.openAPIUrl;
      }

      // If it's not an absolute path or a URL, assume it's a file name within the public directory
      const fallbackFilePath = path.join(
        process.cwd(),
        "public",
        api.openAPIUrl
      );
      return await fs.readFile(fallbackFilePath, "utf-8");
    } catch (error) {
      console.error(
        `Error reading API specification for ${id} (URL: ${api.openAPIUrl}):`,
        error
      );
      return null;
    }
  }
}
