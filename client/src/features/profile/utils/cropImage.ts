/**
 * Canvas helpers for the avatar editor.
 *
 * Produces a cropped PNG blob from the crop rectangle reported by
 * react-easy-crop, applying rotation and CSS filters. PNG output
 * preserves transparency created by background removal.
 */

export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface EditFilters {
  /** 1 = normal */
  brightness: number;
  /** 1 = normal */
  contrast: number;
  /** 0 = off, 1 = full grayscale */
  grayscale: number;
}

export interface CropOptions {
  rotation?: number;
  filters?: EditFilters;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.crossOrigin = "anonymous";
    image.src = url;
  });

const getRadianAngle = (degrees: number) => (degrees * Math.PI) / 180;

/** Bounding box of an image after rotation. */
const rotateSize = (width: number, height: number, rotation: number) => {
  const rad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rad) * width) + Math.abs(Math.sin(rad) * height),
    height: Math.abs(Math.sin(rad) * width) + Math.abs(Math.cos(rad) * height),
  };
};

const filterString = (filters?: EditFilters) => {
  if (!filters) return "none";
  return `brightness(${filters.brightness}) contrast(${filters.contrast}) grayscale(${filters.grayscale})`;
};

/**
 * Returns a cropped PNG Blob built from the source image and crop rectangle.
 * `croppedAreaPixels` come from react-easy-crop's onCropComplete.
 */
export const getCroppedImg = async (
  imageSrc: string,
  croppedAreaPixels: Area,
  { rotation = 0, filters }: CropOptions = {}
): Promise<Blob> => {
  const image = await createImage(imageSrc);

  // ── First canvas: draw the full image rotated ───────────────────────────
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D context");

  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  // ── Second canvas: crop to the selected region with filters applied ──────
  const cropCanvas = document.createElement("canvas");
  const cropCtx = cropCanvas.getContext("2d");
  if (!cropCtx) throw new Error("Could not get 2D context");

  cropCanvas.width = Math.round(croppedAreaPixels.width);
  cropCanvas.height = Math.round(croppedAreaPixels.height);

  cropCtx.filter = filterString(filters);
  cropCtx.drawImage(
    canvas,
    Math.round(croppedAreaPixels.x),
    Math.round(croppedAreaPixels.y),
    Math.round(croppedAreaPixels.width),
    Math.round(croppedAreaPixels.height),
    0,
    0,
    Math.round(croppedAreaPixels.width),
    Math.round(croppedAreaPixels.height)
  );

  return new Promise((resolve, reject) => {
    cropCanvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas is empty"));
    }, "image/png");
  });
};
