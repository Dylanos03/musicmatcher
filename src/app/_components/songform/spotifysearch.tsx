"use client";

import { type UseFormSetValue } from "react-hook-form";
import { type formdataS } from "./songPage";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import Image from "next/image";

function SongCard({
  name,
  artist,
  selected,
  image,
  clickHandler,
}: {
  name: string;
  artist: string[];
  selected: boolean;
  image: string;
  clickHandler: () => void;
}) {
  return (
    <div onClick={clickHandler} className="flex w-full justify-between">
      <div className="flex w-full gap-2">
        <Image src={image} alt={name} height={100} width={100} />
        <div className="flex w-1/2 flex-shrink flex-grow flex-col">
          <h2 className="overflow-hidden overflow-ellipsis whitespace-nowrap text-lg font-bold">
            {name}
          </h2>
          <h3 className="overflow-hidden overflow-ellipsis whitespace-nowrap">
            {artist.length === 1
              ? artist[0]
              : artist.map((name) => name + ", ")}
          </h3>
        </div>
      </div>

      <span
        className={`m-4 flex h-4 w-4 border-2 border-foreground ${selected && "bg-foreground"}`}
      ></span>
    </div>
  );
}

function SpotifySearch({ setValue }: { setValue: UseFormSetValue<formdataS> }) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSong, setSelectedSong] = useState("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [search]);

  const handleSelect = (
    songName: string,
    songId: string,
    songArtists: string[],
    songImage: string,
    songHref: string,
  ) => {
    setSelectedSong(songId);
    setValue("songName", songName);
    setValue("artists", songArtists);
    setValue("art", songImage);
    setValue("href", songHref);
  };

  const spotifySearch = api.spotify.search.useQuery(debouncedSearch);

  return (
    <section className="flex w-full flex-col items-center gap-2 p-2 sm:max-w-sm">
      <h1 className="text-xl font-bold">Search for a song</h1>
      <input
        type="text"
        value={search}
        placeholder="Enter song name..."
        className="w-full rounded-2xl bg-foreground p-2 text-background focus:outline-none sm:max-w-sm"
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="flex max-h-96 w-full flex-col gap-2 overflow-y-auto overflow-x-hidden">
        {spotifySearch?.data?.map((song) => {
          return (
            <SongCard
              key={song.id}
              clickHandler={() =>
                handleSelect(
                  song.name,
                  song.id,
                  song.artists,
                  song.image ?? "",
                  song.link,
                )
              }
              selected={selectedSong === song.id}
              image={song.image ?? ""}
              artist={song.artists}
              name={song.name}
            />
          );
        })}
      </div>
    </section>
  );
}

export default SpotifySearch;
