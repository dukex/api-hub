"use client";

export default function APIViewWrapper({ spec }: { spec: string | null }) {
  return <elements-api apiDescriptionDocument={spec} router="hash" />;
}
