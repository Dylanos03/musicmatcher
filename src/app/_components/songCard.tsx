"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faBookmarkSolid } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { type Genre, type Hashtag, type User } from "@prisma/client";
import Image from "next/image";
import { type Session } from "next-auth";
import { api } from "~/trpc/react";
import SavedPostPUp from "./savedpopup";

type SongCard = {
  id: number;
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

export default function SongCardFeed({
  song,
  index,
  session,
}: {
  song: SongCard;
  index: number;
  session: Session | null;
}) {
  const [saved, setSaved] = useState<boolean>();
  const [savedPopUp, setSavedPopUp] = useState<boolean>(false);
  const savePost = api.profile.savePost.useMutation({
    onSuccess: () => {
      isSaved.refetch().catch((err) => console.error(err));
      setSavedPopUp(true);
      setTimeout(() => {
        setSavedPopUp(false);
      }, 2000);
    },
  });
  const unSavePost = api.profile.unsavePost.useMutation({
    onSuccess: () => {
      isSaved.refetch().catch((err) => console.error(err));
    },
  });
  const isSaved = api.profile.isPostSaved.useQuery({
    postId: song.id,
    userId: session?.user.id ?? "",
  });
  useEffect(() => {
    if (isSaved.data !== undefined && isSaved.data !== null) {
      if (isSaved.data === true && saved === undefined) {
        setSaved(true);
      }
      if (isSaved.data === true && saved === false) {
        unSavePost.mutate({ postId: song.id, userId: session?.user.id ?? "" });
      }
      if (isSaved.data === false && saved === true) {
        savePost.mutate({ postId: song.id, userId: session?.user.id ?? "" });
      }
    }
  }, [saved, isSaved.data]);
  return (
    <div
      style={{
        animationDelay: `${index * 0.15}s`,
        animationFillMode: "backwards",
      }}
      className={`animate-fade-in-bottom flex max-w-full flex-col gap-2 rounded-2xl border-2 border-foreground p-3 `}
    >
      {savedPopUp && <SavedPostPUp />}
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
        {session && (
          <div className="flex w-1/5 justify-end p-2">
            <FontAwesomeIcon
              onClick={() => setSaved(!saved)}
              icon={saved ? faBookmarkSolid : faBookmark}
              size={"lg"}
            />
          </div>
        )}
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
