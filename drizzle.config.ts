import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

console.log(process.env.CLOUDFLARE_DATABASE_ID)
export default process.env.CLOUDFLARE_DATABASE_ID
    ? defineConfig({
        dialect: "sqlite",
        driver: "d1-http",
        out: "drizzle",
        schema: "./src/db/schema.ts",
        dbCredentials: {
            accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
            databaseId: process.env.CLOUDFLARE_DATABASE_ID,
            token: process.env.CLOUDFLARE_D1_TOKEN!,
        },
    })
    : defineConfig({
        dialect: "sqlite",
        out: "drizzle",
        schema: "./src/db/schema.ts",
        dbCredentials: {
            url: "./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/5046227090a8e6a45f9cff03eddbc54a7ba4794cbed69bc39ce6b40420cd0532.sqlite",
        },
    });


