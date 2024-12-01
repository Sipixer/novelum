import { z } from "zod";

export const contactFormSchema = z.object({
    email: z.string().email("Veuillez entrer une adresse email valide."),
    message: z.string().min(10, "Votre message doit faire au moins 10 caractères."),
});

export type ContactFormType = z.infer<typeof contactFormSchema>;