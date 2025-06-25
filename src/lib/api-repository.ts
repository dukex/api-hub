import { FileAPIDataRepository } from "@/adapters/file_repositories/api/repository";
import { GitHubDocumentationRepository } from "@/adapters/github_repositories/documentation/repository";
import { ApiService } from "@/domain/api/service";
import { DocumentationService } from "@/domain/documentation/service";

const apiDataRepositoryInstance = new FileAPIDataRepository();

// Initialize documentation service only if GitHub token is available
let documentationServiceInstance: DocumentationService | undefined;
try {
  const githubDocumentationRepository = new GitHubDocumentationRepository();
  documentationServiceInstance = new DocumentationService(githubDocumentationRepository);
} catch (error) {
  console.warn("GitHub documentation service not available:", error instanceof Error ? error.message : "Unknown error");
}

const apiServiceInstance = new ApiService(apiDataRepositoryInstance, documentationServiceInstance);

export { apiDataRepositoryInstance, apiServiceInstance, documentationServiceInstance };
