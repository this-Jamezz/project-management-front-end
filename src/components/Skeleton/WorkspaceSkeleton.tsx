export default function WorkspaceSkeleton() {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      {/* Workspace icon */}
      <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />

      {/* Workspace + project */}
      <div className="flex flex-col gap-1">
        <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
      </div>

      {/* Chevron */}
      <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
    </div>
  );
}
