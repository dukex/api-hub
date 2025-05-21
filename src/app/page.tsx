'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/apis');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-4">
      <p className="text-lg text-muted-foreground">Redirecting to API listing...</p>
      {/* You can add a spinner or a loading message here */}
    </div>
  );
}
