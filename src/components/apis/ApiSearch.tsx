"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, XCircle } from "lucide-react";

export default function ApiSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [nameQuery, setNameQuery] = useState(searchParams.get("name") || "");

  useEffect(() => {
    setNameQuery(searchParams.get("name") || "");
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (nameQuery) params.set("name", nameQuery);
    router.push(`/apis?${params.toString()}`);
  };

  const clearFilters = () => {
    setNameQuery("");
    router.push("/apis");
  };

  const hasActiveFilters = nameQuery;

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-end gap-2 flex-col lg:flex-row"
    >
      <div>
        <Input
          id="name-search"
          type="text"
          placeholder="Search by API name..."
          value={nameQuery}
          onChange={(e) => setNameQuery(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex gap-2">
        <Button
          type="submit"
          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={clearFilters}
            className="w-full md:w-auto"
          >
            <XCircle className="mr-2 h-4 w-4" /> Clear
          </Button>
        )}
      </div>
    </form>
  );
}
