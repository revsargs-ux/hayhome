"use client";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({ icon = "📭", title, description, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="text-5xl mb-4 opacity-50">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm max-w-md mb-6">{description}</p>}
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          className="inline-block px-6 py-3 rounded-xl text-white font-semibold transition hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
        >
          {actionLabel}
        </a>
      )}
    </div>
  );
}
