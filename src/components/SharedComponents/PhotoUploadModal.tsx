import { useEffect, useRef, useState } from "react";
import { Upload, ImagePlus, Loader, AlertCircle, Check } from "lucide-react";
import Modal from "./Modal";
import Avatar from "./Avatar";
import { resolveMediaUrl } from "../../utils/media";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ["image/jpeg", "image/png", "image/gif", "image/webp"];

type PhotoUploadModalProps = {
  label: string;
  name: string;
  /** Current saved photo, shown until a new one is chosen. */
  currentSrc?: string | null;
  onUpload: (file: File) => Promise<void>;
  onClose: () => void;
};

/**
 * Explicit upload flow: open modal, choose a file, preview it, then confirm.
 *
 * Previously the camera button called input.click() and uploaded on change,
 * so a single misclick started an upload with no confirmation and no chance
 * to see what was picked. Picking and committing are now separate steps.
 */
export default function PhotoUploadModal({
  label,
  name,
  currentSrc,
  onUpload,
  onClose,
}: PhotoUploadModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Revoke the previous object URL so previews do not leak.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function selectFile(candidate: File | undefined) {
    if (!candidate) return;

    setError("");

    if (!ACCEPTED.includes(candidate.type)) {
      setError("Choose a JPG, PNG, GIF or WebP image.");
      return;
    }

    if (candidate.size > MAX_BYTES) {
      setError(
        `That image is ${(candidate.size / 1024 / 1024).toFixed(1)} MB. The limit is 5 MB.`
      );
      return;
    }

    setFile(candidate);
    setPreview(URL.createObjectURL(candidate));
  }

  async function handleUpload() {
    if (!file || isUploading) return;

    try {
      setIsUploading(true);
      setError("");
      await onUpload(file);
      onClose();
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Upload failed. Try again."
      );
    } finally {
      setIsUploading(false);
    }
  }

  const existing = resolveMediaUrl(currentSrc);

  return (
    <Modal
      onClose={onClose}
      label={`Upload ${label.toLowerCase()}`}
      isBusy={isUploading}
      panelClassName="glass-strong animate-modal-in w-full max-w-md overflow-hidden rounded-3xl"
    >
      <div className="p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Upload {label.toLowerCase()}</h2>

          {isUploading && (
            <span className="flex items-center gap-2 text-xs text-white/70">
              <Loader size={13} className="animate-spin" />
              Uploading
            </span>
          )}
        </div>

        <p className="mt-1 text-sm text-white/60">
          JPG, PNG, GIF or WebP. Up to 5 MB.
        </p>

        {/* Picker */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!isUploading) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (!isUploading) selectFile(e.dataTransfer.files?.[0]);
          }}
          className={`
            mt-5 flex flex-col items-center justify-center gap-3 rounded-2xl
            border-2 border-dashed px-6 py-8 text-center transition-colors duration-150
            ${
              isDragging
                ? "border-accent-violet bg-white/10"
                : "border-white/20 bg-white/5"
            }
            ${isUploading ? "pointer-events-none opacity-40" : ""}
          `}
        >
          {preview ? (
            <>
              <img
                src={preview}
                alt="Selected preview"
                className="h-28 w-28 rounded-full object-cover ring-2 ring-white/25"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{file?.name}</p>
                <p className="text-xs text-white/55">
                  {file ? `${(file.size / 1024).toFixed(0)} KB` : ""}
                </p>
              </div>
              <button
                type="button"
                disabled={isUploading}
                onClick={() => inputRef.current?.click()}
                className="glass-button-ghost cursor-pointer rounded-lg px-3 py-1.5 text-xs disabled:cursor-not-allowed disabled:opacity-50"
              >
                Choose a different file
              </button>
            </>
          ) : (
            <>
              <div className="glass-subtle flex h-14 w-14 items-center justify-center rounded-2xl">
                <ImagePlus size={24} className="text-accent-violet" />
              </div>
              <div>
                <p className="text-sm font-medium">Drop an image here</p>
                <p className="mt-0.5 text-xs text-white/55">or</p>
              </div>
              <button
                type="button"
                disabled={isUploading}
                onClick={() => inputRef.current?.click()}
                className="glass-button cursor-pointer rounded-xl px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Upload size={14} className="mr-1.5 inline" />
                Browse files
              </button>
            </>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(",")}
            className="sr-only"
            disabled={isUploading}
            onChange={(e) => {
              selectFile(e.target.files?.[0]);
              // Allow re-picking the same file.
              e.target.value = "";
            }}
          />
        </div>

        {/* Existing photo */}
        {existing && !preview && (
          <div className="mt-4 flex items-center gap-3">
            <Avatar name={name} src={existing} size="sm" />
            <p className="text-xs text-white/60">
              Current photo. Uploading replaces it.
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <p
            role="alert"
            className="mt-4 flex items-start gap-2 rounded-xl border alert-danger border px-3 py-2.5 text-sm status-danger"
          >
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="glass-button-ghost cursor-pointer rounded-xl px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="glass-button flex min-w-[124px] cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isUploading ? (
              <>
                <Loader size={15} className="animate-spin" />
                Uploading
              </>
            ) : (
              <>
                <Check size={15} />
                Upload
              </>
            )}
          </button>
        </div>
      </div>

      {/* Blocking overlay while the request is in flight. */}
      {isUploading && (
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-[#0b0618]/55 backdrop-blur-[2px]"
        />
      )}
    </Modal>
  );
}
