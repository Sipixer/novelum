import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";

import { X } from "lucide-react";
import { type ChangeEventHandler, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ThankYouModal from "./ThankYouModal";

const BASE_PRICE = 390;
const ADDITIONAL_OPTIONS_PRICES = {
	passiveRadiator: 30,
	additionalHifiOutput: 30,
	rcaAudioInput: 30,
	magicEye: 40,
	acousticOptimization: 20,
	newButtons: 25,
	betterVarnish: 30,
	speakerBreakIn: 30,
};

const formSchema = z.object({
	additionalOptions: z.object({
		passiveRadiator: z.boolean().default(false),
		additionalHifiOutput: z.boolean().default(false),
		rcaAudioInput: z.boolean().default(false),
		fabricType: z.enum(["moderne", "classique", "vintage"]).optional(),
		magicEye: z.boolean().default(false),
		acousticOptimization: z.boolean().default(false),
		newButtons: z.boolean().default(false),
		betterVarnish: z.boolean().default(false),
		speakerBreakIn: z.boolean().default(false),
	}),
	contactInfo: z.object({
		lastName: z.string().min(2, "Le nom est requis"),
		firstName: z.string().min(2, "Le prénom est requis"),
		phone: z.string().min(10, "Numéro de téléphone invalide"),
		email: z.string().email("Email invalide"),
	}),
	remarks: z.string(),
});

export function RadioRestorationForm() {
	const [thanksOpen, setThanksOpen] = useState(false);
	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const [totalEstimation, setTotalEstimation] = useState(BASE_PRICE);

	const maxImages = 5;
	const maxSize = 5 * 1024 * 1024; // 5Mo en bytes
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			additionalOptions: {
				passiveRadiator: false,
				additionalHifiOutput: false,
				rcaAudioInput: false,
				fabricType: "moderne",
				magicEye: false,
				acousticOptimization: false,
				newButtons: false,
				betterVarnish: false,
				speakerBreakIn: false,
			},
			contactInfo: {
				lastName: "",
				firstName: "",
				phone: "",
				email: "",
			},
			remarks: "",
		},
	});
	// Fonction utilitaire pour formater les options additionnelles
	function formatAdditionalOptions(
		options: z.infer<typeof formSchema>["additionalOptions"],
	) {
		const translations: { [key: string]: string } = {
			passiveRadiator: "Radiateur passif",
			additionalHifiOutput: "Sortie Hi-Fi additionnelle",
			rcaAudioInput: "Entrée audio RCA",
			fabricType: "Type de tissu",
			magicEye: "Magic Eye",
			acousticOptimization: "Optimisation acoustique",
			newButtons: "Nouveaux boutons",
			betterVarnish: "Meilleur vernis",
			speakerBreakIn: "Rodage des enceintes",
		};

		return Object.entries(options)
			.filter(
				([_, value]) => value === true || (typeof value === "string" && value),
			)
			.map(([key, value]) => {
				if (typeof value === "string") {
					return `${translations[key]}: ${value}`;
				}
				return translations[key];
			})
			.join("\n");
	}

	// Fonction principale pour envoyer les données vers Discord
	async function sendToDiscord(
		values: z.infer<typeof formSchema>,
		selectedImages: File[],
		webhookUrl: string,
	) {
		try {
			const optionsFormatted = formatAdditionalOptions(
				values.additionalOptions,
			);

			const embedData = {
				embeds: [
					{
						title: "Nouvelle demande de devis",
						color: 0x0099ff,
						fields: [
							{
								name: "Informations de contact",
								value: `**Nom:** ${values.contactInfo.lastName}
**Prénom:** ${values.contactInfo.firstName}
**Téléphone:** ${values.contactInfo.phone}
**Email:** ${values.contactInfo.email}`,
								inline: false,
							},
							{
								name: "Options sélectionnées",
								value: optionsFormatted || "Aucune option sélectionnée",
								inline: false,
							},
							{
								name: "Remarques",
								value: values.remarks || "Aucune remarque",
								inline: false,
							},
						],
						timestamp: new Date().toISOString(),
					},
				],
			};

			// Si des images sont présentes, il faut les envoyer séparément
			if (selectedImages.length > 0) {
				const formData = new FormData();

				// Ajouter les images au FormData
				selectedImages.forEach((file, index) => {
					formData.append(`file${index}`, file);
				});

				// Ajouter les données JSON
				formData.append("payload_json", JSON.stringify(embedData));

				await fetch(webhookUrl, {
					method: "POST",
					body: formData,
				});
			} else {
				// Envoi sans images
				await fetch(webhookUrl, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(embedData),
				});
			}

			return { success: true };
		} catch (error) {
			console.error("Erreur lors de l'envoi vers Discord:", error);
			return { success: false, error };
		}
	}

	const handleImageUpload: ChangeEventHandler<HTMLInputElement> = (e) => {
		const files = e.target.files ? Array.from(e.target.files) : [];

		if (selectedImages.length + files.length > maxImages) {
			alert(`Vous ne pouvez télécharger que ${maxImages} images maximum.`);
			return;
		}

		const validFiles = files.filter((file) => {
			if (file.size > maxSize) {
				alert(`${file.name} dépasse la taille maximale de 5Mo`);
				return false;
			}
			return true;
		});

		setSelectedImages((prev) => [...prev, ...validFiles]);
	};

	const removeImage = (index: number) => {
		setSelectedImages((prev) => prev.filter((_, i) => i !== index));
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const DISCORD_WEBHOOK_URL =
			"https://discord.com/api/webhooks/1075500488310653102/Gj6JNnHhmtU-MRw2_77QaSGDmh-Bu4STGtvphAIK093_aYuKVmvw4OB4Y5CXg0W-rQAA";

		try {
			const result = await sendToDiscord(
				values,
				selectedImages,
				DISCORD_WEBHOOK_URL,
			);
			if (result.success) {
				setThanksOpen(true);
				form.reset();
				setSelectedImages([]);
			} else {
				// Afficher un message d'erreur
				alert(
					"Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer ou nous contacter directement.",
				);
			}
		} catch (error) {
			console.error("Erreur:", error);
			alert(
				"Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer ou nous contacter directement.",
			);
		}
	}

	// Observer les changements dans le formulaire pour mettre à jour l'estimation
	useEffect(() => {
		const subscription = form.watch((value) => {
			const additionalOptions = value.additionalOptions;
			let total = BASE_PRICE;

			// Calculer le total des options supplémentaires
			for (const [key, isSelected] of Object.entries(additionalOptions ?? {})) {
				if (isSelected === true && key in ADDITIONAL_OPTIONS_PRICES) {
					total +=
						ADDITIONAL_OPTIONS_PRICES[
							key as keyof typeof ADDITIONAL_OPTIONS_PRICES
						];
				}
			}

			setTotalEstimation(total);
		});

		return () => subscription.unsubscribe();
	}, [form.watch]);

	return (
		<>
			<ThankYouModal isOpen={thanksOpen} setIsOpen={setThanksOpen} />
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					<Card className="bg-white">
						<CardHeader>
							<CardTitle>
								Formulaire de demande de devis pour la restauration de radio
							</CardTitle>
							<CardDescription>
								Personnalisez votre restauration de radio
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Formule de base (détaillée et non interactive) */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold">
									Formule de base (Obligatoire)
								</h3>
								<ul className="list-disc pl-5 space-y-2">
									<li>
										Installation d'un amplificateur 50 W et d'un système
										Bluetooth 5.0 AptX
									</li>
									<li>
										Remplacement du haut-parleur d'origine par un haut-parleur
										de haute qualité « Focal » (France)
									</li>
									<li>
										Vernissage ou lustrage selon le type de radio restauré
										(bakélite ou bois) ; suppression des rayures et des faibles
										impacts
									</li>
									<li>Rétro-éclairage fonctionnant comme à l'origine</li>
									<li>
										Bouton pour le ON/OFF (d'origine en fonction du modèle de
										radio) et le réglage du volume en façade
									</li>
									<li>Livraison (envoi/retour)</li>
								</ul>
								<p className="font-semibold">
									Prix de la formule de base : 390 €
								</p>
							</div>

							<Separator />

							{/* Options supplémentaires */}
							<div>
								<h3 className="text-lg font-semibold mb-4">
									Opérations supplémentaires (Optionnelles)
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{(
										[
											{
												name: "passiveRadiator",
												label: "Radiateur passif",
												price: 30,
												description: "Augmentation mécanique des basses",
											},
											{
												name: "additionalHifiOutput",
												label: "Sortie HIFI supplémentaire",
												price: 30,
												description: "",
											},
											{
												name: "rcaAudioInput",
												label: "Entrée audio RCA",
												price: 30,
												description: "",
											},
											{
												name: "magicEye",
												label: "Œil magique fonctionnel",
												price: 40,
												description: "",
											},
											{
												name: "acousticOptimization",
												label: "Optimisation acoustique",
												price: 20,
												description: "",
											},
											{
												name: "newButtons",
												label: "Nouveaux boutons",
												price: 25,
												description: "Préférable si absents",
											},
											{
												name: "betterVarnish",
												label: "Vernis de meilleure qualité",
												price: 30,
												description: "",
											},
											{
												name: "speakerBreakIn",
												label: "Rodage haut-parleur",
												price: 30,
												description: "",
											},
										] as const
									).map((option) => (
										<FormField
											key={option.name}
											control={form.control}
											name={`additionalOptions.${option.name}`}
											render={({ field }) => (
												<button
													type="button"
													className="flex flex-row items-start space-x-3 space-y-0 text-left rounded-md border p-4 cursor-pointer hover:bg-gray-50"
													onClick={() => {
														const newValue = !field.value;
														form.setValue(
															`additionalOptions.${option.name}`,
															newValue,
															{
																shouldValidate: true,
																shouldDirty: true,
																shouldTouch: true,
															},
														);
													}}
												>
													<div
														onClick={(e) => e.stopPropagation()}
														onKeyUp={(e) => e.stopPropagation()}
													>
														<Checkbox checked={field.value} />
													</div>

													<div className="space-y-1 leading-none">
														<FormLabel>{option.label}</FormLabel>
														<FormDescription>
															{option.price} €{" "}
															{option.description && `- ${option.description}`}
														</FormDescription>
													</div>
												</button>
											)}
										/>
									))}
								</div>
							</div>

							<FormField
								control={form.control}
								name="additionalOptions.fabricType"
								render={({ field }) => (
									<FormItem className="space-y-4">
										<FormLabel className="text-lg font-medium">
											Choix du tissu
										</FormLabel>
										<RadioGroup
											onValueChange={field.onChange}
											value={field.value}
											className="grid grid-cols-1 sm:grid-cols-3 gap-4"
										>
											{[
												{
													value: "vintage",
													label: "Tissu Vintage",
													img: "/api/placeholder/200/200",
												},
												{
													value: "moderne",
													label: "Tissu Moderne",
													img: "/api/placeholder/200/200",
												},
												{
													value: "classique",
													label: "Tissu Classique",
													img: "/api/placeholder/200/200",
												},
											].map((fabric) => (
												<div key={fabric.value} className="relative">
													<label
														htmlFor={fabric.value}
														className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all
                    ${
											field.value === fabric.value
												? "border-blue-500 bg-blue-50"
												: "border-gray-200 hover:bg-gray-50"
										}`}
													>
														<RadioGroupItem
															value={fabric.value}
															id={fabric.value}
															className="sr-only"
														/>
														<img
															src={fabric.img}
															alt={fabric.label}
															className="w-full object-cover rounded"
														/>
														<span
															className={`font-medium ${
																field.value === fabric.value
																	? "text-blue-600"
																	: ""
															}`}
														>
															{fabric.label}
														</span>
													</label>
												</div>
											))}
										</RadioGroup>
									</FormItem>
								)}
							/>

							<Separator />

							{/* Upload d'images */}
							<div className="space-y-4">
								<h3 className="text-lg font-semibold">Photos de votre radio</h3>
								<FormDescription>
									Ajoutez jusqu'à 5 photos de votre radio (5Mo max par image)
								</FormDescription>

								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									<Input
										type="file"
										accept="image/*"
										multiple
										onChange={handleImageUpload}
										disabled={selectedImages.length >= maxImages}
									/>

									{selectedImages.map((file, index) => (
										<div key={`${file.name}-${index}`} className="relative">
											<img
												src={URL.createObjectURL(file)}
												alt={`Radio view ${index + 1}`}
												className="w-full h-40 object-cover rounded"
											/>
											<button
												type="button"
												onClick={() => removeImage(index)}
												className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
											>
												<X className="w-4 h-4" />
											</button>
										</div>
									))}
								</div>
							</div>

							<Separator />

							{/* Informations de contact */}
							<div>
								<h3 className="text-lg font-semibold mb-4">
									Informations de contact
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									{(
										[
											{ name: "lastName", label: "Nom" },
											{ name: "firstName", label: "Prénom" },
											{ name: "phone", label: "Téléphone" },
											{ name: "email", label: "E-mail" },
										] as const
									).map((field) => (
										<FormField
											key={field.name}
											control={form.control}
											name={`contactInfo.${field.name}`}
											render={({ field: inputField }) => (
												<FormItem>
													<FormLabel>{field.label}</FormLabel>
													<FormControl>
														<Input {...inputField} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									))}
								</div>
							</div>

							{/* Remarques */}
							<FormField
								control={form.control}
								name="remarks"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Remarques ou demandes spécifiques</FormLabel>
										<FormControl>
											<Textarea {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
								<div className="space-y-1">
									<h4 className="font-semibold text-lg">Estimation totale</h4>
									<p className="text-sm text-gray-600">
										Prix incluant les options sélectionnées
									</p>
									<p className="text-sm text-gray-600 font-bold">
										Attention, ce prix est a titre indicatif et peut varier.
									</p>
								</div>
								<div className="text-2xl font-bold text-blue-700">
									{totalEstimation} €
								</div>
							</div>
						</CardContent>
						<CardFooter>
							<Button type="submit" disabled={form.formState.isSubmitting}>
								Envoyer la demande de devis
							</Button>
						</CardFooter>
					</Card>
				</form>
			</Form>
		</>
	);
}
