import { SignedIn, SignedOut, SignInButton } from "@clerk/remix";
import { Outlet } from "@remix-run/react";

export default function DahboardAuth() {
  return (
    <>
      <SignedIn>
        <Outlet />
      </SignedIn>
      <SignedOut>
        <p>You are signed out</p>

        <SignInButton />
      </SignedOut>
    </>
  );
}
