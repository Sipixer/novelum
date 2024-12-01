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

export const ContactForm = () => {
  const form = useForm<ContactFormType>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      email: "",
      message: "",
    },
  });

  const location = useLocation();
  function onSubmit(values: ContactFormType) {
    console.log(
      "form submitted from",
      location.pathname,
      "with values",
      values
    );
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
                  <Textarea placeholder="Votre message" {...field} />
                </FormControl>
                <FormDescription>
                  N&apos;hésitez pas à nous poser toutes vos questions.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};
