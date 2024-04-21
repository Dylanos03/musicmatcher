import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
import Feed from "./_components/home/feed";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 bg-background p-2 text-foreground">
      <h1 className="text-3xl font-bold">Music Matcher</h1>

      <Link
        href={session ? "/api/auth/signout" : "/api/auth/signin"}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        {session ? "Sign out" : "Sign in"}
      </Link>
      <Feed session={session} />
      <div className="fixed bottom-8 flex w-full justify-between p-2">
        <Link
          href={"/add-song"}
          className=" rounded-2xl border-2 border-foreground bg-background px-4 py-2 text-foreground"
        >
          Post a song
        </Link>
        <Link
          href={"/search"}
          className=" rounded-2xl border-2 bg-foreground px-4 py-2 text-background "
        >
          New Search
        </Link>
      </div>
    </main>
  );
}
