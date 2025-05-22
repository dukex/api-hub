import { apiServiceInstance } from "@/lib/api-repository";
import ApiList from "@/components/apis/ApiList";
import ApiSearch from "@/components/apis/ApiSearch";
import { Suspense } from "react";
import { Home } from "lucide-react";

type ApiListPageProps = {
  searchParams?: Promise<{
    name?: string;
  }>;
};

async function fetchApis(name?: string) {
  "use server";
  return apiServiceInstance.getAllApis({ name });
}

export default async function ApiListPage({ searchParams }: ApiListPageProps) {
  const name = (await searchParams)?.name;
  const apis = await fetchApis(name);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <p className="inline-flex items-center gap-2 text-sm  ">
          <Home className="h-4 w-4" />
          APIs
        </p>
      </div>
      <header className="flex justify-between items-center mb-6 p-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            API Repository
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover and explore available APIs.
          </p>
        </div>
        <Suspense
          fallback={
            <div className="text-muted-foreground">Loading search...</div>
          }
        >
          <ApiSearch />
        </Suspense>
      </header>

      <Suspense
        fallback={<div className="text-muted-foreground">Loading APIs...</div>}
      >
        <ApiList apis={apis} />
      </Suspense>
    </div>
  );
}

export const dynamic = "force-dynamic"; // Ensure searchParams are fresh
