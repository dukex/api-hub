import { notFound } from "next/navigation";
import { apiServiceInstance } from "@/lib/api-repository";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";
import APIViewWrapper from "@/components/apis/APIViewWrapper";
import Script from "next/script";

type ApiDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ApiDetailPage({ params }: ApiDetailPageProps) {
  const { id } = await params;
  const api = await apiServiceInstance.getApiById(id);

  if (!api) {
    notFound();
  }

  const spec = await apiServiceInstance.getApiSpecification(id);

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://unpkg.com/@stoplight/elements/styles.min.css"
      ></link>
      <Script src="https://unpkg.com/@stoplight/elements/web-components.min.js" />

      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/apis"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline "
        >
          <Home className="h-4 w-4" />
          APIs
        </Link>

        <ArrowRight className="h-4 w-4" />

        <Link
          href={`/apis/${id}`}
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline "
        >
          {api.name}
        </Link>
        <ArrowRight className="h-4 w-4" />
        <p className="inline-flex items-center gap-2 text-sm  ">
          API Specification
        </p>
      </div>

      <div className="border rounded-md overflow-hidden shadow-inner ">
        <APIViewWrapper spec={spec} />
      </div>
    </div>
  );
}

export const revalidate = 0;
