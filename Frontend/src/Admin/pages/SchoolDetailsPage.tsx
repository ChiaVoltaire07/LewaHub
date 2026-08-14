import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Edit,
  Trash2,
  Mail,
  Phone,
  Globe,
  MapPin,
  GraduationCap,
  School as SchoolIcon,
  BadgeCheck,
  FileText,
  Image as ImageIcon,
  Building2,
  Users,
  CircleDollarSign,
} from "lucide-react";
import { adminApi } from "../services/adminApi";
import { VerificationStatus } from "../types";
import type { AdminSchoolDetail } from "../types";
import { StatusBadge } from "../components/common/StatusBadge";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { PageHeader } from "../components/common/PageHeader";
import { MapPreview } from "../components/school/MapPreview";
import { AdminSkeleton } from "../components/common/AdminSkeleton";

const STATUS_OPTIONS: VerificationStatus[] = [
  VerificationStatus.PENDING,
  VerificationStatus.VERIFIED,
  VerificationStatus.REJECTED,
  VerificationStatus.NEEDS_UPDATE,
];

export function SchoolDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [school, setSchool] = useState<AdminSchoolDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [changingStatus, setChangingStatus] = useState(false);

  const loadSchool = async () => {
    if (!id) return;
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

  useEffect(() => {
    loadSchool();
  }, [id]);

  const changeStatus = async (status: VerificationStatus) => {
    if (!school || status === school.verificationStatus) return;
    setChangingStatus(true);
    const result = await adminApi.updateSchool(school.id, { verificationStatus: status });
    setChangingStatus(false);
    if (result.ok) {
      setSchool(result.data);
    } else {
      setError(result.error);
    }
  };

  const confirmDelete = async () => {
    if (!school) return;
    setDeleting(true);
    const result = await adminApi.deleteSchool(school.id);
    setDeleting(false);
    if (result.ok) {
      navigate("/admin/schools");
    } else {
      setError(result.error);
      setShowDelete(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 sm:p-8">
        <AdminSkeleton rows={3} />
      </div>
    );
  }

  if (error) {
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

  const infoItem = (icon: React.ReactNode, label: string, value: React.ReactNode) => (
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-lg bg-teal-light text-teal-primary flex-shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-0.5">{label}</p>
        <div className="text-sm text-text-dark break-words">{value || <span className="text-text-muted">—</span>}</div>
      </div>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 space-y-6">
      <PageHeader
        title={school.name}
        subtitle={school.location ? `${school.location.city}, ${school.location.region}` : "Location unknown"}
        actions={
          <>
            <button
              onClick={() => setShowDelete(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 size={18} /> Delete
            </button>
            <Link
              to={`/school/${school.id}`}
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2 border border-border-light text-text-dark text-sm font-medium rounded-lg hover:bg-bg-soft transition-colors"
            >
              <ExternalLink size={18} /> Public Page
            </Link>
            <Link
              to={`/admin/schools/${school.id}/edit`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-teal-primary text-white text-sm font-medium rounded-lg hover:bg-teal-dark transition-colors"
            >
              <Edit size={18} /> Edit
            </Link>
          </>
        }
      />

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Status bar */}
      <div className="bg-white rounded-lg border border-border-light p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <StatusBadge status={school.verificationStatus} />
            {school.verifiedAt && (
              <span className="text-xs text-text-muted">
                Verified {new Date(school.verifiedAt).toLocaleDateString()}
              </span>
            )}
            <span className="text-xs text-text-muted">Updated {new Date(school.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-text-muted">Change status:</span>
            <select
              value={school.verificationStatus}
              onChange={(e) => changeStatus(e.target.value as VerificationStatus)}
              disabled={changingStatus}
              className="px-3 py-2 border border-border-light rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent"
            >
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <div className="bg-white rounded-lg border border-border-light p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-teal-primary" size={20} />
              <h2 className="text-base font-semibold text-text-dark">Description</h2>
            </div>
            <p className="text-sm text-text-dark leading-relaxed whitespace-pre-wrap">{school.description}</p>
            {school.verificationNotes && (
              <div className="mt-4 p-4 bg-bg-soft rounded-lg">
                <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Verification Notes</p>
                <p className="text-sm text-text-dark">{school.verificationNotes}</p>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="bg-white rounded-lg border border-border-light p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="text-teal-primary" size={20} />
              <h2 className="text-base font-semibold text-text-dark">Contact & Web</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {infoItem(
                <Mail size={18} />,
                "Email",
                school.contactEmail ? (
                  <a href={`mailto:${school.contactEmail}`} className="text-teal-primary hover:underline">
                    {school.contactEmail}
                  </a>
                ) : null
              )}
              {infoItem(
                <Phone size={18} />,
                "Phone",
                school.contactPhone ? (
                  <a href={`tel:${school.contactPhone}`} className="hover:underline">
                    {school.contactPhone}
                  </a>
                ) : null
              )}
              {infoItem(
                <Globe size={18} />,
                "Website",
                school.website ? (
                  <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-teal-primary hover:underline">
                    {school.website}
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg border border-border-light p-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="text-teal-primary" size={20} />
              <h2 className="text-base font-semibold text-text-dark">Education</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {infoItem(
                <SchoolIcon size={18} />,
                "Levels",
                <div className="flex flex-wrap gap-1.5">
                  {school.levels.map((level) => (
                    <span key={level} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                      {level}
                    </span>
                  ))}
                </div>
              )}
              {infoItem(
                <Users size={18} />,
                "Languages",
                school.languages.length ? school.languages.join(", ") : null
              )}
              {infoItem(<Building2 size={18} />, "Ownership", school.ownership || null)}
              {infoItem(<SchoolIcon size={18} />, "Boarding", school.boarding || null)}
              {infoItem(<SchoolIcon size={18} />, "Age Range", school.ageRange || null)}
              {infoItem(<Users size={18} />, "Student / Teacher", school.studentTeacherRatio || null)}
              {infoItem(
                <CircleDollarSign size={18} />,
                "Annual Fee",
                school.annualFee != null ? `${school.annualFee.toLocaleString()} XAF` : null
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Location */}
          <div className="bg-white rounded-lg border border-border-light p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-teal-primary" size={20} />
              <h2 className="text-base font-semibold text-text-dark">Location</h2>
            </div>
            <MapPreview
              latitude={school.location.latitude}
              longitude={school.location.longitude}
              address={school.location.address}
              city={school.location.city}
              region={school.location.region}
            />
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg border border-border-light p-6">
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="text-teal-primary" size={20} />
              <h2 className="text-base font-semibold text-text-dark">Images</h2>
            </div>
            {school.images.length === 0 ? (
              <p className="text-sm text-text-muted">No images yet.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {school.images.map((image) => (
                  <div key={image.id} className="relative rounded-lg overflow-hidden border border-border-light aspect-video bg-bg-soft">
                    <img
                      src={image.url}
                      alt={image.altText || image.caption || school.name}
                      className="w-full h-full object-cover"
                    />
                    {image.isPrimary && (
                      <span className="absolute top-1.5 left-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-teal-primary text-white">
                        <BadgeCheck size={10} className="mr-0.5" /> Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick facts */}
          <div className="bg-white rounded-lg border border-border-light p-6">
            <h2 className="text-base font-semibold text-text-dark mb-4">Directory</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-text-muted">Views</dt>
                <dd className="text-sm font-medium text-text-dark">{school.anonymousViews.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-text-muted">Sources</dt>
                <dd className="text-sm font-medium text-text-dark">{school.sources.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-text-muted">Fees</dt>
                <dd className="text-sm font-medium text-text-dark">{school.fees.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-text-muted">Facilities</dt>
                <dd className="text-sm font-medium text-text-dark">{school.facilities.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-text-muted">Programs</dt>
                <dd className="text-sm font-medium text-text-dark">{school.programs.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-text-muted">Qualifications</dt>
                <dd className="text-sm font-medium text-text-dark">{school.qualifications.length}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDelete}
        title="Delete school"
        message={`"${school.name}" and all of its associated data will be permanently deleted. This action cannot be undone.`}
        confirmLabel="Delete"
        danger
        isSubmitting={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setShowDelete(false)}
      />
    </div>
  );
}
