"use client";

import { type Session } from "next-auth";
import { api } from "~/trpc/react";
import { type Genre, type Hashtag, type User } from "@prisma/client";
import Image from "next/image";
import LoadingDots from "../LoadingDots";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

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
        "rounded-xl border-2 border-foreground bg-background px-2 py-1 text-xs text-foreground lg:text-sm"
      }
    >
      {feature.name}
    </div>
  );
}

function SongCardFeed({ song, index }: { song: SongCard; index: number }) {
  const [saved, setSaved] = useState(false);
  return (
    <div
      style={{
        animationDelay: `${index * 0.15}s`,
        animationFillMode: "backwards",
      }}
      className={`animate-fade-in-bottom flex max-w-full flex-col gap-2 rounded-2xl border-2 border-foreground p-3 `}
    >
      <div className="flex w-full gap-2">
        <Image
          src={song.artwork}
          height={75}
          width={75}
          alt={song.songName}
          className="aspect-square w-1/5"
        />
        <div className="flex w-3/5 flex-shrink flex-grow flex-col">
          <Link
            className="w-full cursor-pointer"
            href={song.url}
            target="_blank"
          >
            <h3 className="overflow-hidden overflow-ellipsis whitespace-nowrap text-lg font-bold underline">
              {song.songName}
            </h3>
          </Link>
          <p className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {song.artist}
          </p>
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap text-sm italic">
            Posted by: @{song.createdBy.name}
          </span>
        </div>
        <div className="flex w-1/5 justify-end p-2">
          <FontAwesomeIcon
            onClick={() => setSaved(!saved)}
            icon={saved ? faBookmarkSolid : faBookmark}
            size={"lg"}
          />
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
    <section
      className={`flex min-h-screen w-full flex-col  gap-4 lg:max-w-sm ${feed.isLoading && "justify-center"}`}
    >
      {feed.isLoading && (
        <div className="flex flex-col items-center justify-center gap-2 italic">
          <span>Fetching Your Songs</span>
          <LoadingDots />
        </div>
      )}
      {feed.data?.map((Song, index) => {
        if (Song) {
          return (
            <SongCardFeed
              index={index}
              key={Song.url}
              song={Song}
            ></SongCardFeed>
          );
        }
        return null;
      })}
    </section>
  );
}

export default Feed;
