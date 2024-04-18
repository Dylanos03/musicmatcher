import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export type searchRes = {
  tracks: {
    items: Track[];
  };
};

type Track = {
  name: string;
};

export default async function Home() {
  const session = await getServerAuthSession();
  const data: searchRes = await api.spotify.search("Never Gonna Give You Up");

  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center gap-4 p-2">
      <h1 className="text-3xl font-bold">Music Matcher</h1>
      {data &&
        data.tracks.items.map((track) => {
          return <div>{track.name}</div>;
        })}
    </main>
  );
}
