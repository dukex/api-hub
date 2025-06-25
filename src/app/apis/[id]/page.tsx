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
import {
  Users,
  FileText,
  Info,
  CalendarDays,
  Home,
  ArrowRight,
  BookOpen,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { load } from "js-yaml";

type ApiDetailPageProps = {
  params: Promise<{ id: string }>;
};

async function fetchSummaryAction(apiId: string): Promise<string | null> {
  "use server";

  return apiServiceInstance.summarizeApiSpecification(apiId);
}

async function fetchApiDetails(apiId: string) {
  "use server";

  return await apiServiceInstance.getApiById(apiId);
}

export default async function ApiDetailPage({ params }: ApiDetailPageProps) {
  const { id } = await params;
  const api = await fetchApiDetails(id);

  if (!api) {
    notFound();
  }

  const specContent = await apiServiceInstance.getApiSpecification(id);

  const spec: {
    title?: string | undefined;
    version?: string | undefined;
    description?: string | undefined;
    contactName?: string | undefined;
    contactEmail?: string | undefined;
    contactUrl?: string | undefined;
    tags?: Array<{ name: string; description?: string }> | undefined;
  } = {};

  if (specContent) {
    try {
      const parsedSpec: any = load(specContent as string);

      spec.title = parsedSpec?.info?.title;
      spec.version = parsedSpec?.info?.version;
      spec.description = parsedSpec?.info?.description;
      spec.contactName = parsedSpec?.info?.contact?.name;
      spec.contactEmail = parsedSpec?.info?.contact?.email;
      spec.contactUrl = parsedSpec?.info?.contact?.url;
      spec.tags = parsedSpec?.tags;
    } catch (error) {
      console.error("Failed to parse OpenAPI specification:", error);
    }
  } else {
    console.log("Spec content is empty, skipping parsing.");
  }

  return (
    <div className="">
      <div className="flex items-center gap-2 mb-4">
        <Link
          href="/apis"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline "
        >
          <Home className="h-4 w-4" />
          APIs
        </Link>

        <ArrowRight className="h-4 w-4" />

        <p className="inline-flex items-center gap-2 text-sm  ">{api.name}</p>
      </div>
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
              {spec.title && (
                <div>
                  <h3 className="font-semibold text-foreground">Title</h3>
                  <p className="text-muted-foreground">{spec.title}</p>
                </div>
              )}
              {(api.description || spec.description) && (
                <div>
                  <h3 className="font-semibold text-foreground">Description</h3>
                  <p className="text-muted-foreground">
                    {spec.description || api.description}
                  </p>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-foreground">
                  Documentation URL
                </h3>
                {api.openAPIUrl.startsWith("http") ? (
                  <a
                    href={api.openAPIUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline break-all"
                  >
                    {api.openAPIUrl}
                  </a>
                ) : (
                  <p className="text-muted-foreground break-all">
                    {api.openAPIUrl} (Local)
                  </p>
                )}
              </div>
              {(spec.contactName || spec.contactEmail || spec.contactUrl) && (
                <div>
                  <h3 className="font-semibold text-foreground mt-2">
                    Contact
                  </h3>
                  {spec.contactName && (
                    <p className="text-muted-foreground">
                      <strong>Name:</strong> {spec.contactName}
                    </p>
                  )}
                  {spec.contactEmail && (
                    <p className="text-muted-foreground">
                      <strong>Email:</strong>{" "}
                      <a
                        href={`mailto:${spec.contactEmail}`}
                        className="text-accent hover:underline"
                      >
                        {spec.contactEmail}
                      </a>
                    </p>
                  )}
                  {spec.contactUrl && (
                    <p className="text-muted-foreground">
                      <strong>URL:</strong>{" "}
                      <a
                        href={spec.contactUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline break-all"
                      >
                        {spec.contactUrl}
                      </a>
                    </p>
                  )}
                </div>
              )}
              {spec.tags && spec.tags.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mt-2">Tags</h3>

                  {spec.tags.map(
                    (tag) =>
                      tag.description && (
                        <div key={`${tag.name}-desc`} className="mt-2">
                          <p className="text-muted-foreground">
                            <Badge variant="secondary">{tag.name}</Badge>:{" "}
                            {tag.description}
                          </p>
                        </div>
                      )
                  )}
                </div>
              )}

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

          {api.docs && api.docs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-primary" />
                  Documentation
                </CardTitle>
                <CardDescription>
                  Additional documentation resources for this API.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {api.docs.map((doc) => {
                    const docId = apiServiceInstance.generateDocumentationId(
                      doc.name
                    );
                    return (
                      <div
                        key={docId}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm">{doc.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {doc.provider}
                            </Badge>
                          </div>
                          {doc.description && (
                            <p className="text-xs text-muted-foreground truncate">
                              {doc.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Link href={`/apis/${id}/docs/${docId}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export const revalidate = 3600;
