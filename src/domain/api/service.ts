import type { APIDataRepository } from "./repository";
import type { API, CreateAPIDTO, UpdateAPIDTO, APIDocumentation } from "./entity";
import { summarizeApi as genAISummarizeApi } from "@/ai/flows/summarize-api";
import type { DocumentationService } from "../documentation/service";

export class ApiService {
  constructor(
    private apiDataRepository: APIDataRepository,
    private documentationService?: DocumentationService
  ) {}

  async getAllApis(filters: {
    query: { name?: string };
    order: { by: string; order: "asc" | "desc" };
  }): Promise<API[]> {
    return this.apiDataRepository.findAll(filters);
  }

  async getApiById(id: string): Promise<API | null> {
    return this.apiDataRepository.findById(id);
  }

  async createApi(apiData: CreateAPIDTO): Promise<API> {
    // Additional business logic before creation can go here
    return this.apiDataRepository.create(apiData);
  }

  async updateApi(id: string, apiData: UpdateAPIDTO): Promise<API | null> {
    // Additional business logic before update can go here
    return this.apiDataRepository.update(id, apiData);
  }

  async deleteApi(id: string): Promise<boolean> {
    // Additional business logic before deletion can go here
    return this.apiDataRepository.delete(id);
  }

  async getApiSpecification(id: string): Promise<string | null> {
    const specOrUrl = await this.apiDataRepository.getSpecification(id);
    if (!specOrUrl) {
      return null;
    }

    // If it's a URL, fetch the content
    if (specOrUrl.startsWith("http://") || specOrUrl.startsWith("https://")) {
      try {
        const response = await fetch(specOrUrl);
        if (!response.ok) {
          console.error(
            `Failed to fetch spec from URL ${specOrUrl}: ${response.statusText}`
          );
          return null;
        }
        return await response.text();
      } catch (error) {
        console.error(`Error fetching spec from URL ${specOrUrl}:`, error);
        return null;
      }
    }
    // Otherwise, it's already the spec content (or was an unhandled local path type)
    return specOrUrl;
  }

  async getRawApiSpecificationLink(id: string): Promise<string | null> {
    // This method is useful if SwaggerUI needs the original URL for remote specs,
    // or the direct path for local specs.
    const api = await this.apiDataRepository.findById(id);
    if (!api) return null;
    return api.openAPIUrl;
  }

  async summarizeApiSpecification(id: string): Promise<string | null> {
    const specContent = await this.getApiSpecification(id);
    if (!specContent) {
      return "Could not retrieve API specification to summarize.";
    }

    try {
      const result = await genAISummarizeApi({ apiSpecification: specContent });
      return result.summary;
    } catch (error) {
      console.error("Error summarizing API:", error);
      return "Failed to generate summary for the API.";
    }
  }

  async getApiDocumentation(apiId: string, docId: string): Promise<{ documentation: APIDocumentation; content: string } | null> {
    if (!this.documentationService) {
      throw new Error("Documentation service not configured");
    }

    const api = await this.getApiById(apiId);
    if (!api || !api.docs) {
      return null;
    }

    const documentation = this.documentationService.findDocumentationById(api.docs, docId);
    if (!documentation) {
      return null;
    }

    const content = await this.documentationService.getDocumentationContent(documentation);
    if (!content) {
      return null;
    }

    return { documentation, content };
  }

  async validateApiDocumentation(apiId: string, docId: string): Promise<boolean> {
    if (!this.documentationService) {
      return false;
    }

    const api = await this.getApiById(apiId);
    if (!api || !api.docs) {
      return false;
    }

    const documentation = this.documentationService.findDocumentationById(api.docs, docId);
    if (!documentation) {
      return false;
    }

    return this.documentationService.validateDocumentation(documentation);
  }

  generateDocumentationId(name: string): string {
    if (!this.documentationService) {
      throw new Error("Documentation service not configured");
    }
    return this.documentationService.generateDocumentId(name);
  }
}
