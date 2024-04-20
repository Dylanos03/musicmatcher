import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-svh flex-col items-center gap-4 bg-background p-2 text-foreground">
      <h1 className="text-3xl font-bold">Music Matcher</h1>
      <p className="text-center">
        {session ? (
          <>Welcome, {session.user.name}! You are now authenticated.</>
        ) : (
          <>You are not authenticated.</>
        )}
      </p>
      <Link
        href={session ? "/api/auth/signout" : "/api/auth/signin"}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        {session ? "Sign out" : "Sign in"}
      </Link>
    </main>
  );
}
