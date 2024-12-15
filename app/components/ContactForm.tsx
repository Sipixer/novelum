import { useForm } from "react-hook-form";
import { contactFormSchema, ContactFormType } from "~/schema/contactFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useLocation } from "@remix-run/react";
import { toast } from "sonner";
import { useState } from "react";

export const ContactForm = () => {
  const form = useForm<ContactFormType>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const location = useLocation();
  async function onSubmit(values: ContactFormType) {
    const promise = fetch("/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...values, location: location.pathname }),
    });
    toast.promise(promise, {
      loading: "Envoi du message...",
      success: "Votre message a bien été envoyé.",
      error: (error) => `Erreur lors de l'envoi du message: ${error}`,
    });
    promise
      .then(() => {
        form.reset();
        alert("Votre message a bien été envoyé.");
      })
      .catch(() => {
        alert(
          "Erreur lors de l'envoi du message. \n Veuillez réessayer plus tard."
        );
      });
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="bonjour@mail.fr" {...field} />
                </FormControl>
                <FormDescription>
                  L&apos;email qui nous permettra de vous répondre.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Votre message" rows={6} {...field} />
                </FormControl>
                <FormDescription>
                  N&apos;hésitez pas à nous poser toutes vos questions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={form.formState.isSubmitting}>
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};
