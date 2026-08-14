import { useState } from "react";
import {
  AlertCircle,
  Building2,
  Globe,
  GraduationCap,
  MapPin,
  Phone,
  School as SchoolIcon,
  Mail,
} from "lucide-react";
import {
  EducationLevel,
  SchoolLanguage,
  OwnershipType,
  BoardingType,
  VerificationStatus,
} from "../../types";
import type { AdminSchoolDetail, AdminSchoolInput } from "../../types";

const LEVELS: Array<{ value: EducationLevel; label: string }> = [
  { value: EducationLevel.NURSERY, label: "Nursery" },
  { value: EducationLevel.PRIMARY, label: "Primary" },
  { value: EducationLevel.SECONDARY, label: "Secondary" },
  { value: EducationLevel.HIGHER, label: "Higher" },
];

const LANGUAGES: Array<{ value: SchoolLanguage; label: string }> = [
  { value: SchoolLanguage.ENGLISH, label: "English" },
  { value: SchoolLanguage.FRENCH, label: "French" },
  { value: SchoolLanguage.BILINGUAL, label: "Bilingual" },
];

const OWNERSHIPS: Array<{ value: OwnershipType; label: string }> = [
  { value: OwnershipType.PUBLIC, label: "Public" },
  { value: OwnershipType.PRIVATE, label: "Private" },
  { value: OwnershipType.MISSION, label: "Mission" },
];

const BOARDINGS: Array<{ value: BoardingType; label: string }> = [
  { value: BoardingType.DAY, label: "Day" },
  { value: BoardingType.BOARDING, label: "Boarding" },
  { value: BoardingType.BOTH, label: "Both" },
];

const STATUSES: Array<{ value: VerificationStatus; label: string }> = [
  { value: VerificationStatus.PENDING, label: "Pending" },
  { value: VerificationStatus.VERIFIED, label: "Verified" },
  { value: VerificationStatus.REJECTED, label: "Rejected" },
  { value: VerificationStatus.NEEDS_UPDATE, label: "Needs Update" },
];

const inputClass =
  "w-full px-4 py-2.5 border border-border-light rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-teal-primary focus:border-transparent";
const labelClass = "block text-sm font-medium text-text-dark mb-2";
const sectionTitleClass = "text-base font-semibold text-text-dark";

interface SchoolFormProps {
  initial?: AdminSchoolDetail | null;
  isSubmitting?: boolean;
  submitLabel: string;
  onSubmit: (input: AdminSchoolInput) => void;
}

function toValueOrNull(value: string) {
  return value.trim() === "" ? null : value.trim();
}

function toNumberOrNull(value: string) {
  return value.trim() === "" ? null : Number(value);
}

