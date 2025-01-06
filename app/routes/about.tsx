import JeremyImg from "@/assets/images/IMG_9740.jpg";
import HeroImage from "@/assets/images/IMG_9746.jpg";
import DemontageImg from "@/assets/images/about/demontage.png";
import ModernisationImg from "@/assets/images/about/modernisation.png";
import RenovationImg from "@/assets/images/about/renovation.png";
import RobinImg from "@/assets/images/about/robin.jpg";
import TestImg from "@/assets/images/about/test.png";
import { ContactForm } from "~/components/ContactForm";
import { Layout } from "~/components/Layout";
import { RestaurationCarousel } from "~/components/RestaurationCarousel";

import type { MetaFunction } from "@remix-run/cloudflare";
import { motion } from "framer-motion";
import { InfoRestaurationSection } from "~/components/InfoRestaurationSection";
import { IntroSection } from "~/components/IntroSection";

export const meta: MetaFunction = () => {
	return [
		{ title: "À Propos de Novelum - Artisanat et Passion" },
		{
			name: "description",
			content:
				"Rencontrez l'équipe derrière Novelum et explorez notre processus de restauration unique, où l'artisanat traditionnel rencontre l'innovation technologique.",
		},
		{
			property: "og:title",
			content: "À Propos de Novelum - Artisanat et Passion",
		},
		{
			property: "og:description",
			content:
				"Rencontrez l'équipe derrière Novelum et explorez notre processus de restauration unique, où l'artisanat traditionnel rencontre l'innovation technologique.",
		},
		{ property: "og:type", content: "website" },
		{ name: "twitter:card", content: "summary_large_image" },
		{
			name: "twitter:title",
			content: "À Propos de Novelum - Artisanat et Passion",
		},
		{
			name: "twitter:description",
			content:
				"Rencontrez l'équipe derrière Novelum et explorez notre processus de restauration unique, où l'artisanat traditionnel rencontre l'innovation technologique.",
		},
	];
};

export default function About() {
	return (
		<Layout>
			<div className="min-h-screen bg-stone-100 pb-40">
				<div className="container mx-auto px-10">
					<IntroSection
						title="  Nos différentes étapes de restauration"
						description="Chaque radio est restaurée à la main par nos soins. \n En alliant
                savoir-faire traditionnel et technologies modernes, nous
                redonnons vie à ces pièces uniques."
						// imageSrc={HeroImage}
						className="pt-14"
					/>
					<RestaurationCarousel />
					<div className="flex flex-col gap-8">
						<InfoRestaurationSection
							title="1. Démontage et nettoyage"
							description="Nous démontons soigneusement chaque composant de la radio pour un nettoyage approfondi."
							imageSrc={DemontageImg}
							linkText="Explorer nos radios"
							reversed
						/>
						<InfoRestaurationSection
							title="2. Restauration"
							description="Le boitier et les composants sont minutieusement restaurés pour retrouver leur aspect d'origine."
							imageSrc={RenovationImg}
							linkText="Explorer nos radios"
						/>
						<InfoRestaurationSection
							title="3. Modernisation"
							description="Nous intégrons les nouvelles technologies pour une expérience d'écoute unique."
							imageSrc={ModernisationImg}
							linkText="Explorer nos radios"
							reversed
						/>
						<InfoRestaurationSection
							title="4. Test et contrôle qualité"
							description="Chaque radio est testée et contrôlée pour garantir un fonctionnement optimal."
							imageSrc={TestImg}
							linkText="Explorer nos radios"
						/>
					</div>
					<hr className="my-12 border-stone-300" />
					<div className="space-y-16 px-6 sm:px-8 md:px-12 lg:px-20 py-12">
						{/* Section principale */}
						<IntroSection
							title="Une Passion Commune"
							description="Nous sommes Robin et Jérémy, deux frères du Lot. Grâce à
                  nos compétences complémentaires, nous restaurons vos appareils
                  pour leur offrir une nouvelle jeunesse, mêlant authenticité et
                  modernité."
							// imageSrc={JeremyImg}
						/>
						{/* Section secondaire */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
							{/* Bloc Jérémy */}
							<motion.div
								className="flex flex-col items-center md:items-start"
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, margin: "-50px" }}
								variants={{
									hidden: { opacity: 0, y: 50 },
									visible: {
										opacity: 1,
										y: 0,
										transition: { duration: 0.6, ease: "easeOut" },
									},
								}}
							>
								<img
									src={JeremyImg}
									alt="Jeremy Larnaudie"
									className="rounded-lg shadow-lg max-h-[600px] w-full object-cover"
								/>
								<h4 className="text-xl sm:text-2xl font-bold text-stone-800 mt-8 mb-4">
									Jérémy : Ebéniste-restaurateur
								</h4>
								<p className="text-base sm:text-lg text-stone-600 leading-relaxed text-center md:text-left">
									Je suis Jérémy, ébéniste restaurateur spécialisé dans la
									restauration de mobilier ancien. Mon travail chez Novelum
									consiste à redonner vie aux caisses en bois en réparant,
									nettoyant et sublimant leur apparence. Chaque pièce est
									restaurée avec soin pour préserver son authenticité et son
									histoire.
								</p>
							</motion.div>

							{/* Bloc Robin */}
							<motion.div
								className="flex flex-col items-center md:items-start"
								initial="hidden"
								whileInView="visible"
								viewport={{ once: true, margin: "-50px" }}
								variants={{
									hidden: { opacity: 0, y: 50 },
									visible: {
										opacity: 1,
										y: 0,
										transition: { duration: 0.6, ease: "easeOut", delay: 0.2 },
									},
								}}
							>
								<img
									src={RobinImg}
									alt="Robin Larnaudie"
									className="rounded-lg shadow-lg max-h-[600px] w-full object-cover"
								/>
								<h4 className="text-xl sm:text-2xl font-bold text-stone-800 mt-8 mb-4">
									Robin : Artisan de la modernisation électronique
								</h4>
								<p className="text-base sm:text-lg text-stone-600 leading-relaxed text-center md:text-left">
									Moi, c’est Robin. Passionné d’électronique, j’assure la
									modernisation des radios. Mon travail, intégrer les nouvelles
									technologies d’amplification et de Bluetooth et optimiser le
									rendu sonore.
									<br />
									Recherchant l’équilibre parfait entre rétro et modernité.
								</p>
							</motion.div>
						</div>
					</div>
				</div>
			</div>

			<ContactForm />
		</Layout>
	);
}
