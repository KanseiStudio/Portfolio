-- CreateTable
CREATE TABLE "technologies" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "video_url" VARCHAR(255),
    "main_image" VARCHAR(255),
    "usage_image_1" VARCHAR(255),
    "usage_image_2" VARCHAR(255),
    "usage_image_3" VARCHAR(255),
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "technologies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "technology_translations" (
    "id" SERIAL NOT NULL,
    "technology_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "description" TEXT NOT NULL,
    "applications" TEXT NOT NULL,

    CONSTRAINT "technology_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "technologies_slug_key" ON "technologies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "technology_translations_technology_id_locale_key" ON "technology_translations"("technology_id", "locale");

-- AddForeignKey
ALTER TABLE "technology_translations" ADD CONSTRAINT "technology_translations_technology_id_fkey" FOREIGN KEY ("technology_id") REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE;
