import type { API, CreateAPIDTO, UpdateAPIDTO } from './entity';

/**
 * Repository interface for API entities
 * This defines the contract that any API repository implementation must fulfill
 */
export interface APIRepository {
  /**
   * Retrieves all APIs from the repository
   * @returns Promise resolving to an array of API entities
   */
  findAll(filters?: { name?: string; team?: string }): Promise<API[]>;
  
  /**
   * Retrieves a specific API by ID
   * @param id - The unique identifier of the API
   * @returns Promise resolving to the API entity or null if not found
   */
  findById(id: string): Promise<API | null>;
  
  /**
   * Retrieves APIs filtered by team
   * @param team - The team name to filter by
   * @returns Promise resolving to an array of API entities
   */
  findByTeam(team: string): Promise<API[]>;
  
  /**
   * Creates a new API in the repository
   * @param api - The API data to create
   * @returns Promise resolving to the created API entity
   */
  create(api: CreateAPIDTO): Promise<API>;
  
  /**
   * Updates an existing API in the repository
   * @param id - The unique identifier of the API to update
   * @param data - The data to update
   * @returns Promise resolving to the updated API entity or null if not found
   */
  update(id: string, data: UpdateAPIDTO): Promise<API | null>;
  
  /**
   * Deletes an API from the repository
   * @param id - The unique identifier of the API to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;
  
  /**
   * Retrieves the API specification document.
   * If documentationUrl is a local path (e.g., /api-specs/my-api.json), it reads the file content from public directory.
   * If documentationUrl is an external URL, it returns the URL string.
   * @param id - The unique identifier of the API
   * @returns Promise resolving to the API specification content (string) or URL (string), or null if not found or error.
   */
  getSpecification(id: string): Promise<string | null>;
}
