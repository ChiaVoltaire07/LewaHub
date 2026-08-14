-- CreateTable
CREATE TABLE "Speciality" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Speciality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgramSpeciality" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "specialityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgramSpeciality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Speciality_name_key" ON "Speciality"("name");

-- CreateIndex
CREATE INDEX "Speciality_name_idx" ON "Speciality" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE UNIQUE INDEX "ProgramSpeciality_programId_specialityId_key" ON "ProgramSpeciality"("programId", "specialityId");

-- CreateIndex
CREATE INDEX "ProgramSpeciality_programId_idx" ON "ProgramSpeciality"("programId");

-- CreateIndex
CREATE INDEX "ProgramSpeciality_specialityId_idx" ON "ProgramSpeciality"("specialityId");

-- AddForeignKey
ALTER TABLE "ProgramSpeciality" ADD CONSTRAINT "ProgramSpeciality_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgramSpeciality" ADD CONSTRAINT "ProgramSpeciality_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "Speciality"("id") ON DELETE CASCADE ON UPDATE CASCADE;
