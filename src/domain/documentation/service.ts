import type { DocumentationRepository } from "./repository";
import type { APIDocumentation } from "../api/entity";

export class DocumentationService {
  constructor(private documentationRepository: DocumentationRepository) {}

  async getDocumentationContent(documentation: APIDocumentation): Promise<string | null> {
    return this.documentationRepository.fetchDocumentationContent(documentation);
  }

  async validateDocumentation(documentation: APIDocumentation): Promise<boolean> {
    return this.documentationRepository.validateDocumentationAccess(documentation);
  }

  /**
   * Generates a document ID from the documentation name
   * Converts name to URL-safe format
   */
  generateDocumentId(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /**
   * Finds documentation by ID within an API's docs array
   */
  findDocumentationById(docs: APIDocumentation[] | undefined, docId: string): APIDocumentation | null {
    if (!docs) return null;
    
    return docs.find(doc => this.generateDocumentId(doc.name) === docId) || null;
  }
}