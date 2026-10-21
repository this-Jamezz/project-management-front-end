const skeletonColumns = Array.from({ length: 4 });
const skeletonCards = Array.from({ length: 3 });

/**
 * Mirrors the real board: header, stat strip, progress bar, then four columns.
 * The earlier version rendered two project sections while the board only ever
 * rendered one, which made the loading state look wrong. It also skipped the
 * header and stat strip, so the layout visibly jumped when data arrived.
 *
 * Column breakpoints match DroppableColumn: snap carousel, 2-up, then 4-up.
 */
export default function KanbanSkeleton() {
  return (
    <div className="flex min-h-[calc(100dvh-7rem)] flex-col gap-5 pb-32 md:min-h-0">
      {/* Header */}
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="glass-subtle h-11 w-11 shrink-0 rounded-xl" />
          <div>
            <div className="glass-skeleton h-6 w-44 rounded-lg" />
            <div className="glass-skeleton mt-2 h-4 w-32 rounded" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-subtle h-8 w-20 rounded-full" />
          ))}
        </div>
      </header>

      {/* Progress bar */}
      <div className="glass-subtle h-1.5 w-full overflow-hidden rounded-full">
        <div className="glass-skeleton h-full w-1/3 rounded-full" />
      </div>

      {/* Columns */}
      <div className="flex flex-1 snap-x snap-mandatory gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 md:snap-none md:overflow-visible xl:grid-cols-4">
        {skeletonColumns.map((_, columnIndex) => (
          <section
            key={columnIndex}
            className="glass flex w-[82vw] max-w-[22rem] shrink-0 snap-center flex-col rounded-2xl p-3.5 md:w-auto md:max-w-none"
          >
            <div className="mb-3.5 flex items-center gap-2.5 px-1">
              <div className="glass-skeleton h-2.5 w-2.5 shrink-0 rounded-full" />
              <div className="glass-skeleton h-4 flex-1 rounded" />
              <div className="glass-skeleton h-5 w-7 rounded-full" />
            </div>

            <div className="flex min-h-[calc(100dvh-20rem)] flex-col gap-2.5 md:min-h-80">
              {skeletonCards.map((_, cardIndex) => (
                <div key={cardIndex} className="glass flex gap-2.5 rounded-xl p-3.5">
                  <div className="glass-subtle mt-1 h-4 w-4 shrink-0 rounded" />
                  <div className="flex-1">
                    <div className="glass-skeleton h-4 w-3/4 rounded" />
                    <div className="glass-skeleton mt-2 h-3 w-full rounded" />
                    <div className="mt-2.5 flex gap-2">
                      <div className="glass-skeleton h-4 w-16 rounded-full" />
                      <div className="glass-skeleton h-4 w-20 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
