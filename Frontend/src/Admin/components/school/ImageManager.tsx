import { useState } from "react";
import { ImagePlus, Star, Trash2, AlertCircle } from "lucide-react";
import { adminApi } from "../../services/adminApi";
import type { SchoolImage } from "../../types";
import { ConfirmDialog } from "../common/ConfirmDialog";

interface ImageManagerProps {
  schoolId: string;
  images: SchoolImage[];
  onChange: (images: SchoolImage[]) => void;
}

export function ImageManager({ schoolId, images, onChange }: ImageManagerProps) {
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [imageToDelete, setImageToDelete] = useState<SchoolImage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const addImage = async () => {
    if (!url.trim()) {
      setError("Please enter an image URL.");
      return;
    }
    setError("");
    setIsAdding(true);
    const result = await adminApi.addImage(schoolId, {
      url: url.trim(),
      caption: caption.trim() || null,
      isPrimary: images.length === 0,
    });
    setIsAdding(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    onChange([...images, result.data]);
    setUrl("");
    setCaption("");
  };

  const setPrimary = async (image: SchoolImage) => {
    const result = await adminApi.updateImage(schoolId, image.id, { isPrimary: true });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    // Only one image can be primary; the backend demotes every other one.
    onChange(images.map((img) => ({ ...img, isPrimary: img.id === image.id })));
  };

  const confirmDelete = async () => {
    if (!imageToDelete) return;
    setDeleting(true);
    const result = await adminApi.deleteImage(schoolId, imageToDelete.id);
    setDeleting(false);
    if (!result.ok) {
      setError(result.error);
      setImageToDelete(null);
      return;
    }
    onChange(images.filter((img) => img.id !== imageToDelete.id));
    setImageToDelete(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-dark">Images</h3>
        <span className="text-sm text-text-muted">{images.length} image{images.length === 1 ? "" : "s"}</span>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Add image by URL */}
      <div className="bg-bg-soft border border-border-light rounded-lg p-4 mb-6">
        <p className="text-sm font-medium text-text-dark mb-3">Add image by URL</p>
        <div className="space-y-3">
          <div>
            <label htmlFor="image-url" className="block text-xs font-medium text-text-muted mb-1">
              Image URL
            </label>
            <input
              id="image-url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/school.jpg"
              className="w-full px-3 py-2 border border-border-light rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="image-caption" className="block text-xs font-medium text-text-muted mb-1">
              Caption (optional)
            </label>
            <input
              id="image-caption"
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Campus entrance"
              className="w-full px-3 py-2 border border-border-light rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
            />
          </div>
          <button
            onClick={addImage}
            disabled={isAdding}
            className="inline-flex items-center gap-2 px-4 py-2 bg-teal-primary text-white text-sm font-medium rounded-lg hover:bg-teal-dark transition-colors disabled:opacity-50"
          >
            <ImagePlus size={18} />
            {isAdding ? "Adding..." : "Add Image"}
          </button>
        </div>
      </div>

      {/* Image grid */}
      {images.length === 0 ? (
        <div className="bg-bg-soft border border-dashed border-border-light rounded-lg p-8 text-center">
          <p className="text-sm text-text-muted">No images yet. Add one using the form above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="bg-white border border-border-light rounded-lg overflow-hidden"
            >
              <div className="relative aspect-video bg-bg-soft">
                <img src={image.url} alt={image.altText || image.caption || "School image"} className="w-full h-full object-cover" />
                {image.isPrimary && (
                  <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-teal-primary text-white">
                    <Star size={12} /> Primary
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs text-text-muted truncate mb-2" title={image.caption || "No caption"}>
                  {image.caption || "No caption"}
                </p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setPrimary(image)}
                    disabled={image.isPrimary}
                    className={`text-xs font-medium rounded px-2 py-1 transition-colors disabled:opacity-50 ${
                      image.isPrimary
                        ? "text-teal-primary bg-teal-light"
                        : "text-text-muted hover:text-teal-primary hover:bg-teal-light"
                    }`}
                  >
                    {image.isPrimary ? "Primary" : "Set primary"}
                  </button>
                  <button
                    onClick={() => setImageToDelete(image)}
                    className="p-1.5 text-text-muted hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete image"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={imageToDelete !== null}
        title="Delete image"
        message="This image will be permanently removed. If it was the primary image, the next one will be promoted."
        confirmLabel="Delete"
        danger
        isSubmitting={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setImageToDelete(null)}
      />
    </div>
  );
}
