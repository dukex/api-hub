/**
 * Represents an API within the repository
 */
export interface API {
  /** Unique identifier for the API */
  id: string;

  /** Human-readable name of the API */
  name: string;

  /** Team responsible for the API */
  team: string;

  /** URL pointing to OpenAPI specification (can be local file path relative to public/ or external URL) */
  documentationUrl: string;

  /** Optional description of the API */
  description?: string;

  /** Creation timestamp */
  createdAt?: Date;

  /** Last updated timestamp */
  updatedAt?: Date;
}

/**
 * Represents a new API being added to the repository
 * Omits system-generated fields
 */
export type CreateAPIDTO = Omit<API, "id" | "createdAt" | "updatedAt">;

/**
 * Represents fields that can be updated for an existing API
 */
export type UpdateAPIDTO = Partial<Omit<API, "id" | "createdAt" | "updatedAt">>;
