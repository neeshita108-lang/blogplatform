export const SkeletonCard = () => (
  <div className="bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-pulse">
    <div className="aspect-[16/10] bg-slate-200 dark:bg-slate-800" />
    <div className="p-6">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-4" />
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2" />
      <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-2/3 mb-4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-6" />
      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24" />
        </div>
      </div>
    </div>
  </div>
);

export const SkeletonDetail = () => (
  <div className="animate-pulse">
    <div className="w-full h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl mb-8" />
    <div className="max-w-3xl mx-auto">
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-24 mb-4" />
      <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded w-full mb-4" />
      <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-8" />
      <div className="flex items-center space-x-4 mb-12">
        <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-32 mb-2" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-20" />
        </div>
      </div>
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
        ))}
      </div>
    </div>
  </div>
);
