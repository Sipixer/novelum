import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoaderFunction } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { InferSelectModel } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { contactFormTable, radioTable } from "src/db/schema";
import { Button } from "~/components/ui/button";

export const loader: LoaderFunction = async ({ context }) => {
  const env = context.cloudflare.env as Env;
  const db = drizzle(env.DB);
  const contactFormMessages = await db.select().from(contactFormTable);
  return Response.json(contactFormMessages);
};
type ContactFormMessage = InferSelectModel<typeof contactFormTable>;
export default function RadioTable() {
  const contactFormMessage = useLoaderData<ContactFormMessage[]>();
  return (
    <div>
      <div className="container mx-auto p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactFormMessage.map((message) => {
              return (
                <TableRow key={message.id}>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>{message.message}</TableCell>
                  <TableCell>{message.location}</TableCell>
                  <TableCell>{message.created_at}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