export function SchoolForm({ initial, isSubmitting = false, submitLabel, onSubmit }: SchoolFormProps) {
  const [error, setError] = useState("");
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [contactEmail, setContactEmail] = useState(initial?.contactEmail ?? "");
  const [contactPhone, setContactPhone] = useState(initial?.contactPhone ?? "");
  const [levels, setLevels] = useState<EducationLevel[]>(initial?.levels ?? []);
  const [languages, setLanguages] = useState<SchoolLanguage[]>(initial?.languages ?? []);
  const [ownership, setOwnership] = useState<string>(initial?.ownership ?? "");
  const [boarding, setBoarding] = useState<string>(initial?.boarding ?? "");
  const [ageRange, setAgeRange] = useState(initial?.ageRange ?? "");
  const [studentTeacherRatio, setStudentTeacherRatio] = useState(initial?.studentTeacherRatio ?? "");
  const [annualFee, setAnnualFee] = useState(initial?.annualFee?.toString() ?? "");
  const [verificationStatus, setVerificationStatus] = useState<string>(
    initial?.verificationStatus ?? "PENDING"
  );
  const [verificationNotes, setVerificationNotes] = useState(initial?.verificationNotes ?? "");
  const [region, setRegion] = useState(initial?.location.region ?? "");
  const [division, setDivision] = useState(initial?.location.division ?? "");
  const [subdivision, setSubdivision] = useState(initial?.location.subdivision ?? "");
  const [city, setCity] = useState(initial?.location.city ?? "");
  const [address, setAddress] = useState(initial?.location.address ?? "");
  const [latitude, setLatitude] = useState(initial?.location.latitude?.toString() ?? "");
  const [longitude, setLongitude] = useState(initial?.location.longitude?.toString() ?? "");

  const toggleLevel = (level: EducationLevel) => {
    setLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const toggleLanguage = (lang: SchoolLanguage) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("School name is required.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }
    if (levels.length === 0) {
      setError("Select at least one education level.");
      return;
    }
    if (!region.trim() || !city.trim()) {
      setError("Region and city are required.");
      return;
    }

    const input: AdminSchoolInput = {
      name: name.trim(),
      description: description.trim(),
      website: toValueOrNull(website),
      contactEmail: toValueOrNull(contactEmail),
      contactPhone: toValueOrNull(contactPhone),
      levels,
      languages,
      ownership: (ownership || null) as OwnershipType | null,
      boarding: (boarding || null) as BoardingType | null,
      ageRange: toValueOrNull(ageRange),
      studentTeacherRatio: toValueOrNull(studentTeacherRatio),
      annualFee: toNumberOrNull(annualFee),
      verificationStatus: verificationStatus as VerificationStatus,
      verificationNotes: toValueOrNull(verificationNotes),
      location: {
        region: region.trim(),
        division: toValueOrNull(division),
        subdivision: toValueOrNull(subdivision),
        city: city.trim(),
        address: toValueOrNull(address),
        latitude: toNumberOrNull(latitude),
        longitude: toNumberOrNull(longitude),
      },
    };

    onSubmit(input);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Basic Info */}
      <section className="bg-white rounded-lg border border-border-light p-6">
        <div className="flex items-center gap-2 mb-5">
          <SchoolIcon className="text-teal-primary" size={20} />
          <h2 className={sectionTitleClass}>Basic Information</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label htmlFor="name" className={labelClass}>
              School Name *
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={inputClass}
              placeholder="e.g. Lycée Général Leclerc"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className={inputClass}
              placeholder="Describe the school..."
            />
          </div>
          <div>
            <label htmlFor="website" className={labelClass}>
              Website
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                id="website"
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className={`${inputClass} pl-10`}
                placeholder="example-school.cm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="contactEmail" className={labelClass}>
              Contact Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                id="contactEmail"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={`${inputClass} pl-10`}
                placeholder="contact@school.cm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="contactPhone" className={labelClass}>
              Contact Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
              <input
                id="contactPhone"
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className={`${inputClass} pl-10`}
                placeholder="+237 6XX XX XX XX"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Education Details */}
      <section className="bg-white rounded-lg border border-border-light p-6">
        <div className="flex items-center gap-2 mb-5">
          <GraduationCap className="text-teal-primary" size={20} />
          <h2 className={sectionTitleClass}>Education Details</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <p className={labelClass}>Education Levels *</p>
            <div className="flex flex-wrap gap-2">
              {LEVELS.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => toggleLevel(level.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    levels.includes(level.value)
                      ? "bg-teal-primary text-white border-teal-primary"
                      : "bg-white text-text-dark border-border-light hover:border-teal-primary"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={labelClass}>Languages</p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => toggleLanguage(lang.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    languages.includes(lang.value)
                      ? "bg-teal-primary text-white border-teal-primary"
                      : "bg-white text-text-dark border-border-light hover:border-teal-primary"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="ownership" className={labelClass}>
              Ownership
            </label>
            <select
              id="ownership"
              value={ownership}
              onChange={(e) => setOwnership(e.target.value)}
              className={inputClass}
            >
              <option value="">Not specified</option>
              {OWNERSHIPS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="boarding" className={labelClass}>
              Boarding
            </label>
            <select
              id="boarding"
              value={boarding}
              onChange={(e) => setBoarding(e.target.value)}
              className={inputClass}
            >
              <option value="">Not specified</option>
              {BOARDINGS.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ageRange" className={labelClass}>
              Age Range
            </label>
            <input
              id="ageRange"
              type="text"
              value={ageRange}
              onChange={(e) => setAgeRange(e.target.value)}
              className={inputClass}
              placeholder="e.g. 3-6 years"
            />
          </div>
          <div>
            <label htmlFor="studentTeacherRatio" className={labelClass}>
              Student / Teacher Ratio
            </label>
            <input
              id="studentTeacherRatio"
              type="text"
              value={studentTeacherRatio}
              onChange={(e) => setStudentTeacherRatio(e.target.value)}
              className={inputClass}
              placeholder="e.g. 1:25"
            />
          </div>
          <div>
            <label htmlFor="annualFee" className={labelClass}>
              Annual Fee (XAF)
            </label>
            <input
              id="annualFee"
              type="number"
              min="0"
              value={annualFee}
              onChange={(e) => setAnnualFee(e.target.value)}
              className={inputClass}
              placeholder="e.g. 150000"
            />
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-white rounded-lg border border-border-light p-6">
        <div className="flex items-center gap-2 mb-5">
          <MapPin className="text-teal-primary" size={20} />
          <h2 className={sectionTitleClass}>Location</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="region" className={labelClass}>
              Region *
            </label>
            <input
              id="region"
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
              className={inputClass}
              placeholder="e.g. Centre"
            />
          </div>
          <div>
            <label htmlFor="city" className={labelClass}>
              City *
            </label>
            <input
              id="city"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className={inputClass}
              placeholder="e.g. Yaoundé"
            />
          </div>
          <div>
            <label htmlFor="division" className={labelClass}>
              Division
            </label>
            <input
              id="division"
              type="text"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
              className={inputClass}
              placeholder="e.g. Mfoundi"
            />
          </div>
          <div>
            <label htmlFor="subdivision" className={labelClass}>
              Subdivision
            </label>
            <input
              id="subdivision"
              type="text"
              value={subdivision}
              onChange={(e) => setSubdivision(e.target.value)}
              className={inputClass}
              placeholder="e.g. Yaoundé II"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="address" className={labelClass}>
              Address
            </label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputClass}
              placeholder="e.g. Avenue Kennedy, Ngoa-Ekellé"
            />
          </div>
          <div>
            <label htmlFor="latitude" className={labelClass}>
              Latitude
            </label>
            <input
              id="latitude"
              type="number"
              step="any"
              min="-90"
              max="90"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className={inputClass}
              placeholder="e.g. 3.8572"
            />
          </div>
          <div>
            <label htmlFor="longitude" className={labelClass}>
              Longitude
            </label>
            <input
              id="longitude"
              type="number"
              step="any"
              min="-180"
              max="180"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className={inputClass}
              placeholder="e.g. 11.4982"
            />
          </div>
        </div>
      </section>

      {/* Verification */}
      <section className="bg-white rounded-lg border border-border-light p-6">
        <div className="flex items-center gap-2 mb-5">
          <Building2 className="text-teal-primary" size={20} />
          <h2 className={sectionTitleClass}>Verification</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label htmlFor="verificationStatus" className={labelClass}>
              Status
            </label>
            <select
              id="verificationStatus"
              value={verificationStatus}
              onChange={(e) => setVerificationStatus(e.target.value)}
              className={inputClass}
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="verificationNotes" className={labelClass}>
              Verification Notes
            </label>
            <input
              id="verificationNotes"
              type="text"
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              className={inputClass}
              placeholder="Notes for the verification team..."
            />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 bg-teal-primary text-white text-sm font-medium rounded-lg hover:bg-teal-dark focus:outline-none focus:ring-2 focus:ring-teal-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
