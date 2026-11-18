-- CreateEnum
CREATE TYPE "HeroTone" AS ENUM ('DARK', 'LIGHT');

-- CreateEnum
CREATE TYPE "SectionKind" AS ENUM ('CARDS', 'TIMELINE', 'TABLE', 'SPECS', 'GALLERY', 'QUOTE', 'IMAGE', 'SPLIT');

-- CreateTable
CREATE TABLE "works" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "type_it" VARCHAR(180) NOT NULL,
    "type_en" VARCHAR(180) NOT NULL,
    "status_it" VARCHAR(80) NOT NULL,
    "status_en" VARCHAR(80) NOT NULL,
    "tagline_it" VARCHAR(300) NOT NULL,
    "tagline_en" VARCHAR(300) NOT NULL,
    "intro_it" TEXT NOT NULL,
    "intro_en" TEXT NOT NULL,
    "summary_it" TEXT,
    "summary_en" TEXT,
    "closing_it" TEXT,
    "closing_en" TEXT,
    "cta_label_it" VARCHAR(120),
    "cta_label_en" VARCHAR(120),
    "hero_image" VARCHAR(500) NOT NULL,
    "hero_alt_it" VARCHAR(300) NOT NULL,
    "hero_alt_en" VARCHAR(300) NOT NULL,
    "hero_caption" VARCHAR(160),
    "hero_tone" "HeroTone" NOT NULL DEFAULT 'DARK',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "works_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_tags" (
    "id" TEXT NOT NULL,
    "work_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "label_it" VARCHAR(80) NOT NULL,
    "label_en" VARCHAR(80) NOT NULL,

    CONSTRAINT "work_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_stats" (
    "id" TEXT NOT NULL,
    "work_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "value" VARCHAR(40) NOT NULL,
    "label_it" VARCHAR(200) NOT NULL,
    "label_en" VARCHAR(200) NOT NULL,
    "card_label_it" VARCHAR(80),
    "card_label_en" VARCHAR(80),
    "on_card" BOOLEAN NOT NULL DEFAULT false,
    "on_page" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "work_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_sections" (
    "id" TEXT NOT NULL,
    "work_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "kind" "SectionKind" NOT NULL,
    "eyebrow_it" VARCHAR(160),
    "eyebrow_en" VARCHAR(160),
    "title_it" VARCHAR(300),
    "title_en" VARCHAR(300),
    "body_it" TEXT,
    "body_en" TEXT,
    "columns_it" VARCHAR(300),
    "columns_en" VARCHAR(300),
    "image" VARCHAR(500),
    "image_alt_it" VARCHAR(300),
    "image_alt_en" VARCHAR(300),

    CONSTRAINT "work_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_section_items" (
    "id" TEXT NOT NULL,
    "section_id" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL,
    "label_it" VARCHAR(160),
    "label_en" VARCHAR(160),
    "title_it" VARCHAR(300),
    "title_en" VARCHAR(300),
    "body_it" TEXT,
    "body_en" TEXT,
    "extra_it" VARCHAR(300),
    "extra_en" VARCHAR(300),
    "image" VARCHAR(500),
    "image_alt_it" VARCHAR(300),
    "image_alt_en" VARCHAR(300),

    CONSTRAINT "work_section_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "works_slug_key" ON "works"("slug");

-- CreateIndex
CREATE INDEX "work_tags_work_id_idx" ON "work_tags"("work_id");

-- CreateIndex
CREATE INDEX "work_stats_work_id_idx" ON "work_stats"("work_id");

-- CreateIndex
CREATE INDEX "work_sections_work_id_idx" ON "work_sections"("work_id");

-- CreateIndex
CREATE INDEX "work_section_items_section_id_idx" ON "work_section_items"("section_id");

-- AddForeignKey
ALTER TABLE "work_tags" ADD CONSTRAINT "work_tags_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_stats" ADD CONSTRAINT "work_stats_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_sections" ADD CONSTRAINT "work_sections_work_id_fkey" FOREIGN KEY ("work_id") REFERENCES "works"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_section_items" ADD CONSTRAINT "work_section_items_section_id_fkey" FOREIGN KEY ("section_id") REFERENCES "work_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
