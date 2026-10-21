export default function WorkspaceSkeleton() {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      {/* Workspace icon */}
      <div className="glass-subtle h-6 w-6 rounded-md" />

      {/* Workspace + project */}
      <div className="flex flex-col gap-1">
        <div className="glass-skeleton h-3 w-24 rounded" />
        <div className="glass-skeleton h-4 w-32 rounded" />
      </div>
    </div>
  );
}
