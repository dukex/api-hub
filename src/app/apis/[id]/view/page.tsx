import { notFound } from "next/navigation";
import { apiServiceInstance } from "@/lib/api-repository";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import APIViewWrapper from "@/components/apis/APIViewWrapper";
import Head from "next/head";
import Script from "next/script";

type ApiDetailPageProps = {
  params: Promise<{ id: string }>;
};

async function fetchSummaryAction(apiId: string): Promise<string | null> {
  "use server";
  return apiServiceInstance.summarizeApiSpecification(apiId);
}

export default async function ApiDetailPage({ params }: ApiDetailPageProps) {
  const { id } = await params;
  const api = await apiServiceInstance.getApiById(id);

  if (!api) {
    notFound();
  }

  const spec = await apiServiceInstance.getApiSpecification(id);

  // Fetch initial summary on server if desired, or let client component fetch.
  // const initialSummary = await apiServiceInstance.summarizeApiSpecification(id);

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://unpkg.com/@stoplight/elements/styles.min.css"
      ></link>
      <Script src="https://unpkg.com/@stoplight/elements/web-components.min.js" />
      <Link
        href="/apis"
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline "
      >
        <ArrowLeft className="h-4 w-4" />
        Back to API List
      </Link>

      <div className="border rounded-md overflow-hidden shadow-inner ">
        <APIViewWrapper spec={spec} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  // This is optional for dynamic pages but good for build-time generation if APIs are mostly static
  // For a file-based repo, this is feasible.
  const apis = await apiServiceInstance.getAllApis();
  return apis.map((api) => ({
    id: api.id,
  }));
}
// Revalidate data at most every hour or on demand if using tags
export const revalidate = 3600;
