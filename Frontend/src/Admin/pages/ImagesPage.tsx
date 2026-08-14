import { Image as ImageIcon } from "lucide-react";

export function ImagesPage() {
  return (
    <div className="p-6 sm:p-8">
      <div className="bg-white rounded-lg border border-border-light p-12 text-center">
        <ImageIcon className="mx-auto mb-4 text-text-muted" size={48} />
        <h2 className="text-2xl font-semibold text-text-dark mb-4">Image Management</h2>
        <p className="text-text-muted">Image management will be implemented in Part 2</p>
      </div>
    </div>
  );
}
