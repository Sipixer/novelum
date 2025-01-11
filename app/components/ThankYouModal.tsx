import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

export default function ThankYouModal({
	isOpen,
	setIsOpen,
}: {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
}) {
	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Merci pour votre demande de devis</DialogTitle>
					<DialogDescription>
						Nous vous remercions pour votre demande de devis concernant la
						modernisation de votre radio.
					</DialogDescription>
				</DialogHeader>
				<div className="py-4">
					<p>Nous vous répondrons dans les plus brefs délais.</p>
					<p className="mt-2">
						Pour toute question, n'hésitez pas à nous contacter à :
					</p>
					<a
						className="font-semibold mt-1"
						href="mailto:novelum.radio@gmail.com"
						aria-label="Envoyer un email à Novelum"
					>
						novelum.radio@gmail.com
					</a>
				</div>
				<div className="text-sm text-center mt-4">
					Cordialement,
					<br />
					L'équipe Nouvelum
				</div>
			</DialogContent>
		</Dialog>
	);
}
