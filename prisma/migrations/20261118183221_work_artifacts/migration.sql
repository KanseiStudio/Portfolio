-- CreateTable
CREATE TABLE "work_artifacts" (
    "id" TEXT NOT NULL,
    "work_id" TEXT NOT NULL,
    "title_it" VARCHAR(200) NOT NULL,
    "title_en" VARCHAR(200),
    "caption_it" TEXT,
    "caption_en" TEXT,
    "blob_prefix" VARCHAR(200) NOT NULL,
    "entry_path" VARCHAR(300) NOT NULL DEFAULT 'index.html',
    "aspect_ratio" VARCHAR(10) NOT NULL DEFAULT '16/9',
    "poster_url" VARCHAR(500),
    "file_count" INTEGER NOT NULL,
    "total_bytes" INTEGER NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "work_artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "work_artifacts_work_id_position_idx" ON "work_artifacts"("work_id", "position");

-- AddForeignKey
ALTER TABLE "work_artifacts" ADD CONSTRAINT "work_artifacts_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE CASCADE ON UPDATE CASCADE;
