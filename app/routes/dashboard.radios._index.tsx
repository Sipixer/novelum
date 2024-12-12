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
import { radioTable } from "src/db/schema";
import { Button } from "~/components/ui/button";

export const loader: LoaderFunction = async ({ context }) => {
  const env = context.cloudflare.env as Env;
  const db = drizzle(env.DB);
  const radios = await db.select().from(radioTable);
  console.log(radios);
  return Response.json(radios);
};
type RadioModel = InferSelectModel<typeof radioTable>;
export default function RadioTable() {
  const radios = useLoaderData<RadioModel[]>();
  return (
    <div>
      <div className="container mx-auto p-4">
        <div className="my-4 w-full flex justify-end">
          <Link to="/dashboard/radios/create">
            <Button>Add a new radio</Button>
          </Link>
        </div>
        <Table>
          <TableCaption>A basic table of products</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">
                Description
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {radios.map((radio) => {
              //get image with JSON PARSE but need to be catched
              let image = "";
              try {
                image = JSON.parse(radio.images || "")[0];
              } catch (error) {
                console.log(error);
              }
              console.log(image);
              return (
                <TableRow key={radio.id}>
                  <TableCell>
                    <img
                      src={image}
                      alt={radio.name || "Radio Vintage"}
                      width={50}
                      height={50}
                      className="rounded-md"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{radio.name}</TableCell>
                  <TableCell>
                    ${radio.price ? (radio.price / 100).toFixed(2) : "0.00"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {radio.description}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
