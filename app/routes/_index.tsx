import type { LoaderFunction, MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { type InferSelectModel, and, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { radioTable } from "src/db/schema";
import { CTASection } from "~/components/CTASection";
import { ContactForm } from "~/components/ContactForm";
import { HeroSection } from "~/components/HeroSection";
import { Layout } from "~/components/Layout";
import { ProductSection } from "~/components/ProductSection";
import { RetroExperienceSection } from "~/components/RetroExperienceSection";
import { TestimonialSection } from "~/components/TestimonialSection";

export const meta: MetaFunction = () => {
	return [
		{ title: "Novelum - Radios Vintage Modernisées" },
		{
			name: "description",
			content:
				"Découvrez Novelum, où les radios vintage retrouvent vie grâce à une restauration artisanale et des technologies modernes. Un mariage unique d'authenticité et d'innovation.",
		},
		{ property: "og:title", content: "Novelum - Radios Vintage Modernisées" },
		{
			property: "og:description",
			content:
				"Découvrez Novelum, où les radios vintage retrouvent vie grâce à une restauration artisanale et des technologies modernes. Un mariage unique d'authenticité et d'innovation.",
		},
		{ property: "og:url", content: "https://novelum-radio.fr/" },
		{ property: "og:type", content: "website" },
		{ property: "og:locale", content: "fr_FR" },
		{ name: "twitter:title", content: "Novelum - Radios Vintage Modernisées" },
		{
			name: "twitter:description",
			content:
				"Découvrez Novelum, où les radios vintage retrouvent vie grâce à une restauration artisanale et des technologies modernes. Un mariage unique d'authenticité et d'innovation.",
		},
	];
};
export const loader: LoaderFunction = async ({ context }) => {
	const env = context.cloudflare.env as Env;
	const db = drizzle(env.DB);
	const radios = await db
		.select()
		.from(radioTable)
		.where(and(eq(radioTable.public, true), eq(radioTable.is_sold, false)))
		.orderBy(desc(radioTable.created_at))
		.limit(4);
	return Response.json(radios);
};
type RadioModel = InferSelectModel<typeof radioTable>;

export default function Index() {
	const radios = useLoaderData<RadioModel[]>();
	return (
		<Layout className="flex-grow">
			<HeroSection />
			<ProductSection radios={radios} />
			<RetroExperienceSection />
			<CTASection />
			<TestimonialSection />
			<ContactForm />
		</Layout>
	);
}
