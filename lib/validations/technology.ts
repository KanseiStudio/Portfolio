import { z } from "zod"

const optionalUrl = z
  .union([z.string().url("Inserisci un URL valido"), z.literal("")])
  .optional()

export const technologyTranslationSchema = z.object({
  locale: z.enum(["it", "en"]),
  description:  z.string().min(5, "La descrizione deve avere almeno 5 caratteri"),
  applications: z.string().min(5, "Le applicazioni devono avere almeno 5 caratteri"),
})

export const technologyFormSchema = z.object({
  slug: z
    .string()
    .min(1, "Lo slug è obbligatorio")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Solo lettere minuscole, numeri e trattini"),
  name:        z.string().min(1, "Il nome è obbligatorio").max(120),
  videoUrl:    optionalUrl,
  mainImage:   optionalUrl,
  usageImage1: optionalUrl,
  usageImage2: optionalUrl,
  usageImage3: optionalUrl,
  published:   z.boolean(),
  sortOrder:   z.number().int(),
  translations: z.tuple([
    technologyTranslationSchema.extend({ locale: z.literal("it") }),
    technologyTranslationSchema.extend({ locale: z.literal("en") }),
  ]),
})

export type TechnologyFormValues = z.infer<typeof technologyFormSchema>

export const emptyTechnologyForm: TechnologyFormValues = {
  slug:        "",
  name:        "",
  videoUrl:    "",
  mainImage:   "",
  usageImage1: "",
  usageImage2: "",
  usageImage3: "",
  published:   true,
  sortOrder:   0,
  translations: [
    { locale: "it", description: "", applications: "" },
    { locale: "en", description: "", applications: "" },
  ],
}
