import type { APIDocumentation } from "../api/entity";

export interface DocumentationRepository {
  /**
   * Fetches documentation content from the specified URL
   * @param documentation - The documentation metadata containing URL and provider info
   * @returns Promise<string | null> - The markdown content or null if failed
   */
  fetchDocumentationContent(documentation: APIDocumentation): Promise<string | null>;
  
  /**
   * Validates if the documentation URL is accessible
   * @param documentation - The documentation metadata
   * @returns Promise<boolean> - Whether the documentation is accessible
   */
  validateDocumentationAccess(documentation: APIDocumentation): Promise<boolean>;
}