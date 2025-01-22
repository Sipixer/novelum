import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import type { HTMLAttributes } from "react";
import { Button } from "./ui/button";

export const IntroSection = ({
	title,
	description,
	imageSrc,
	cta,
	...props
}: {
	title: string;
	description: string;
	imageSrc?: string; // imageSrc est maintenant optionnel
	cta?: boolean;
} & HTMLAttributes<HTMLDivElement>) => {
	return (
		<motion.div
			className={`grid grid-cols-1  gap-12 items-center min-h-96 ${
				imageSrc ? "md:grid-cols-2" : ""
			} ${props.className}`}
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
			<div
				className={`flex flex-col gap-6 ${
					imageSrc ? "text-left" : "text-center"
				}`}
			>
				<motion.h3
					className="text-2xl sm:text-3xl font-bold text-stone-800 italic "
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: {
							opacity: 1,
							y: 0,
							transition: { delay: 0.2, duration: 0.6 },
						},
					}}
				>
					{title.split("\\n").map((line, index) => (
						<span key={line}>
							{line}
							<br />
						</span>
					))}
				</motion.h3>
				<motion.p
					className="text-base sm:text-lg text-stone-600 leading-relaxed whitespace-pres"
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: {
							opacity: 1,
							y: 0,
							transition: { delay: 0.4, duration: 0.6 },
						},
					}}
				>
					{description.split("\\n").map((line, index) => (
						<span key={line}>
							{line}
							<br />
						</span>
					))}
				</motion.p>
				{cta && (
					<div className="mt-3">
						<Link to="/moderniser">
							<Button>Moderniser votre radio</Button>
						</Link>
					</div>
				)}
			</div>
			{imageSrc && (
				<motion.div
					className="h-full"
					variants={{
						hidden: { opacity: 0, scale: 0.9 },
						visible: {
							opacity: 1,
							scale: 1,
							transition: { delay: 0.6, duration: 0.6 },
						},
					}}
				>
					<img
						src={imageSrc}
						alt={`Section d'introduction - ${title}`}
						className="rounded-lg shadow-lg max-h-[600px] mx-auto object-cover"
					/>
				</motion.div>
			)}
		</motion.div>
	);
};
