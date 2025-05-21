import { FileAPIRepository } from "@/adapters/file_repositories/api/repository";
import { ApiService } from "@/domain/api/service";

const apiRepositoryInstance = new FileAPIRepository();
const apiServiceInstance = new ApiService(apiRepositoryInstance);

export { apiRepositoryInstance, apiServiceInstance };
