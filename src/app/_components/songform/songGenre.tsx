import { api } from "~/trpc/react";
import { SFormWrapper } from "./sformwrapper";
import { useState } from "react";
import { type UseFormSetValue } from "react-hook-form";

import { type formdataS } from "./songPage";

function GenreBtn({
  genre,
  handleGenreClick,
  selected,
}: {
  genre: string;
  handleGenreClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      onClick={() => handleGenreClick()}
      className={
        "rounded-xl border-2 border-foreground p-2 text-sm  lg:text-lg " +
        (selected
          ? " bg-foreground text-background"
          : " bg-background text-foreground")
      }
    >
      {genre}
    </button>
  );
}

function PickSongGenre({ setValue }: { setValue: UseFormSetValue<formdataS> }) {
  const genres = api.genres.getAll.useQuery();
  const [genreSelection, setGenreSelection] = useState<string>();

  function genreClickHandler(genre: string) {
    setGenreSelection(genre);
    setValue("genre", genre);
  }
  return (
    <SFormWrapper title={"Pick your genres"}>
      <div className="flex max-w-screen-sm flex-wrap justify-center gap-2">
        {genres?.data?.map((genre) => (
          <GenreBtn
            key={genre.name}
            genre={genre.name}
            handleGenreClick={() => genreClickHandler(genre.name)}
            selected={genreSelection === genre.name}
          />
        ))}
      </div>
    </SFormWrapper>
  );
}
export default PickSongGenre;
