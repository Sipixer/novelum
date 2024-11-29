import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { usersTable } from "src/db/schema";

// Fonction principale d'action
export async function action({ context }: ActionFunctionArgs) {
    const { env } = context.cloudflare;

    const db = drizzle(env.DB);
    const name = getRandomName();


    // Insertion dans la base de données
    const result = await db.insert(usersTable).values({
        name,
        age: getRandomAge(),
        email: getRandomEmail(name),
    });
    console.log(result);

    return new Response("10 utilisateurs insérés avec succès !", {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}


// Fonction utilitaire pour générer des noms aléatoires
function getRandomName() {
    const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"];
    const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis"];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return `${firstName} ${lastName}`;
}

// Fonction utilitaire pour générer un email aléatoire
function getRandomEmail(name: string) {
    const domains = ["example.com", "testmail.com", "random.org", "fakemail.net"];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const sanitized = name.toLowerCase().replace(" ", ".");
    return `${sanitized}@${domain}`;
}

// Fonction utilitaire pour générer un âge aléatoire (entre 18 et 65 ans)
function getRandomAge() {
    return Math.floor(Math.random() * (65 - 18 + 1)) + 18;
}