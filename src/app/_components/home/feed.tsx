"use client";

import { type Session } from "next-auth";
import { api } from "~/trpc/react";
import { type Genre, type Hashtag, type User } from "@prisma/client";
import Image from "next/image";

type SongCard = {
  artist: string[];
  artwork: string;
  songName: string;
  url: string;
  genre: Genre;
  hashtags: Hashtag[];
  createdBy: User;
};

function SongFeature({ feature }: { feature: Genre | Hashtag }) {
  return (
    <div
      className={
        "rounded-xl border-2 border-foreground bg-background p-1  text-xs  text-foreground lg:text-lg"
      }
    >
      {feature.name}
    </div>
  );
}

function SongCardFeed({ song }: { song: SongCard }) {
  return (
    <div className="flex max-w-full flex-col gap-2 rounded-2xl border-2 border-foreground p-3">
      <div className="flex gap-2">
        <Image src={song.artwork} height={75} width={75} alt={song.songName} />
        <div className="flex flex-col ">
          <h3 className="text-ellipsis whitespace-nowrap text-nowrap text-lg font-bold">
            {song.songName}
          </h3>
          <p>{song.artist}</p>
          <span className="text-sm italic">
            Posted by: @{song.createdBy.name}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <SongFeature feature={song.genre} />
        </div>
        <div className="flex gap-1">
          {song.hashtags.map((hashtag) => (
            <SongFeature
              key={hashtag.name + " " + song.songName + " " + song.artist[0]}
              feature={hashtag}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Feed({ session }: { session: Session | null }) {
  const feed = api.post.getAllByPref.useQuery(session?.user?.id ?? "");

  return (
    <section className="flex w-full flex-col gap-4">
      {feed.data?.map((Song) => {
        if (Song) {
          return <SongCardFeed key={Song.url} song={Song}></SongCardFeed>;
        }
        return null;
      })}
    </section>
  );
}

export default Feed;
