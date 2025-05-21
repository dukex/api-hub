'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { useEffect, useState } from 'react';

type SwaggerUIWrapperProps = {
  specUrl?: string; // URL to the OpenAPI spec
  spec?: object;    // Direct OpenAPI spec object
};

export default function SwaggerUIWrapper({ specUrl, spec }: SwaggerUIWrapperProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Prevent SwaggerUI from rendering on the server or during initial client render before hydration
    return <div className="p-4 text-muted-foreground">Loading API Documentation...</div>;
  }

  if (!specUrl && !spec) {
    return <div className="p-4 text-destructive">No API specification URL or object provided.</div>;
  }
  
  // Swagger UI sometimes has issues with dark mode styling, so we might need custom CSS overrides later if needed.
  // For now, we use its default styling.
  return (
    <div className="swagger-container bg-white rounded-md shadow-inner p-1">
      <SwaggerUI url={specUrl} spec={spec} />
    </div>
  );
}
