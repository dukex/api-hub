import { Octokit } from "@octokit/rest";
import type { DocumentationRepository } from "@/domain/documentation/repository";
import type { APIDocumentation } from "@/domain/api/entity";

export class GitHubDocumentationRepository implements DocumentationRepository {
  private octokit: Octokit;

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    // if (!token) {
    //   throw new Error("GITHUB_TOKEN environment variable is required");
    // }

    this.octokit = new Octokit({
      auth: token,
    });
  }

  /**
   * Parses a GitHub URL to extract owner, repo, and path information
   * Supports formats:
   * - https://github.com/owner/repo/blob/branch/path/to/file.md
   */
  private parseGitHubUrl(
    url: string
  ): { owner: string; repo: string; path: string; ref?: string } | null {
    try {
      const urlObj = new URL(url);

      if (urlObj.hostname === "github.com") {
        // Format: https://github.com/owner/repo/blob/branch/path/to/file.md
        const pathParts = urlObj.pathname.split("/").filter(Boolean);
        if (pathParts.length < 5 || pathParts[2] !== "blob") {
          return null;
        }

        const owner = pathParts[0];
        const repo = pathParts[1];
        const ref = pathParts[3];
        const path = pathParts.slice(4).join("/");

        return { owner, repo, path, ref };
      }

      return null;
    } catch (error) {
      console.error("Error parsing GitHub URL:", error);
      return null;
    }
  }

  async fetchDocumentationContent(
    documentation: APIDocumentation
  ): Promise<string | null> {
    if (documentation.provider !== "github") {
      throw new Error(`Unsupported provider: ${documentation.provider}`);
    }

    const parsedUrl = this.parseGitHubUrl(documentation.url);
    if (!parsedUrl) {
      console.error(`Invalid GitHub URL format: ${documentation.url}`);
      return null;
    }

    try {
      const response = await this.octokit.repos.getContent({
        owner: parsedUrl.owner,
        repo: parsedUrl.repo,
        path: parsedUrl.path,
        ref: parsedUrl.ref,
      });

      // Handle the case where the response is an array (directory) or a single file
      if (Array.isArray(response.data)) {
        console.error(
          `Path points to a directory, not a file: ${documentation.url}`
        );
        return null;
      }

      // Ensure it's a file with content
      if (response.data.type !== "file" || !response.data.content) {
        console.error(`Invalid file or no content found: ${documentation.url}`);
        return null;
      }

      // Decode base64 content
      const content = Buffer.from(response.data.content, "base64").toString(
        "utf-8"
      );
      return content;
    } catch (error) {
      console.error(
        `Error fetching documentation from GitHub: ${documentation.url}`,
        error
      );
      return null;
    }
  }

  async validateDocumentationAccess(
    documentation: APIDocumentation
  ): Promise<boolean> {
    if (documentation.provider !== "github") {
      return false;
    }

    const parsedUrl = this.parseGitHubUrl(documentation.url);
    if (!parsedUrl) {
      return false;
    }

    try {
      const response = await this.octokit.repos.getContent({
        owner: parsedUrl.owner,
        repo: parsedUrl.repo,
        path: parsedUrl.path,
        ref: parsedUrl.ref,
      });

      return !Array.isArray(response.data) && response.data.type === "file";
    } catch (error) {
      console.error(
        `Error validating documentation access: ${documentation.url}`,
        error
      );
      return false;
    }
  }
}
