import { Link, useNavigate } from "@remix-run/react";
import type { InferSelectModel } from "drizzle-orm";
import { motion } from "framer-motion";
import { useState } from "react";
import type { radioTable } from "src/db/schema";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
			delayChildren: 0.3,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export function RadioDisplay({
	radio,
	sessionUrl,
}: {
	radio: InferSelectModel<typeof radioTable>;
	sessionUrl?: string;
}) {
	const images = JSON.parse(radio.images || "[]") as string[];
	const [selectedImage, setSelectedImage] = useState(images[0]);

	const features = JSON.parse(radio.features || "[]") as string[];

	return (
		<motion.div
			initial="hidden"
			animate="show"
			variants={container}
			className="container mx-auto px-4 pb-8 pt-16"
		>
			<div className="grid gap-8 md:grid-cols-2">
				<div className="space-y-4">
					<motion.div
						variants={item}
						className="relative overflow-hidden rounded-lg"
					>
						<img
							src={selectedImage}
							alt="Radio Siera vintage"
							className="object-cover"
						/>
					</motion.div>
					<motion.div
						variants={item}
						className="grid grid-cols-4 gap-2 overflow-x-auto max-w-full"
					>
						{images.map((src, i) => (
							<div
								onClick={() => setSelectedImage(src)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										setSelectedImage(src);
									}
								}}
								role="button"
								tabIndex={0}
								key={i}
								className="relative aspect-square overflow-hidden rounded-lg"
							>
								<img src={src} alt={`Vue ${i + 1}`} className="object-cover" />
							</div>
						))}
					</motion.div>
				</div>

				<motion.div variants={item} className="space-y-6">
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<h1 className="text-4xl font-bold">{radio.name}</h1>
							<span className="text-3xl font-bold">
								{Intl.NumberFormat("fr-FR", {
									style: "currency",
									currency: "EUR",
								}).format((radio.price || 0) / 100)}
							</span>
						</div>
						<p className="text-xl text-muted-foreground">
							{features.join(" / ")}
						</p>
					</div>

					<p className="text-lg">{radio.description}</p>

					<Card className="border-green-200 bg-green-50">
						<CardContent className="p-4 text-green-800">
							Livraison en 3 - 4 semaines partout en France
						</CardContent>
					</Card>
					{radio.is_sold || !sessionUrl ? (
						<Button
							disabled
							size="lg"
							variant={"outline"}
							className="w-full text-lg"
						>
							RUPTURE DE STOCK
						</Button>
					) : (
						<Link to={sessionUrl} className="block text-accent underline">
							<Button size="lg" className="w-full text-lg">
								ACHETER MAINTENANT
							</Button>
						</Link>
					)}

					<div className="space-y-4">
						<h2 className="text-2xl font-semibold">Caracteristique</h2>
						<p className="text-muted-foreground whitespace-pre-line">
							{radio.caracteristics}
						</p>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
}
