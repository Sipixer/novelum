import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { RadioFormType, radioSchema } from "~/schema/radioFormSchema";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { Trash2, Upload } from "lucide-react";
import { Switch } from "../ui/switch";

interface ImageFile {
  file: File | null;
  url: string;
  name: string;
}

interface RadioFormProps {
  onSubmitForm: (data: RadioFormType, images: (File | null)[]) => void;
  defaultValues?: Partial<RadioFormType> & {
    imageUrls?: string[];
  };
}

export function RadioForm({ onSubmitForm, defaultValues }: RadioFormProps) {
  const form = useForm<RadioFormType>({
    resolver: zodResolver(radioSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      features: ["", "", ""],
      caracteristics: "",
      images: [],
      public: true,
      ...defaultValues,
    },
  });

  const [images, setImages] = useState<ImageFile[]>([]);
  const [imageOrder, setImageOrder] = useState<string[]>([]);

  // Initialiser les images à partir des URLs par défaut
  useEffect(() => {
    if (defaultValues?.imageUrls) {
      const defaultImages: ImageFile[] = defaultValues.imageUrls.map((url) => ({
        file: null,
        url,
        name: url.split("/").pop() || url,
      }));
      setImages(defaultImages);
      setImageOrder(defaultImages.map((img) => img.name));
    }
  }, [defaultValues?.imageUrls]);

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      const newImages: ImageFile[] = files.map((file) => ({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      }));

      setImages((prev) => [...prev, ...newImages]);
      setImageOrder((prev) => [...prev, ...newImages.map((img) => img.name)]);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over?.id) {
      setImageOrder((prev) => {
        const oldIndex = prev.indexOf(active.id.toString());
        const newIndex = prev.indexOf(over.id.toString());
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }

  function handleDelete(imageName: string) {
    const imageToDelete = images.find((img) => img.name === imageName);
    if (imageToDelete?.file) {
      URL.revokeObjectURL(imageToDelete.url);
    }

    setImages((prev) => prev.filter((img) => img.name !== imageName));
    setImageOrder((prev) => prev.filter((name) => name !== imageName));
  }

  function onSubmit(data: RadioFormType) {
    // On envoie les images dans l'ordre défini par imageOrder
    const orderedImages = imageOrder.map(
      (name) => images.find((img) => img.name === name)?.file ?? null
    );

    onSubmitForm(data, orderedImages);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-xl mx-auto p-6 bg-white rounded-lg shadow"
      >
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder="Nom du produit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prix (en centimes)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="240 €"
                    type="number"
                    min="0"
                    step="1"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="public"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Public</FormLabel>
                  <FormDescription>
                    Rendre le produit visible par les utilisateurs
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Décrivez le produit"
                    className="min-h-[100px] resize-vertical"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <FormLabel>Fonctionnalités</FormLabel>
            {[0, 1, 2].map((index) => (
              <FormField
                key={index}
                control={form.control}
                name={`features.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={`Fonctionnalité ${index + 1}`}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          <FormField
            control={form.control}
            name="caracteristics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caractéristiques</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Décrivez les caractéristiques du produit"
                    className="min-h-[100px] resize-vertical"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <FormLabel>Images</FormLabel>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Cliquez pour upload</span>{" "}
                    ou glissez-déposez
                  </p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {images.length > 0 && (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={imageOrder}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 mt-4">
                    {imageOrder.map((imageName, index) => {
                      const imageData = images.find(
                        (img) => img.name === imageName
                      );
                      if (!imageData) return null;

                      return (
                        <SortableItem key={imageName} id={imageName}>
                          <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                            <img
                              src={imageData.url}
                              alt={imageName}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium truncate">
                                {imageName}
                              </p>
                              {index === 0 && (
                                <p className="text-sm text-green-600">
                                  Image principale
                                </p>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(imageName)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </SortableItem>
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="w-full sm:w-auto">
            Sauvegarder
          </Button>
        </div>
        <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
      </form>
    </Form>
  );
}
