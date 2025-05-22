export default function Loading() {
  return (
    <div className="flex justify-center items-center h-screen gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
      <p className="text-muted-foreground">Loading APIs...</p>
    </div>
  );
}
