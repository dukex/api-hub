import type { APIRepository } from "./repository";
import type { API, CreateAPIDTO, UpdateAPIDTO } from "./entity";
import { summarizeApi as genAISummarizeApi } from "@/ai/flows/summarize-api";

export class ApiService {
  constructor(private apiRepository: APIRepository) {}

  async getAllApis(filters: {
    query: { name?: string };
    order: { by: string; order: "asc" | "desc" };
  }): Promise<API[]> {
    return this.apiRepository.findAll(filters);
  }

  async getApiById(id: string): Promise<API | null> {
    return this.apiRepository.findById(id);
  }

  async createApi(apiData: CreateAPIDTO): Promise<API> {
    // Additional business logic before creation can go here
    return this.apiRepository.create(apiData);
  }

  async updateApi(id: string, apiData: UpdateAPIDTO): Promise<API | null> {
    // Additional business logic before update can go here
    return this.apiRepository.update(id, apiData);
  }

  async deleteApi(id: string): Promise<boolean> {
    // Additional business logic before deletion can go here
    return this.apiRepository.delete(id);
  }

  async getApiSpecification(id: string): Promise<string | null> {
    const specOrUrl = await this.apiRepository.getSpecification(id);
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
    const api = await this.apiRepository.findById(id);
    if (!api) return null;
    return api.documentationUrl;
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
}
