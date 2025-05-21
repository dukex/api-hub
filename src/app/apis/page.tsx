import { apiServiceInstance } from '@/lib/api-repository';
import ApiList from '@/components/apis/ApiList';
import ApiSearch from '@/components/apis/ApiSearch';
import { Suspense } from 'react';

type ApiListPageProps = {
  searchParams?: {
    name?: string;
    team?: string;
  };
};

async function fetchApis(name?: string, team?: string) {
  return apiServiceInstance.getAllApis({ name, team });
}

export default async function ApiListPage({ searchParams }: ApiListPageProps) {
  const name = searchParams?.name;
  const team = searchParams?.team;
  const apis = await fetchApis(name, team);

  return (
    <div className="space-y-6">
      <header className='flex justify-between items-center mb-6 p-4'>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">API Repository</h1>
          <p className="text-muted-foreground mt-1">Discover and explore available APIs.</p>
        </div>
        <Suspense fallback={<div className="text-muted-foreground">Loading search...</div>}>
          <ApiSearch />
        </Suspense>
      </header>
      

      
      <Suspense fallback={<div className="text-muted-foreground">Loading APIs...</div>}>
        <ApiList apis={apis} />
      </Suspense>
    </div>
  );
}

export const dynamic = 'force-dynamic'; // Ensure searchParams are fresh
