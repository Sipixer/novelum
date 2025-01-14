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

import TISSU_1 from "@/assets/images/tissus/IMG_0702.jpg";
import TISSU_2 from "@/assets/images/tissus/IMG_0703.jpg";
import TISSU_3 from "@/assets/images/tissus/IMG_0705.jpg";
import TISSU_4 from "@/assets/images/tissus/IMG_0707.jpg";
import TISSU_5 from "@/assets/images/tissus/IMG_0710.jpg";
import { X } from "lucide-react";
import { type ChangeEventHandler, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ThankYouModal from "./ThankYouModal";

const RESTORATION_OPTIONS = {
	base: {
		price: 390,
		features: [
			"Installation d'un amplificateur 50 W et d'un système Bluetooth 5.0 AptX",
			"Remplacement du haut-parleur d'origine par un haut-parleur de haute qualité « Focal » (France)",
			"Vernissage ou lustrage selon le type de radio restauré (bakélite ou bois) ; suppression des rayures et des faibles impacts",
			"Rétro-éclairage fonctionnant comme à l'origine",
			"Bouton pour le ON/OFF (d'origine en fonction du modèle de radio) et le réglage du volume en façade",
			"Livraison (envoi/retour)",
		],
	},
	additional: {
		passiveRadiator: {
			label: "Radiateur passif",
			price: 30,
			description: "Augmentation mécanique des basses",
		},
		additionalHifiOutput: {
			label: "Sortie HIFI supplémentaire",
			price: 30,
			description: "",
		},
		rcaAudioInput: {
			label: "Entrée audio RCA",
			price: 30,
			description: "",
		},
		magicEye: {
			label: "Œil magique fonctionnel",
			price: 40,
			description: "",
		},
		acousticOptimization: {
			label: "Optimisation acoustique",
			price: 10,
			description: "",
		},
		newButtons: {
			label: "Nouveaux boutons",
			price: 25,
			description: "Préférable si absents",
		},
		betterVarnish: {
			label: "Vernis haute qualité",
			price: 30,
			description: "",
		},
		speakerBreakIn: {
			label: "Rodage haut-parleur",
			price: 30,
			description: "",
		},
	},
	fabric: {
		price: 30,
		options: [
			{ value: "1", img: TISSU_1 },
			{ value: "2", img: TISSU_2 },
			{ value: "3", img: TISSU_3 },
			{ value: "4", img: TISSU_4 },
			{ value: "5", img: TISSU_5 },
		],
	},
};

const formSchema = z.object({
	additionalOptions: z.object({
		passiveRadiator: z.boolean().default(false),
		additionalHifiOutput: z.boolean().default(false),
		rcaAudioInput: z.boolean().default(false),
		fabricType: z.enum(["1", "2", "3", "4", "5"]).optional(),
		magicEye: z.boolean().default(false),
		acousticOptimization: z.boolean().default(false),
		newButtons: z.boolean().default(false),
		betterVarnish: z.boolean().default(false),
		speakerBreakIn: z.boolean().default(false),
	}),
	contactInfo: z.object({
		lastName: z.string().min(2, "Le nom est requis"),
		firstName: z.string().min(2, "Le prénom est requis"),
		phone: z
			.string()
			.optional() // Rend le champ facultatif
			.refine((val) => !val || val.length >= 10, {
				message:
					"Numéro de téléphone invalide, il doit contenir au moins 10 caractères.",
			}),
		email: z.string().email("Email invalide"),
	}),
	remarks: z.string(),
});

export function RadioRestorationForm() {
	const [thanksOpen, setThanksOpen] = useState(false);
	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const [wantNewTissu, setWantNewTissu] = useState(false);

	const maxImages = 5;
	const maxSize = 5 * 1024 * 1024; // 5Mo en bytes
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			additionalOptions: {
				passiveRadiator: false,
				additionalHifiOutput: false,
				rcaAudioInput: false,
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
		const selectedOptions = Object.entries(options).filter(
			([_, value]) => value,
		);

		if (selectedOptions.length === 0) {
			return null;
		}

		const formattedOptions = selectedOptions.map(([key, _]) => {
			const option = RESTORATION_OPTIONS.additional[key];
			if (!option) return null;
			return `**${option.label}** - ${option.price} €`;
		});

		if (wantNewTissu)
			formattedOptions.push(
				`**Changement de tissu** - type ${options.fabricType} - 30 €`,
			);

		return formattedOptions.join("\n");
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
			"https://discord.com/api/webhooks/1328830663830540358/B7aoe8m8cuKeN3bfzH9TUoFr48FaMvRW_PYhNy-xtzxi3yN5C4pLbAgugCdRhc3UPulS";

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
				setWantNewTissu(false);
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

	const totalEstimation = Object.entries(form.watch().additionalOptions).reduce(
		(acc, [key, value]) => {
			const option = RESTORATION_OPTIONS.additional[key];
			if (!option) return acc;
			return acc + (value ? option.price : 0);
		},
		RESTORATION_OPTIONS.base.price + (wantNewTissu ? 30 : 0),
	);

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
									{Object.entries(RESTORATION_OPTIONS.additional).map(
										([key, option]) => (
											<FormField
												key={key}
												control={form.control}
												name={`additionalOptions.${key}`}
												render={({ field }) => (
													<button
														type="button"
														className="flex flex-row items-start space-x-3 space-y-0 text-left rounded-md border p-4 cursor-pointer hover:bg-gray-50"
														onClick={() => {
															const newValue = !field.value;
															form.setValue(
																`additionalOptions.${key}`,
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
																{option.description &&
																	`- ${option.description}`}
															</FormDescription>
														</div>
													</button>
												)}
											/>
										),
									)}
								</div>
							</div>
							<button
								type="button"
								className="flex flex-row items-start space-x-3 space-y-0 text-left rounded-md border p-4 cursor-pointer hover:bg-gray-50"
								onClick={() => {
									setWantNewTissu((prev) => !prev);
									//remove selected fabric type if the user unchecks the checkbox
									if (!wantNewTissu) {
										form.setValue("additionalOptions.fabricType", undefined);
									}
								}}
							>
								<div
									onClick={(e) => e.stopPropagation()}
									onKeyUp={(e) => e.stopPropagation()}
								>
									<Checkbox checked={wantNewTissu} />
								</div>

								<div className="space-y-1 leading-none">
									<FormLabel>Changement du tissu</FormLabel>
									<FormDescription>
										30 € - Choisissez parmi nos tissus
									</FormDescription>
								</div>
							</button>

							{wantNewTissu && (
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
												className="grid grid-cols-1 sm:grid-cols-5 gap-4"
											>
												{[
													{
														value: "1",
														img: TISSU_1,
													},
													{
														value: "2",
														img: TISSU_2,
													},
													{
														value: "3",
														img: TISSU_3,
													},
													{
														value: "4",
														img: TISSU_4,
													},
													{
														value: "5",
														img: TISSU_5,
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
																alt={`Tissu ${fabric.value}`}
																className="w-full max-h-64 object-contain rounded"
															/>
														</label>
													</div>
												))}
											</RadioGroup>
										</FormItem>
									)}
								/>
							)}

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
