-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "year" INTEGER NOT NULL,
    "client" VARCHAR(180) NOT NULL,
    "format" VARCHAR(120) NOT NULL,
    "environment" VARCHAR(180) NOT NULL,
    "technologies" TEXT NOT NULL,
    "notes" TEXT,
    "video_url" VARCHAR(255),
    "poster_url" VARCHAR(255),
    "cover_url" VARCHAR(255),
    "published" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_translations" (
    "project_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "tagline" VARCHAR(250),
    "description" TEXT NOT NULL,
    "problem" TEXT,
    "solution" TEXT,

    CONSTRAINT "project_translations_pkey" PRIMARY KEY ("project_id","locale")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "slug" VARCHAR(60) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category_translations" (
    "category_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "name" VARCHAR(80) NOT NULL,

    CONSTRAINT "category_translations_pkey" PRIMARY KEY ("category_id","locale")
);

-- CreateTable
CREATE TABLE "project_categories" (
    "project_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,

    CONSTRAINT "project_categories_pkey" PRIMARY KEY ("project_id","category_id")
);

-- CreateTable
CREATE TABLE "project_kpis" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "icon" VARCHAR(30) NOT NULL,
    "value" VARCHAR(20) NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "project_kpis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_kpi_translations" (
    "kpi_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "label" VARCHAR(150) NOT NULL,

    CONSTRAINT "project_kpi_translations_pkey" PRIMARY KEY ("kpi_id","locale")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_slug_key" ON "projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- AddForeignKey
ALTER TABLE "project_translations" ADD CONSTRAINT "project_translations_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_translations" ADD CONSTRAINT "category_translations_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_categories" ADD CONSTRAINT "project_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_kpis" ADD CONSTRAINT "project_kpis_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_kpi_translations" ADD CONSTRAINT "project_kpi_translations_kpi_id_fkey" FOREIGN KEY ("kpi_id") REFERENCES "project_kpis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
