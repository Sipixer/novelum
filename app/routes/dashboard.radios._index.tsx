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
import { Lock, PencilLine, Trash } from "lucide-react";
import { radioTable } from "src/db/schema";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

export const loader: LoaderFunction = async ({ context }) => {
  const env = context.cloudflare.env as Env;
  const db = drizzle(env.DB);
  const radios = await db.select().from(radioTable);
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
            <Button>Créer une radio</Button>
          </Link>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Public</TableHead>
              <TableHead>Sold At</TableHead>
              <TableHead className="hidden md:table-cell">
                Description
              </TableHead>
              <TableHead>Actions</TableHead>
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
                  <TableCell>
                    <Badge variant={radio.public ? "default" : "destructive"}>
                      {radio.public ? "Public" : "Privée"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={radio.is_sold ? "destructive" : "default"}>
                      {radio.is_sold ? "Vendue" : "Disponible"}
                    </Badge>
                    {radio.is_sold && (
                      <span className="text-xs text-gray-500 block">
                        {Intl.DateTimeFormat("fr-FR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(new Date(radio.sold_at || ""))}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {radio.description}
                  </TableCell>
                  <TableCell>
                    <Link to={`/dashboard/radios/${radio.id}/edit`}>
                      <Button variant={"outline"}>
                        <PencilLine />
                      </Button>
                    </Link>
                    <Button
                      variant={"destructive"}
                      className="ml-2"
                      onClick={() => {
                        alert("Not implemented yet");
                      }}
                    >
                      <Trash />
                    </Button>
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
