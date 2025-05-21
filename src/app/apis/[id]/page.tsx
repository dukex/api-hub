import { notFound } from "next/navigation";
import { apiServiceInstance } from "@/lib/api-repository";
import ApiSummary from "@/components/apis/ApiSummary";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, FileText, Info, CalendarDays } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="">
      <Link
        href="/apis"
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline "
      >
        <ArrowLeft className="h-4 w-4" />
        Back to API List
      </Link>

      <header className="pb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {api.name}
        </h1>
        <p className="text-lg text-muted-foreground mt-1 flex items-center gap-2">
          <Users className="h-5 w-5" /> Maintained by: {api.team}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-6 w-6 text-primary" />
                API Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {api.description && (
                <div>
                  <h3 className="font-semibold text-foreground">Description</h3>
                  <p className="text-muted-foreground">{api.description}</p>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-foreground">
                  Documentation URL
                </h3>
                {api.documentationUrl.startsWith("http") ? (
                  <a
                    href={api.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline break-all"
                  >
                    {api.documentationUrl}
                  </a>
                ) : (
                  <p className="text-muted-foreground break-all">
                    {api.documentationUrl} (Local)
                  </p>
                )}
              </div>
              {api.createdAt && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Created: {new Date(api.createdAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              {api.updatedAt && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Last Updated: {new Date(api.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <ApiSummary
            apiId={id}
            fetchSummaryAction={fetchSummaryAction}
            // initialSummary={initialSummary} // Pass if pre-fetched
          />
        </div>
        <div className=" space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                API Specification
              </CardTitle>
              <CardDescription>
                Interactive documentation powered by Swagger UI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link className="mt-2 w-full" href={`/apis/${id}/view`}>
                <Button>View API Specification</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const apis = await apiServiceInstance.getAllApis();
  return apis.map((api) => ({
    id: api.id,
  }));
}

export const revalidate = 3600;
