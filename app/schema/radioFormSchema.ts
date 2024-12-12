import { z } from "zod"

export const radioSchema = z.object({
    name: z.string().min(1, "Le nom est requis."),
    price: z.coerce.number().int().min(1, "Le prix doit être supérieur à 0."),
    description: z.string().min(10, "La description doit contenir au moins 10 caractères."),
    features: z.array(z.string()).min(1, "Au moins une fonctionnalité est requise."),
    caracteristics: z.string().min(10, "Les caractéristiques doivent contenir au moins 10 caractères."),
    images: z.array(z.string()),
})

export type RadioFormType = z.infer<typeof radioSchema>