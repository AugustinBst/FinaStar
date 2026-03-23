import type { ReactNode } from "react";

interface StatCardProps {
  title?: string;
  icon?: ReactNode;
  body?: string;
  progress?: number;       // 0–100
  current?: number;
  target?: number;
  currency?: string;       // ex: "€"
  actionLabel?: string;
  onAction?: () => void;
}

export function StatCard({
  title,
  icon,
  body,
  progress,
  current,
  target,
  currency = "€",
  actionLabel,
  onAction,
}: StatCardProps) {
  return (
    <div className="card bg-(--color-base-300) card-border border-(--color-base-700) text-base-content w-100">
      <div className="card-body gap-3">

        {/* Header : icône + titre */}
        {(icon || title) && (
          <div className="flex items-center gap-3">
            {icon && (
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-(--color-base-200)">
                {icon}
              </div>
            )}
            {title && <h2 className="card-title text-xl">{title}</h2>}
          </div>
        )}

        {/* Barre de progression */}
        {progress !== undefined && (
          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 rounded-full bg-(--color-base-200) overflow-hidden">
              <div
                className="h-full rounded-full bg-fuchsia-500 transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <span className="text-sm font-semibold tabular-nums">{progress}%</span>
          </div>
        )}

        {/* Montant courant / cible */}
        {(current !== undefined || target !== undefined) && (
          <p className="text-sm text-base-content/70">
            {current !== undefined && (
              <span className="font-semibold text-base-content">
                {current.toLocaleString()}{currency}
              </span>
            )}
            {current !== undefined && target !== undefined && " / "}
            {target !== undefined && (
              <span>{target.toLocaleString()}{currency} target</span>
            )}
          </p>
        )}

        {/* Corps texte libre */}
        {body && <p className="text-sm">{body}</p>}

        {/* Bouton d'action */}
        {actionLabel && (
          <div className="card-actions justify-end">
            <button className="btn" onClick={onAction}>
              {actionLabel}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}