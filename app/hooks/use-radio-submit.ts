import { toast } from 'sonner';
import { RadioFormType } from '~/schema/radioFormSchema';
import { useNavigate } from '@remix-run/react';

type ImageSubmitData = {
    base64?: string;
    isExisting: boolean;
    url?: string;
};

type SubmitOptions = {
    mode: 'create' | 'edit';
    radioId?: number;
    existingImages?: string[];
};

export const useRadioHandler = () => {
    const navigate = useNavigate();

    const convertImageToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
        });
    };

    const processImages = async (
        images: (File | null)[],
        existingImages: string[] = []
    ): Promise<ImageSubmitData[]> => {
        return Promise.all(
            images.map(async (image, index): Promise<ImageSubmitData> => {
                if (!image) {
                    // C'est une image existante du CDN
                    return {
                        isExisting: true,
                        url: existingImages[index]
                    };
                }
                // C'est une nouvelle image
                const base64 = await convertImageToBase64(image);
                return {
                    base64,
                    isExisting: false
                };
            })
        );
    };

    const handleSubmit = async (
        data: RadioFormType,
        images: (File | null)[],
        options: SubmitOptions = { mode: 'create' }
    ) => {
        try {
            const processedImages = await processImages(images, options.existingImages);

            const submitData = {
                ...data,
                images: processedImages
            };

            const url = options.mode === 'edit'
                ? `/dashboard/radios/${options.radioId}/edit`
                : "/dashboard/radios/create";

            const promise = fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submitData),
            });

            toast.promise(promise, {
                loading: options.mode === 'edit' ? "Mise à jour..." : "Création...",
                success: options.mode === 'edit'
                    ? "Radio mise à jour avec succès !"
                    : "Radio créée avec succès !",
                error: (error) => `Erreur: ${error.message || 'Une erreur est survenue'}`
            });

            const response = await promise;

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            navigate("/dashboard/radios");
        } catch (error) {
            console.error("Error submitting radio data:", error);
        }
    };

    return { handleSubmit };
};