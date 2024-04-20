import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import SongPage from "../_components/songform/songPage";

async function AddSongPage() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-2 text-foreground">
      <SongPage session={session} />
    </main>
  );
}

export default AddSongPage;
