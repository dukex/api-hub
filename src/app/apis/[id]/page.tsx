import { notFound } from 'next/navigation';
import { apiServiceInstance } from '@/lib/api-repository';
import SwaggerUIWrapper from '@/components/apis/SwaggerUIWrapper';
import ApiSummary from '@/components/apis/ApiSummary';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, FileText, Info, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type ApiDetailPageProps = {
  params: { id: string };
};

// Server action to be passed to ApiSummary client component
async function fetchSummaryAction(apiId: string): Promise<string | null> {
  "use server";
  return apiServiceInstance.summarizeApiSpecification(apiId);
}

export default async function ApiDetailPage({ params }: ApiDetailPageProps) {
  const { id } = params;
  const api = await apiServiceInstance.getApiById(id);

  if (!api) {
    notFound();
  }
  
  // Get the spec content or URL for SwaggerUI
  // SwaggerUIWrapper can handle both URL and direct spec object.
  // For local files, documentationUrl is like /api-specs/file.json which SwaggerUI can fetch.
  // For remote files, documentationUrl is the full URL.
  // If getApiSpecification always returned content, we'd pass `spec={specContent}`.
  // But since it can return a URL, we'll rely on SwaggerUI's `url` prop.
  const specUrlOrContent = await apiServiceInstance.getRawApiSpecificationLink(id);
  let swaggerSpecProp: object | undefined;
  let swaggerUrlProp: string | undefined;

  if (specUrlOrContent) {
    if (specUrlOrContent.startsWith('http://') || specUrlOrContent.startsWith('https://') || specUrlOrContent.startsWith('/')) {
      swaggerUrlProp = specUrlOrContent;
    } else {
      // This case implies specUrlOrContent is the actual JSON/YAML string.
      // We attempt to parse it. If it's not valid JSON, SwaggerUI might handle it as YAML or fail.
      try {
        swaggerSpecProp = JSON.parse(specUrlOrContent);
      } catch (e) {
        // If not JSON, pass as is; SwaggerUI might try to parse as YAML.
        // Or, more robustly, pass the original documentationUrl to SwaggerUI.
        // For simplicity, if it's not a URL, we assume it's content.
        // However, current FileAPIRepository returns URL for remote, content for local.
        // And getRawApiSpecificationLink returns the original documentationUrl.
        // So swaggerUrlProp should generally be correct.
        // If documentationUrl could be a string of spec, then this logic is okay.
        // Let's assume `documentationUrl` is always a fetchable path or URL.
        swaggerUrlProp = api.documentationUrl; // Fallback to the raw URL if parsing logic complex
      }
    }
  }
  
  // Fetch initial summary on server if desired, or let client component fetch.
  // const initialSummary = await apiServiceInstance.summarizeApiSpecification(id);

  return (
    <div className="space-y-8">
      <Link href="/apis" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4">
        <ArrowLeft className="h-4 w-4" />
        Back to API List
      </Link>

      <header className="pb-4 border-b border-border">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">{api.name}</h1>
        <p className="text-lg text-muted-foreground mt-1 flex items-center gap-2">
          <Users className="h-5 w-5" /> Maintained by: {api.team}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
              {swaggerUrlProp ? (
                <SwaggerUIWrapper specUrl={swaggerUrlProp} />
              ) : swaggerSpecProp ? (
                 <SwaggerUIWrapper spec={swaggerSpecProp} />
              ) : (
                <p className="text-destructive">API specification could not be loaded.</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
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
                <h3 className="font-semibold text-foreground">Documentation URL</h3>
                {api.documentationUrl.startsWith('http') ? (
                     <a href={api.documentationUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                        {api.documentationUrl}
                     </a>
                ) : (
                    <p className="text-muted-foreground break-all">{api.documentationUrl} (Local)</p>
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
