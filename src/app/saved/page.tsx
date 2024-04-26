import { faBackward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import SavedFeed from "../_components/saved/sFeed";

async function SavedPage() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <main className="flex min-h-screen flex-col items-center gap-4 bg-background p-2 text-foreground lg:max-w-sm">
      <div className="flex w-full items-center justify-between p-4">
        <Link href={"/"}>
          <FontAwesomeIcon icon={faBackward} size={"lg"} />
        </Link>
        <h1 className="text-3xl font-bold">Music Matcher</h1>
      </div>
      <SavedFeed session={session} />
    </main>
  );
}

export default SavedPage;
