import type { LoaderFunction } from "@remix-run/cloudflare";
import { type MetaFunction, useLoaderData } from "@remix-run/react";
import { ContactForm } from "~/components/ContactForm";
import { Layout } from "~/components/Layout";
import { RadioRestorationForm } from "~/components/RadioRestorationForm";

export const meta: MetaFunction = () => {
	return [
		{
			title: "Modernisation de Radio - Demande de Devis | Novelum",
		},
		{
			name: "description",
			content:
				"Vous souhaitez moderniser votre radio vintage ? Demandez un devis pour moderniser votre radio et profiter de fonctionnalités modernes.",
		},
	];
};

export const loader: LoaderFunction = async ({ context, params, request }) => {
	return Response.json({
		discordDevisWebhook: context.cloudflare.env.DISCORD_DEVIS_WEBHOOK,
	});
};

export default function Moderniser() {
	const { discordDevisWebhook } = useLoaderData<{
		discordDevisWebhook: string;
	}>();
	return (
		<Layout>
			<main className="container mx-auto py-10">
				<h1 className="text-3xl font-bold mb-6 text-center">
					Modernisation de Radio - Demande de Devis
				</h1>
				{discordDevisWebhook ? (
					<RadioRestorationForm webhookUrl={discordDevisWebhook} />
				) : (
					<ContactForm />
				)}
			</main>
		</Layout>
	);
}
