import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { adminApi } from "../services/adminApi";
import type { AdminSchoolInput } from "../types";
import { SchoolForm } from "../components/school/SchoolForm";
import { PageHeader } from "../components/common/PageHeader";

export function CreateSchoolPage() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (input: AdminSchoolInput) => {
    setSaving(true);
    const result = await adminApi.createSchool(input);
    setSaving(false);
    if (result.ok) {
      navigate(`/admin/schools/${result.data.id}`);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <PageHeader
        title="Add School"
        subtitle="Create a new school in the directory"
        actions={
          <Link
            to="/admin/schools"
            className="inline-flex items-center gap-2 px-4 py-2 border border-border-light text-text-dark text-sm font-medium rounded-lg hover:bg-bg-soft transition-colors"
          >
            <ArrowLeft size={18} /> Back to Schools
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
        isSubmitting={saving}
        submitLabel="Create School"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
