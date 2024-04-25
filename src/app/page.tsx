import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import Feed from "./_components/home/feed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <main className="flex min-h-screen flex-col items-center gap-4 bg-background p-2 text-foreground">
      <div className="flex w-full items-center justify-between p-4">
        <h1 className="text-3xl font-bold">Music Matcher</h1>
        <Link href={session ? "/profile" : "/api/auth/signin"}>
          {session && <FontAwesomeIcon icon={faBookmark} size={"lg"} />}
        </Link>
        <Link href={session ? "/api/auth/signout" : "/api/auth/signin"}>
          <FontAwesomeIcon
            icon={session ? faRightFromBracket : faRightToBracket}
            size={"lg"}
          />
        </Link>
      </div>

      <Feed session={session} />
      <div className="fixed bottom-8 flex w-full justify-between p-2">
        <Link
          href={session ? "/add-song" : "/api/auth/signin"}
          className=" rounded-2xl border-2 border-foreground bg-background px-4 py-2 text-foreground"
        >
          Post a song
        </Link>
        <Link
          href={session ? "/search" : "/api/auth/signin"}
          className=" rounded-2xl border-2 bg-foreground px-4 py-2 text-background "
        >
          New Search
        </Link>
      </div>
    </main>
  );
}
