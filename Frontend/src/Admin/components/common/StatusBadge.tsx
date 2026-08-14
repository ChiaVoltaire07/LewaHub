import type { VerificationStatus } from "../../types";

const STYLES: Record<VerificationStatus, string> = {
  VERIFIED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  REJECTED: "bg-red-100 text-red-800",
  NEEDS_UPDATE: "bg-gray-100 text-gray-800",
};

const LABELS: Record<VerificationStatus, string> = {
  VERIFIED: "Verified",
  PENDING: "Pending",
  REJECTED: "Rejected",
  NEEDS_UPDATE: "Needs Update",
};

interface StatusBadgeProps {
  status: VerificationStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STYLES[status]}`}
    >
      {LABELS[status]}
    </span>
  );
}
