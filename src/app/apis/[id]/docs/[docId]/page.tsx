import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { apiServiceInstance } from "@/lib/api-repository";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Github, Home } from "lucide-react";
import Link from "next/link";

interface DocumentationPageProps {
  params: Promise<{
    id: string;
    docId: string;
  }>;
}

export default async function DocumentationPage({
  params,
}: DocumentationPageProps) {
  const { id, docId } = await params;

  try {
    const result = await apiServiceInstance.getApiDocumentation(id, docId);

    if (!result) {
      notFound();
    }

    const { documentation, content } = result;
    const api = await apiServiceInstance.getApiById(id);

    if (!api) {
      notFound();
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

          <Link
            href={`/apis/${api.id}`}
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline "
          >
            {api.name}
          </Link>

          <ArrowRight className="h-4 w-4" />

          <p className="inline-flex items-center gap-2 text-sm  ">
            {documentation.name}
          </p>

          <Badge variant="secondary" className="flex items-center gap-1">
            {documentation.provider === "github" && (
              <Github className="w-3 h-3" />
            )}
            {documentation.provider}
          </Badge>
        </div>
        <div className="prose  prose-slate max-w-none dark:prose-invert">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              code: ({ node, inline, className, children, ...props }) => {
                const match = /language-(\w+)/.exec(className || "");
                return !inline ? (
                  <code className={className} {...props}>
                    {children}
                  </code>
                ) : (
                  <code
                    className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              a: ({ href, children, ...props }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                  {...props}
                >
                  {children}
                </a>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
        <p className="text-sm text-muted-foreground mt-8 pt-8 font-mono border-t">
          Source:{" "}
          <a
            href={documentation.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {documentation.url}
          </a>
        </p>
      </div>
    );
  } catch (error) {
    console.error("Error loading documentation:", error);
    notFound();
  }
}

export async function generateMetadata({ params }: DocumentationPageProps) {
  const { id, docId } = await params;

  try {
    const result = await apiServiceInstance.getApiDocumentation(id, docId);
    const api = await apiServiceInstance.getApiById(id);

    if (!result || !api) {
      return {
        title: "Documentation Not Found",
      };
    }

    return {
      title: `${result.documentation.name} - ${api.name} Documentation`,
      description:
        result.documentation.description || `Documentation for ${api.name}`,
    };
  } catch (error) {
    return {
      title: "Documentation Not Found",
    };
  }
}
