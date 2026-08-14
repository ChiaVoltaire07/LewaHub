import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { adminApi } from "../services/adminApi";
import type { AdminSchoolDetail, AdminSchoolInput } from "../types";
import { SchoolForm } from "../components/school/SchoolForm";
import { ImageManager } from "../components/school/ImageManager";
import { AdminSkeleton } from "../components/common/AdminSkeleton";
import { PageHeader } from "../components/common/PageHeader";

export function EditSchoolPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [school, setSchool] = useState<AdminSchoolDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadSchool = async () => {
      setIsLoading(true);
      setError("");
      const response = await adminApi.getSchool(id);
      if (response.ok) {
        setSchool(response.data);
      } else {
        setError(response.error);
      }
      setIsLoading(false);
    };
    loadSchool();
  }, [id]);

  const handleSubmit = async (input: AdminSchoolInput) => {
    if (!id) return;
    setSaving(true);
    const result = await adminApi.updateSchool(id, input);
    setSaving(false);
    if (result.ok) {
      navigate(`/admin/schools/${id}`);
    } else {
      setError(result.error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8">
        <AdminSkeleton rows={3} />
      </div>
    );
  }

  if (error && !school) {
    return (
      <div className="p-6 sm:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto mb-2 text-red-500" size={32} />
          <p className="text-red-600">{error}</p>
          <Link
            to="/admin/schools"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-teal-primary text-white rounded-lg hover:bg-teal-dark transition-colors"
          >
            <ArrowLeft size={18} /> Back to Schools
          </Link>
        </div>
      </div>
    );
  }

  if (!school) return null;

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <PageHeader
        title={`Edit: ${school.name}`}
        subtitle="Update school information below"
        actions={
          <Link
            to={`/admin/schools/${school.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 border border-border-light text-text-dark text-sm font-medium rounded-lg hover:bg-bg-soft transition-colors"
          >
            <ArrowLeft size={18} /> Back to Details
          </Link>
        }
      />

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <SchoolForm
        initial={school}
        isSubmitting={saving}
        submitLabel="Save Changes"
        onSubmit={handleSubmit}
      />

      {/* Image management */}
      <section className="bg-white rounded-lg border border-border-light p-6">
        <ImageManager
          schoolId={school.id}
          images={school.images}
          onChange={(images) => setSchool({ ...school, images })}
        />
      </section>
    </div>
  );
}
