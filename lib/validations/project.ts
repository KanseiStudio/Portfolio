import { z } from "zod"

export const KPI_ICONS = [
  "users",
  "zap",
  "eye",
  "trending-up",
  "star",
  "clock",
  "globe",
  "award",
  "bar-chart",
  "activity",
] as const

export type KpiIcon = (typeof KPI_ICONS)[number]

// Accepts a valid URL or an empty string (blank = no URL set)
const optionalUrl = z
  .union([z.string().url("Inserisci un URL valido"), z.literal("")])
  .optional()

export const translationSchema = z.object({
  locale: z.enum(["it", "en"]),
  title: z.string().min(2, "Il titolo deve avere almeno 2 caratteri").max(200),
  tagline: z.string().max(250).optional(),
  description: z.string().min(10, "La descrizione deve avere almeno 10 caratteri"),
  problem: z.string().optional(),
  solution: z.string().optional(),
})

export const kpiSchema = z.object({
  icon: z.string().min(1, "Icona obbligatoria"),
  value: z.string().min(1, "Valore obbligatorio").max(20),
  labelIt: z.string().min(1, "Label IT obbligatoria").max(150),
  labelEn: z.string().min(1, "Label EN obbligatoria").max(150),
  sortOrder: z.number().int(),
})

export const projectFormSchema = z.object({
  slug: z
    .string()
    .min(1, "Lo slug è obbligatorio")
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Solo lettere minuscole, numeri e trattini"),
  year: z.number().int().min(2000).max(2100),
  client: z.string().min(1, "Il cliente è obbligatorio").max(180),
  format: z.string().min(1, "Il formato è obbligatorio").max(120),
  environment: z.string().min(1, "L'ambiente è obbligatorio").max(180),
  technologies: z.string().min(1, "Le tecnologie sono obbligatorie"),
  notes: z.string().optional(),
  videoUrl: optionalUrl,
  posterUrl: optionalUrl,
  coverUrl: optionalUrl,
  published: z.boolean(),
  sortOrder: z.number().int(),
  categoryIds: z.array(z.number().int()),
  translations: z.tuple([
    translationSchema.extend({ locale: z.literal("it") }),
    translationSchema.extend({ locale: z.literal("en") }),
  ]),
  kpis: z.array(kpiSchema),
})

export type ProjectFormValues = z.infer<typeof projectFormSchema>

export const emptyProjectForm: ProjectFormValues = {
  slug: "",
  year: new Date().getFullYear(),
  client: "",
  format: "",
  environment: "",
  technologies: "",
  notes: "",
  videoUrl: "",
  posterUrl: "",
  coverUrl: "",
  published: true,
  sortOrder: 0,
  categoryIds: [],
  translations: [
    { locale: "it", title: "", tagline: "", description: "", problem: "", solution: "" },
    { locale: "en", title: "", tagline: "", description: "", problem: "", solution: "" },
  ],
  kpis: [],
}

export const categoryFormSchema = z.object({
  slug: z
    .string()
    .min(1, "Lo slug è obbligatorio")
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Solo lettere minuscole, numeri e trattini"),
  sortOrder: z.number().int(),
  nameIt: z.string().min(1, "Il nome IT è obbligatorio").max(80),
  nameEn: z.string().min(1, "Il nome EN è obbligatorio").max(80),
})

export type CategoryFormValues = z.infer<typeof categoryFormSchema>
