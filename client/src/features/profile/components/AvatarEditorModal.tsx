import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import { removeBackground } from "@imgly/background-removal";
import { toast } from "react-hot-toast";
import {
  X,
  RotateCw,
  RotateCcw,
  FlipHorizontal2,
  Wand2,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { getCroppedImg, type Area, type EditFilters } from "../utils/cropImage";

interface AvatarEditorModalProps {
  open: boolean;
  imageSrc: string;
  onCancel: () => void;
  onConfirm: (file: File) => void;
}

const DEFAULT_FILTERS: EditFilters = {
  brightness: 1,
  contrast: 1,
  grayscale: 0,
};

const ASPECT_PRESETS: { label: string; value: number | undefined }[] = [
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
];

/**
 * Produce a horizontally-flipped copy of an image as an object URL.
 * Flip is baked into the pixels (not CSS) so react-easy-crop's crop
 * coordinates stay aligned with what the user sees.
 */
const flipImageHorizontally = (src: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Could not get 2D context"));
      ctx.translate(img.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) resolve(URL.createObjectURL(blob));
        else reject(new Error("Canvas is empty"));
      }, "image/png");
    };
    img.onerror = reject;
    img.src = src;
  });

function AvatarEditorModal({
  open,
  imageSrc,
  onCancel,
  onConfirm,
}: AvatarEditorModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [filters, setFilters] = useState<EditFilters>(DEFAULT_FILTERS);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  // Base source (swapped after background removal). Flip is derived from this.
  const [workingSrc, setWorkingSrc] = useState(imageSrc);
  // Source actually fed to the cropper (workingSrc, or a flipped copy of it).
  const [displaySrc, setDisplaySrc] = useState(imageSrc);
  const [bgRemoving, setBgRemoving] = useState(false);
  const [applying, setApplying] = useState(false);

  // Track object URLs we create so they can be revoked (avoid memory leaks).
  const createdUrls = useRef<string[]>([]);

  // Reset all editor state whenever a new source image is opened.
  useEffect(() => {
    setWorkingSrc(imageSrc);
    setDisplaySrc(imageSrc);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setAspect(undefined);
    setFilters(DEFAULT_FILTERS);
  }, [imageSrc]);

  // Derive the cropper source: flip is baked into pixels so crop coords align.
  useEffect(() => {
    let cancelled = false;
    if (!flipH) {
      setDisplaySrc(workingSrc);
      return;
    }
    flipImageHorizontally(workingSrc)
      .then((url) => {
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        createdUrls.current.push(url);
        setDisplaySrc(url);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Flip failed");
      });
    return () => {
      cancelled = true;
    };
  }, [flipH, workingSrc]);

  // Revoke any generated object URLs on unmount.
  useEffect(() => {
    return () => {
      createdUrls.current.forEach((url) => URL.revokeObjectURL(url));
      createdUrls.current = [];
    };
  }, []);

  const onCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const filterCss = `brightness(${filters.brightness}) contrast(${filters.contrast}) grayscale(${filters.grayscale})`;

  const handleRemoveBackground = async () => {
    setBgRemoving(true);
    try {
      const blob = await removeBackground(workingSrc);
      const url = URL.createObjectURL(blob);
      createdUrls.current.push(url);
      setWorkingSrc(url);
      toast.success("Background removed");
    } catch (error) {
      console.error(error);
      toast.error("Background removal failed");
    } finally {
      setBgRemoving(false);
    }
  };

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    setApplying(true);
    try {
      // Flip is already baked into displaySrc, so no flip here.
      const blob = await getCroppedImg(displaySrc, croppedAreaPixels, {
        rotation,
        filters,
      });
      const file = new File([blob], "avatar.png", { type: "image/png" });
      onConfirm(file);
    } catch (error) {
      console.error(error);
      toast.error("Failed to process image");
    } finally {
      setApplying(false);
    }
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={applying || bgRemoving ? undefined : onCancel}
      />

      {/* Panel */}
      <div
        className="
          relative
          z-10
          flex
          max-h-[90vh]
          w-full
          max-w-3xl
          flex-col
          overflow-hidden
          rounded-[28px]
          border
          border-[var(--border-color)]
          bg-[var(--bg-card)]
          shadow-2xl
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--border-color)] px-6 py-4">
          <h2 className="text-lg font-semibold">Edit Avatar</h2>
          <button
            type="button"
            onClick={onCancel}
            disabled={applying || bgRemoving}
            className="rounded-xl p-1.5 text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Crop viewport */}
          <div className="relative h-72 w-full overflow-hidden rounded-3xl bg-[var(--bg-main)] sm:h-80">
            <Cropper
              image={displaySrc}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              cropShape="rect"
              showGrid
              restrictPosition={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              style={{
                mediaStyle: { filter: filterCss },
                cropAreaStyle: { borderRadius: "1.25rem" },
              }}
            />

            {bgRemoving && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/50 text-white">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-sm">Removing background…</p>
                <p className="text-xs opacity-70">
                  First run downloads the model, may take a moment.
                </p>
              </div>
            )}
          </div>

          {/* Aspect presets */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm font-medium text-[var(--text-secondary)]">
              Aspect
            </span>
            {ASPECT_PRESETS.map((preset) => {
              const active = aspect === preset.value;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setAspect(preset.value)}
                  className={`rounded-xl border px-3 py-1.5 text-sm transition-all ${
                    active
                      ? "border-[var(--button-primary)] bg-[var(--button-primary)] text-white dark:text-black"
                      : "border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-secondary)] hover:border-[var(--button-primary)]"
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Transform tools */}
          <div className="mt-4 flex flex-wrap gap-2">
            <ToolButton onClick={() => setRotation((r) => r - 90)}>
              <RotateCcw size={16} /> Rotate left
            </ToolButton>
            <ToolButton onClick={() => setRotation((r) => r + 90)}>
              <RotateCw size={16} /> Rotate right
            </ToolButton>
            <ToolButton active={flipH} onClick={() => setFlipH((f) => !f)}>
              <FlipHorizontal2 size={16} /> Flip
            </ToolButton>
            <ToolButton onClick={handleRemoveBackground} disabled={bgRemoving}>
              <Wand2 size={16} /> Remove background
            </ToolButton>
          </div>

          {/* Sliders */}
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <SliderRow
              label="Zoom"
              value={zoom}
              min={1}
              max={3}
              step={0.01}
              onChange={setZoom}
            />
            <SliderRow
              label="Rotation"
              value={rotation}
              min={-180}
              max={180}
              step={1}
              onChange={setRotation}
              suffix="°"
            />
            <SliderRow
              label="Brightness"
              value={filters.brightness}
              min={0.5}
              max={1.5}
              step={0.01}
              onChange={(v) => setFilters((f) => ({ ...f, brightness: v }))}
            />
            <SliderRow
              label="Contrast"
              value={filters.contrast}
              min={0.5}
              max={1.5}
              step={0.01}
              onChange={(v) => setFilters((f) => ({ ...f, contrast: v }))}
            />
            <SliderRow
              label="Grayscale"
              value={filters.grayscale}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => setFilters((f) => ({ ...f, grayscale: v }))}
            />
            <div className="flex items-end">
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
              >
                <RefreshCw size={15} /> Reset filters
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--border-color)] px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={applying || bgRemoving}
            className="rounded-2xl border border-[var(--border-color)] px-5 py-2.5 font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            disabled={applying || bgRemoving || !croppedAreaPixels}
            className="flex items-center gap-2 rounded-2xl bg-[var(--button-primary)] px-6 py-2.5 font-medium text-white transition-all hover:bg-[var(--button-primary-hover)] disabled:opacity-50 dark:text-black"
          >
            {applying && <Loader2 className="animate-spin" size={16} />}
            {applying ? "Applying…" : "Apply"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── Small internal UI helpers ──────────────────────────────────────────── */

function ToolButton({
  children,
  onClick,
  active,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition-all disabled:opacity-50 ${
        active
          ? "border-[var(--button-primary)] bg-[var(--button-primary)] text-white dark:text-black"
          : "border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-secondary)] hover:border-[var(--button-primary)] hover:text-[var(--text-primary)]"
      }`}
    >
      {children}
    </button>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <label className="font-medium">{label}</label>
        <span className="text-[var(--text-muted)]">
          {value.toFixed(step < 1 ? 2 : 0)}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--button-primary)]"
      />
    </div>
  );
}

export default AvatarEditorModal;
