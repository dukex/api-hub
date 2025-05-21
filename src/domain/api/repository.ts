import type { API, CreateAPIDTO, UpdateAPIDTO } from "./entity";

export interface APIRepository {
  findAll(filters?: { name?: string }): Promise<API[]>;

  findById(id: string): Promise<API | null>;

  create(api: CreateAPIDTO): Promise<API>;

  update(id: string, data: UpdateAPIDTO): Promise<API | null>;

  delete(id: string): Promise<boolean>;

  getSpecification(id: string): Promise<string | null>;
}
