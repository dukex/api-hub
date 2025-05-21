import type { API } from "@/domain/api/entity";
import ApiCard from "./ApiCard";

type ApiListProps = {
  apis: API[];
};

export default function ApiList({ apis }: ApiListProps) {
  if (apis.length === 0) {
    return (
      <p className="text-center text-muted-foreground mt-8 text-lg">
        No APIs found matching your criteria.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apis.map((api) => (
        <ApiCard key={api.id} api={api} />
      ))}
    </div>
  );
}
