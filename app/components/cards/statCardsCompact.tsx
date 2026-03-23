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
    <div className="card bg-(--color-base-300) card-border border-(--color-base-700) text-base-content w-100">
      <div className="card-body flex-row items-center gap-4 py-4">

        {icon && (
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-(--color-base-200) shrink-0">
            {icon}
          </div>
        )}

        <div className="flex flex-col">
          {title && (
            <span className="text-sm text-base-content/60">{title}</span>
          )}
          {value !== undefined && (
            <span className="text-2xl font-bold">
              {typeof value === "number" ? value.toLocaleString() : value}{currency}
            </span>
          )}
        </div>

      </div>
    </div>
  );
}