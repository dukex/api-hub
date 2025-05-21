'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, XCircle } from 'lucide-react';

export default function ApiSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [nameQuery, setNameQuery] = useState(searchParams.get('name') || '');
  const [teamQuery, setTeamQuery] = useState(searchParams.get('team') || '');

  useEffect(() => {
    setNameQuery(searchParams.get('name') || '');
    setTeamQuery(searchParams.get('team') || '');
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (nameQuery) params.set('name', nameQuery);
    if (teamQuery) params.set('team', teamQuery);
    router.push(`/apis?${params.toString()}`);
  };

  const clearFilters = () => {
    setNameQuery('');
    setTeamQuery('');
    router.push('/apis');
  };
  
  const hasActiveFilters = nameQuery || teamQuery;

  return (
    <form onSubmit={handleSearch} className="mb-6 p-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label htmlFor="name-search" className="block text-sm font-medium text-foreground mb-1">
            API Name
          </label>
          <Input
            id="name-search"
            type="text"
            placeholder="Search by API name..."
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="team-search" className="block text-sm font-medium text-foreground mb-1">
            Team
          </label>
          <Input
            id="team-search"
            type="text"
            placeholder="Search by team..."
            value={teamQuery}
            onChange={(e) => setTeamQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
          {hasActiveFilters && (
            <Button type="button" variant="outline" onClick={clearFilters} className="w-full md:w-auto">
              <XCircle className="mr-2 h-4 w-4" /> Clear
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}
