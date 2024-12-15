import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// export const radioSchema = z.object({
//     name: z.string().min(1, "Le nom est requis."),
//     price: z.string(),
//     description: z.string().min(10, "La description doit contenir au moins 10 caractères."),
//     features: z.array(z.string()).min(1, "Au moins une fonctionnalité est requise."),
//     caracteristics: z.string().min(10, "Les caractéristiques doivent contenir au moins 10 caractères."),
// })

export const radioTable = sqliteTable("radio", {
    id: integer("id").primaryKey(),
    name: text(),
    price: integer(),
    description: text(),
    features: text(),
    caracteristics: text(),
    images: text(),
    public: integer({ mode: 'boolean' }).default(false),
    is_sold: integer({ mode: 'boolean' }).default(false),
    sold_at: text('sold_at').default(""),
    created_at: text('created_at')
        .notNull()
        .default(sql`(current_timestamp)`),
});

export const contactFormTable = sqliteTable("contact_messages", {
    id: integer("id").primaryKey(),
    email: text(),
    message: text(),
    location: text(),
    created_at: text('created_at')
        .notNull()
        .default(sql`(current_timestamp)`),
});