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
import { Users, FileText, Info, CalendarDays, BookMarked } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

export default async function ApiDetailPage({ params }: ApiDetailPageProps) {
  const { id } = await params;
  const api = await apiServiceInstance.getApiById(id);

  if (!api) {
    notFound();
  }

  const specContent = await apiServiceInstance.getApiSpecification(id);
  console.log("Fetched OpenAPI Spec:", specContent);

  let parsedSpec: any = null;
  let specTitle: string | undefined;
  let specVersion: string | undefined;
  let specDescription: string | undefined;
  let contactName: string | undefined;
  let contactEmail: string | undefined;
  let contactUrl: string | undefined;
  let specTags: Array<{ name: string; description?: string }> | undefined;

  if (specContent) {
    try {
      parsedSpec = load(specContent as string);
      console.log("Parsed OpenAPI Spec:", parsedSpec);

      // Extract specific details
      specTitle = parsedSpec?.info?.title;
      specVersion = parsedSpec?.info?.version;
      specDescription = parsedSpec?.info?.description;
      contactName = parsedSpec?.info?.contact?.name;
      contactEmail = parsedSpec?.info?.contact?.email;
      contactUrl = parsedSpec?.info?.contact?.url;
      specTags = parsedSpec?.tags;

      // Log extracted details
      console.log("Spec Title:", specTitle);
      console.log("Spec Version:", specVersion);
      console.log("Spec Description:", specDescription);
      console.log("Contact Name:", contactName);
      console.log("Contact Email:", contactEmail);
      console.log("Contact URL:", contactUrl);
      console.log("Tags:", specTags);
    } catch (error) {
      console.error("Failed to parse OpenAPI specification:", error);
      // Variables remain undefined
    }
  } else {
    console.log("Spec content is empty, skipping parsing.");
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

          {parsedSpec && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookMarked className="h-6 w-6 text-primary" />
                  OpenAPI Specification Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {specTitle && (
                  <div>
                    <h3 className="font-semibold text-foreground">Title</h3>
                    <p className="text-muted-foreground">{specTitle}</p>
                  </div>
                )}
                {specVersion && (
                  <div>
                    <h3 className="font-semibold text-foreground">Version</h3>
                    <p className="text-muted-foreground">{specVersion}</p>
                  </div>
                )}
                {specDescription && (
                  <div>
                    <h3 className="font-semibold text-foreground">
                      Description
                    </h3>
                    <p className="text-muted-foreground">{specDescription}</p>
                  </div>
                )}

                {(contactName || contactEmail || contactUrl) && (
                  <div>
                    <h3 className="font-semibold text-foreground mt-2">
                      Contact
                    </h3>
                    {contactName && (
                      <p className="text-muted-foreground">
                        <strong>Name:</strong> {contactName}
                      </p>
                    )}
                    {contactEmail && (
                      <p className="text-muted-foreground">
                        <strong>Email:</strong>{" "}
                        <a
                          href={`mailto:${contactEmail}`}
                          className="text-accent hover:underline"
                        >
                          {contactEmail}
                        </a>
                      </p>
                    )}
                    {contactUrl && (
                      <p className="text-muted-foreground">
                        <strong>URL:</strong>{" "}
                        <a
                          href={contactUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:underline break-all"
                        >
                          {contactUrl}
                        </a>
                      </p>
                    )}
                  </div>
                )}

                {specTags && specTags.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-foreground mt-2">Tags</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {specTags.map((tag) => (
                        <Badge key={tag.name} variant="outline">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                    {specTags.map(
                      (tag) =>
                        tag.description && (
                          <div key={`${tag.name}-desc`} className="mt-1">
                            <p className="text-muted-foreground">
                              <Badge variant="secondary">{tag.name}</Badge>:{" "}
                              {tag.description}
                            </p>
                          </div>
                        )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
