import { z } from "zod";

export const contactFormSchema = z.object({
    email: z.string().email("Veuillez entrer une adresse email valide."),
    message: z.string().min(10, "Votre message doit faire au moins 10 caractères."),
    location: z.string().optional(), // it's page location to know where the message was sent
});

export type ContactFormType = z.infer<typeof contactFormSchema>;