"use client";

import { Session } from "next-auth";
import { api } from "~/trpc/react";
import LoadingDots from "../LoadingDots";
import SongCardFeed from "../songCard";

function SavedFeed({ session }: { session: Session }) {
  const feed = api.post.getSavedPosts.useQuery(session.user.id);
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
              session={session}
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

export default SavedFeed;
