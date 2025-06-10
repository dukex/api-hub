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

  const apiByTeam = apis.reduce((acc, api) => {
    if (!acc[api.team]) {
      acc[api.team] = [];
    }
    acc[api.team].push(api);
    return acc;
  }, {} as Record<string, API[]>);

  return (
    <div className="p-4">
      {Object.entries(apiByTeam).map(([team, apis], i) => (
        <div
          key={team}
          className={` ${i == 0 ? "" : "mt-8 pt-8 border-t border-gray-200"}`}
        >
          <h2 className="text-2xl font-bold mb-4">{team}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apis.map((api) => (
              <ApiCard key={api.id} api={api} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
