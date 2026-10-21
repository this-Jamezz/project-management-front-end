import { useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import Avatar from "./Avatar";
import PhotoUploadModal from "./PhotoUploadModal";
import { resolveMediaUrl } from "../../utils/media";

type PhotoPickerProps = {
  label: string;
  name: string;
  src?: string | null;
  onUpload: (file: File) => Promise<void>;
  size?: "md" | "lg";
  hint?: string;
};

/**
 * Avatar with an upload button that opens a confirmation modal.
 *
 * Clicking the camera no longer calls input.click() and upload straight
 * away. Picking a file and committing the upload are separate steps, so a
 * misclick cannot start an upload with no way to see what was chosen.
 */
export default function PhotoPicker({
  label,
  name,
  src,
  onUpload,
  size = "lg",
  hint,
}: PhotoPickerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const photoUrl = resolveMediaUrl(src);

  return (
    <>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:gap-5">
        {/* Preview with the camera button overlaid */}
        <div className="relative shrink-0">
          <Avatar name={name} src={photoUrl} size={size} />

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            aria-label={`Upload ${label.toLowerCase()}`}
            title="Change photo"
            className="glass-strong absolute -right-1 -bottom-1 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-transform duration-150 hover:scale-110 active:scale-95"
          >
            <Camera size={14} />
          </button>
        </div>

        <div className="min-w-0 text-center sm:text-left">
          <p className="font-medium">{label}</p>
          <p className="mt-0.5 text-xs text-white/55">
            {hint ?? "JPG, PNG, GIF or WebP. Up to 5 MB."}
          </p>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="glass-button-ghost mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs"
          >
            {src ? <Trash2 size={12} /> : <Camera size={12} />}
            {src ? "Replace photo" : "Upload photo"}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <PhotoUploadModal
          label={label}
          name={name}
          currentSrc={src}
          onUpload={onUpload}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
