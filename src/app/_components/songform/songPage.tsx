"use client";

import { Session } from "next-auth";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { usePaginatedForm } from "~/app/_hooks/usePaginatedForm";
import SpotifySearch from "./spotifysearch";
import PickSongGenre from "./songGenre";
import PickSongHashtag from "./songHashtag";
import { api } from "~/trpc/react";
import { useState } from "react";
import LoadingPost from "./LoadingPost";

export type formdataS = {
  songName: string;
  artists: string[];
  art: string;
  genre: string;
  hashtag: string[];
  postedBy: string;
  href: string;
};

function SongPage({ session }: { session: Session }) {
  const { handleSubmit, setValue } = useForm<formdataS>({
    defaultValues: {
      songName: "",
      artists: [],
      art: "",
      genre: "",
      hashtag: [],
      postedBy: session.user.id,
    },
  });
  const { step, isFirstPage, isLastPage, next, back } = usePaginatedForm([
    <SpotifySearch key={"spotify"} setValue={setValue} />,
    <PickSongGenre key={"genre"} setValue={setValue} />,
    <PickSongHashtag key={"hashtag"} setValue={setValue} />,
  ]);
  const { mutate } = api.post.create.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
  });
  const [loading, setLoading] = useState(false);
  const submitHandler = (data: formdataS) => {
    setValue("postedBy", session.user.id);
    setLoading(true);

    mutate(data);
  };
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-2 text-foreground">
      {loading && <LoadingPost />}
      {step}
      <div className="my-4 flex w-full max-w-screen-sm justify-between">
        {isFirstPage ? (
          <Link
            className="rounded-xl border-2 bg-background px-4 py-2 text-foreground"
            href={"/"}
          >
            Back
          </Link>
        ) : (
          <button
            onClick={back}
            disabled={isFirstPage}
            className="rounded-xl border-2 bg-background px-4 py-2 text-foreground"
          >
            Back
          </button>
        )}
        <button
          onClick={isLastPage ? handleSubmit(submitHandler) : next}
          className="rounded-xl bg-foreground px-4 py-2 text-background"
        >
          {isLastPage ? "Submit" : "Next"}
        </button>
      </div>
    </main>
  );
}

export default SongPage;
