import type { ReactNode } from "react";

interface StatCardCompactProps {
  title?: string;
  value?: string | number;
  icon?: ReactNode;
  currency?: string;
}

export function StatCardCompact({
  title,
  value,
  icon,
  currency,
}: StatCardCompactProps) {
  return (
    <div className="card bg-(--color-base-300) card-border border-(--color-base-700) text-base-content w-full transition-shadow hover:shadow-md">
      <div className="card-body flex-row items-center gap-3 sm:gap-4 p-4 sm:p-5">

        {icon && (
          <div className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-(--color-base-200) shrink-0">
            {icon}
          </div>
        )}

        <div className="flex flex-col min-w-0">
          {title && (
            <span className="text-xs sm:text-sm text-base-content/60 truncate">{title}</span>
          )}
          {value !== undefined && (
            <span className="text-xl sm:text-2xl font-bold truncate">
              {typeof value === "number" ? value.toLocaleString() : value}{currency}
            </span>
          )}
        </div>

      </div>
    </div>
  );
}