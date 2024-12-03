import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { RadioFormType, radioSchema } from "~/schema/radioFormSchema";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { Trash2 } from "lucide-react";

type RadioFormProps = {
  onSubmitForm: (data: RadioFormType, images: File[]) => void;
};

export function RadioForm({ onSubmitForm }: RadioFormProps) {
  const form = useForm<RadioFormType>({
    resolver: zodResolver(radioSchema),
    defaultValues: {
      name: "",
      price: "",
      description: "",
      features: ["", "", ""],
      caracteristics: "",
      images: [],
    },
  });

  const [images, setImages] = useState<File[]>([]);
  const [imageOrder, setImageOrder] = useState<string[]>([]);

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setImages((prev) => [...prev, ...files]);
      setImageOrder((prev) => [...prev, ...files.map((file) => file.name)]);
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
    setImages((prev) => prev.filter((img) => img.name !== imageName));
    setImageOrder((prev) => prev.filter((name) => name !== imageName));
  }

  function onSubmit(data: RadioFormType) {
    console.log(data);
    console.log("Images:", images);
    onSubmitForm(data, images);
  }

  return (
    <div className="container max-w-xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormLabel>Prix</FormLabel>
                <FormControl>
                  <Input placeholder="240 €" type="number" {...field} />
                </FormControl>
                <FormMessage />
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
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormLabel>Fonctionnalités</FormLabel>
            <div className="space-y-2">
              {[0, 1, 2].map((index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`features.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Input {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
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
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormLabel>Images</FormLabel>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="mt-2"
            />
            {images.length > 0 && (
              <DndContext
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={imageOrder}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="mt-4 space-y-2">
                    {imageOrder.map((imageName, index) => {
                      const imageFile = images.find(
                        (img) => img.name === imageName
                      );
                      return (
                        <SortableItem key={imageName} id={imageName}>
                          <div className="flex items-center space-x-4 w-full">
                            {imageFile && (
                              <img
                                src={URL.createObjectURL(imageFile)}
                                alt={imageName}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div className="flex-1">
                              <span className="flex flex-col">
                                {imageName}
                                {index === 0 && (
                                  <span className="text-sm text-green-600">
                                    (Thumbnail)
                                  </span>
                                )}
                              </span>
                            </div>
                            <Button
                              className="ml-auto"
                              type="button"
                              variant={"destructive"}
                              onClick={() => handleDelete(imageName)}
                            >
                              <Trash2 />
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
          <Button type="submit">Soumettre</Button>
        </form>
      </Form>
    </div>
  );
}
