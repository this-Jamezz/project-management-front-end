import { useState } from "react";

type AvatarProps = {
  name: string;
  /** Uploaded photo URL. Falls back to initials when absent or broken. */
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-xl",
} as const;

/**
 * Profile and workspace identity mark.
 *
 * The fill is a saturated violet-to-indigo gradient rather than a translucent
 * tint. A tint loses its edge on the pale Daylight backdrop and washes out,
 * which is why these previously looked flat in one theme or the other. A
 * saturated gradient with an inset highlight reads against both.
 */
export default function Avatar({
  name,
  src,
  size = "md",
  className = "",
}: AvatarProps) {
  const [failed, setFailed] = useState(false);

  const initials = (name || "?").trim().charAt(0).toUpperCase() || "?";

  const showPhoto = Boolean(src) && !failed;

  return (
    <span
      className={`
        relative
        flex
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-full
        font-semibold
        text-white
        ring-1
        ring-white/25
        ring-inset
        ${SIZES[size]}
        ${className}
      `}
    >
      {showPhoto ? (
        <img
          src={src as string}
          alt=""
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex h-full w-full items-center justify-center bg-linear-to-br from-accent-violet to-accent-indigo"
        >
          {initials}
        </span>
      )}
    </span>
  );
}
