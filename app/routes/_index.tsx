import type { ActionFunctionArgs, MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { drizzle } from "drizzle-orm/d1";
import { usersTable } from "src/db/schema";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { env } = context.cloudflare;
  const db = drizzle(env.DB);
  const result = await db.select().from(usersTable).all();
  return Response.json(result);
};

export default function Index() {
  const results = useLoaderData<typeof loader>();
  const onButtonClick = async () => {
    // do a post request to the action function
    const response = await fetch("/count", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ route: "/_action" }),
    });
    const text = await response.text();
    console.log(text);
  };
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        <header className="flex flex-col items-center gap-9">
          <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Welcome ffto <span className="sr-only">Remix</span>
          </h1>
          <button onClick={onButtonClick} className="btn">
            Click me
          </button>
          <pre className="text-sm text-gray-600 dark:text-gray-300">
            {JSON.stringify(results, null, 2)}
          </pre>
          <div className="h-[144px] w-[434px]">
            <img
              src="/logo-light.png"
              alt="Remix"
              className="block w-full dark:hidden"
            />
            <img
              src="/logo-dark.png"
              alt="Remix"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
        <nav className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-gray-200 p-6 dark:border-gray-700">
          <p className="leading-6 text-gray-700 dark:text-gray-200">
            What&apos;s next?
          </p>
        </nav>
      </div>
    </div>
  );
}
