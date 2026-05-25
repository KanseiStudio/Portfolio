-- CreateTable
CREATE TABLE "contact_info" (
    "id" SERIAL NOT NULL,
    "studio_name" VARCHAR(120) NOT NULL DEFAULT 'Kansei Studio',
    "email" VARCHAR(180) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_info_translations" (
    "id" SERIAL NOT NULL,
    "contact_info_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "location" VARCHAR(180) NOT NULL,
    "availability" VARCHAR(250) NOT NULL,
    "focus" VARCHAR(250) NOT NULL,

    CONSTRAINT "contact_info_translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_channels" (
    "id" SERIAL NOT NULL,
    "platform" VARCHAR(60) NOT NULL,
    "icon_name" VARCHAR(60) NOT NULL,
    "handle" VARCHAR(200) NOT NULL,
    "url" VARCHAR(255),
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_channel_translations" (
    "id" SERIAL NOT NULL,
    "contact_channel_id" INTEGER NOT NULL,
    "locale" VARCHAR(5) NOT NULL,
    "label" VARCHAR(120) NOT NULL,

    CONSTRAINT "contact_channel_translations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contact_info_translations_contact_info_id_locale_key" ON "contact_info_translations"("contact_info_id", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "contact_channel_translations_contact_channel_id_locale_key" ON "contact_channel_translations"("contact_channel_id", "locale");

-- AddForeignKey
ALTER TABLE "contact_info_translations" ADD CONSTRAINT "contact_info_translations_contact_info_id_fkey" FOREIGN KEY ("contact_info_id") REFERENCES "contact_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_channel_translations" ADD CONSTRAINT "contact_channel_translations_contact_channel_id_fkey" FOREIGN KEY ("contact_channel_id") REFERENCES "contact_channels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
