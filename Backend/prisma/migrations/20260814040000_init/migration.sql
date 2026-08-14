-- CreateEnum
CREATE TYPE "EducationLevel" AS ENUM ('NURSERY', 'PRIMARY', 'SECONDARY', 'HIGHER');

-- CreateEnum
CREATE TYPE "SchoolLanguage" AS ENUM ('ENGLISH', 'FRENCH', 'BILINGUAL');

-- CreateEnum
CREATE TYPE "OwnershipType" AS ENUM ('PUBLIC', 'PRIVATE', 'MISSION');

-- CreateEnum
CREATE TYPE "BoardingType" AS ENUM ('DAY', 'BOARDING', 'BOTH');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'NEEDS_UPDATE');

-- CreateEnum
CREATE TYPE "SecondarySection" AS ENUM ('GENERAL', 'TECHNICAL');

-- CreateEnum
CREATE TYPE "TechnicalTrack" AS ENUM ('INDUSTRIAL', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "QualificationType" AS ENUM ('SCHOOL_LEAVING', 'DIPLOMA', 'HND', 'BACHELOR', 'MASTER', 'DOCTORATE', 'OTHER');

-- CreateEnum
CREATE TYPE "QualificationField" AS ENUM ('SCIENCE', 'TECHNOLOGY', 'ARTS', 'BUSINESS', 'ENGINEERING', 'MEDICINE', 'LAW', 'EDUCATION', 'OTHER');

-- CreateEnum
CREATE TYPE "IdentifierType" AS ENUM ('MINESEC_RNE', 'MINEDUB_RNE', 'MINESUP_RNE', 'OTHER');

-- CreateEnum
CREATE TYPE "SourceType" AS ENUM ('OFFICIAL_GOVERNMENT', 'OFFICIAL_SCHOOL_WEBSITE', 'MANUAL_ENTRY', 'PUBLIC_DIRECTORY', 'AI_EXTRACTED');

-- CreateEnum
CREATE TYPE "SourceStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ImageUsageStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AgentStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('PENDING', 'REVIEWING', 'APPROVED', 'REJECTED', 'DUPLICATE');

-- CreateEnum
CREATE TYPE "CandidateReviewStatus" AS ENUM ('UNREVIEWED', 'REVIEWED', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "division" TEXT,
    "subdivision" TEXT,
    "city" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "School" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "website" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "levels" "EducationLevel"[],
    "languages" "SchoolLanguage"[],
    "ownership" "OwnershipType",
    "boarding" "BoardingType",
    "ageRange" TEXT,
    "studentTeacherRatio" TEXT,
    "annualFee" INTEGER,
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "verificationNotes" TEXT,
    "aiSummary" TEXT,
    "anonymousViews" INTEGER NOT NULL DEFAULT 0,
    "isDemoData" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolSection" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "section" "SecondarySection" NOT NULL,
    "track" "TechnicalTrack",
    "classesOffered" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faculty" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "facultyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "departmentId" TEXT,
    "qualificationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" TEXT,
    "tuition" INTEGER,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "schoolId" TEXT,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Qualification" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "QualificationType" NOT NULL,
    "field" "QualificationField",
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Qualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolQualification" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "qualificationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolQualification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolImage" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "storageKey" TEXT,
    "caption" TEXT,
    "altText" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "sourceUrl" TEXT,
    "sourceType" "SourceType",
    "usageStatus" "ImageUsageStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolFee" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "academicYear" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'XAF',
    "category" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolFee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolFacility" (
    "schoolId" TEXT NOT NULL,
    "facilityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SchoolFacility_pkey" PRIMARY KEY ("schoolId","facilityId")
);

-- CreateTable
CREATE TABLE "SchoolSource" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "sourceType" "SourceType" NOT NULL,
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "retrievedAt" TIMESTAMP(3),
    "verifiedAt" TIMESTAMP(3),
    "confidence" DOUBLE PRECISION,
    "status" "SourceStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstitutionIdentifier" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "type" "IdentifierType" NOT NULL,
    "value" TEXT NOT NULL,
    "issuingAuthority" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InstitutionIdentifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AgentRun" (
    "id" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "agentVersion" TEXT NOT NULL,
    "task" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" "AgentStatus" NOT NULL,
    "recordsFound" INTEGER NOT NULL DEFAULT 0,
    "recordsCreated" INTEGER NOT NULL DEFAULT 0,
    "recordsUpdated" INTEGER NOT NULL DEFAULT 0,
    "recordsRejected" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "AgentRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchoolDataCandidate" (
    "id" TEXT NOT NULL,
    "agentRunId" TEXT NOT NULL,
    "rawData" JSONB,
    "structuredData" JSONB,
    "sourceUrl" TEXT,
    "sourceName" TEXT,
    "sourceType" "SourceType",
    "confidence" DOUBLE PRECISION,
    "matchedSchoolId" TEXT,
    "status" "CandidateStatus" NOT NULL DEFAULT 'PENDING',
    "reviewStatus" "CandidateReviewStatus" NOT NULL DEFAULT 'UNREVIEWED',
    "reviewNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SchoolDataCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_hash_key" ON "VerificationToken"("hash");

-- CreateIndex
CREATE INDEX "VerificationToken_expiresAt_idx" ON "VerificationToken"("expiresAt");

-- CreateIndex
CREATE INDEX "Location_region_idx" ON "Location"("region");

-- CreateIndex
CREATE INDEX "Location_division_idx" ON "Location"("division");

-- CreateIndex
CREATE INDEX "Location_subdivision_idx" ON "Location"("subdivision");

-- CreateIndex
CREATE INDEX "Location_city_idx" ON "Location"("city");

-- CreateIndex
CREATE UNIQUE INDEX "Location_region_division_subdivision_city_address_key" ON "Location"("region", "division", "subdivision", "city", "address");

-- CreateIndex
CREATE INDEX "School_locationId_idx" ON "School"("locationId");

-- CreateIndex
CREATE INDEX "School_verificationStatus_idx" ON "School"("verificationStatus");

-- CreateIndex
CREATE INDEX "School_createdAt_idx" ON "School"("createdAt");

-- CreateIndex
CREATE INDEX "SchoolSection_schoolId_idx" ON "SchoolSection"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolSection_schoolId_section_track_key" ON "SchoolSection"("schoolId", "section", "track");

-- CreateIndex
CREATE INDEX "Faculty_schoolId_idx" ON "Faculty"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Faculty_schoolId_name_key" ON "Faculty"("schoolId", "name");

-- CreateIndex
CREATE INDEX "Department_facultyId_idx" ON "Department"("facultyId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_facultyId_name_key" ON "Department"("facultyId", "name");

-- CreateIndex
CREATE INDEX "Program_departmentId_idx" ON "Program"("departmentId");

-- CreateIndex
CREATE INDEX "Program_qualificationId_idx" ON "Program"("qualificationId");

-- CreateIndex
CREATE INDEX "Program_schoolId_idx" ON "Program"("schoolId");

-- CreateIndex
CREATE UNIQUE INDEX "Qualification_name_key" ON "Qualification"("name");

-- CreateIndex
CREATE INDEX "Qualification_type_idx" ON "Qualification"("type");

-- CreateIndex
CREATE INDEX "Qualification_field_idx" ON "Qualification"("field");

-- CreateIndex
CREATE INDEX "SchoolQualification_schoolId_idx" ON "SchoolQualification"("schoolId");

-- CreateIndex
CREATE INDEX "SchoolQualification_qualificationId_idx" ON "SchoolQualification"("qualificationId");

-- CreateIndex
CREATE UNIQUE INDEX "SchoolQualification_schoolId_qualificationId_key" ON "SchoolQualification"("schoolId", "qualificationId");

-- CreateIndex
CREATE INDEX "SchoolImage_schoolId_idx" ON "SchoolImage"("schoolId");

-- CreateIndex
CREATE INDEX "SchoolImage_usageStatus_idx" ON "SchoolImage"("usageStatus");

-- CreateIndex
CREATE INDEX "SchoolFee_schoolId_idx" ON "SchoolFee"("schoolId");

-- CreateIndex
CREATE INDEX "SchoolFee_academicYear_idx" ON "SchoolFee"("academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "Facility_name_key" ON "Facility"("name");

-- CreateIndex
CREATE INDEX "SchoolFacility_facilityId_idx" ON "SchoolFacility"("facilityId");

-- CreateIndex
CREATE INDEX "SchoolSource_schoolId_idx" ON "SchoolSource"("schoolId");

-- CreateIndex
CREATE INDEX "SchoolSource_sourceType_idx" ON "SchoolSource"("sourceType");

-- CreateIndex
CREATE INDEX "SchoolSource_status_idx" ON "SchoolSource"("status");

-- CreateIndex
CREATE INDEX "InstitutionIdentifier_schoolId_idx" ON "InstitutionIdentifier"("schoolId");

-- CreateIndex
CREATE INDEX "InstitutionIdentifier_type_idx" ON "InstitutionIdentifier"("type");

-- CreateIndex
CREATE UNIQUE INDEX "InstitutionIdentifier_schoolId_type_value_key" ON "InstitutionIdentifier"("schoolId", "type", "value");

-- CreateIndex
CREATE INDEX "AgentRun_agentName_idx" ON "AgentRun"("agentName");

-- CreateIndex
CREATE INDEX "AgentRun_status_idx" ON "AgentRun"("status");

-- CreateIndex
CREATE INDEX "AgentRun_startedAt_idx" ON "AgentRun"("startedAt");

-- CreateIndex
CREATE INDEX "SchoolDataCandidate_agentRunId_idx" ON "SchoolDataCandidate"("agentRunId");

-- CreateIndex
CREATE INDEX "SchoolDataCandidate_matchedSchoolId_idx" ON "SchoolDataCandidate"("matchedSchoolId");

-- CreateIndex
CREATE INDEX "SchoolDataCandidate_status_idx" ON "SchoolDataCandidate"("status");

-- CreateIndex
CREATE INDEX "SchoolDataCandidate_reviewStatus_idx" ON "SchoolDataCandidate"("reviewStatus");

-- CreateIndex
CREATE INDEX "SchoolDataCandidate_createdAt_idx" ON "SchoolDataCandidate"("createdAt");

-- AddForeignKey
ALTER TABLE "School" ADD CONSTRAINT "School_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolSection" ADD CONSTRAINT "SchoolSection_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faculty" ADD CONSTRAINT "Faculty_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "Faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_qualificationId_fkey" FOREIGN KEY ("qualificationId") REFERENCES "Qualification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolQualification" ADD CONSTRAINT "SchoolQualification_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolQualification" ADD CONSTRAINT "SchoolQualification_qualificationId_fkey" FOREIGN KEY ("qualificationId") REFERENCES "Qualification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolImage" ADD CONSTRAINT "SchoolImage_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolFee" ADD CONSTRAINT "SchoolFee_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolFacility" ADD CONSTRAINT "SchoolFacility_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "Facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolFacility" ADD CONSTRAINT "SchoolFacility_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolSource" ADD CONSTRAINT "SchoolSource_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstitutionIdentifier" ADD CONSTRAINT "InstitutionIdentifier_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolDataCandidate" ADD CONSTRAINT "SchoolDataCandidate_agentRunId_fkey" FOREIGN KEY ("agentRunId") REFERENCES "AgentRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SchoolDataCandidate" ADD CONSTRAINT "SchoolDataCandidate_matchedSchoolId_fkey" FOREIGN KEY ("matchedSchoolId") REFERENCES "School"("id") ON DELETE SET NULL ON UPDATE CASCADE;

