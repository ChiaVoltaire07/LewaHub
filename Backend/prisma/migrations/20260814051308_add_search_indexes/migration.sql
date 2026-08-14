-- Enable the trigram extension used by the gin_trgm_ops indexes below
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateIndex
CREATE INDEX "Location_city_trgm_idx" ON "Location" USING GIN ("city" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Location_region_trgm_idx" ON "Location" USING GIN ("region" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Program_name_idx" ON "Program" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "School_levels_idx" ON "School" USING GIN ("levels");

-- CreateIndex
CREATE INDEX "School_languages_idx" ON "School" USING GIN ("languages");

-- CreateIndex
CREATE INDEX "School_name_idx" ON "School" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "School_description_idx" ON "School" USING GIN ("description" gin_trgm_ops);
