import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import SongPage from "../_components/songform/songPage";

async function AddSongPage() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/api/auth/signin");
  }
  return <SongPage session={session} />;
}

export default AddSongPage;
