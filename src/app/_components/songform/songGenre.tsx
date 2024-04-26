import { api } from "~/trpc/react";
import { SFormWrapper } from "./sformwrapper";
import { useState } from "react";
import { type UseFormSetValue } from "react-hook-form";

import { type formdataS } from "./songPage";

function GenreBtn({
  genre,
  handleGenreClick,
}: {
  genre: string;
  handleGenreClick: (e: boolean, f: string) => boolean;
}) {
  const [selected, setSelected] = useState(false);
  function handleClick() {
    const response = handleGenreClick(!selected, genre);
    setSelected(response);
  }

  return (
    <button
      onClick={handleClick}
      className={
        "rounded-xl border-2 border-foreground p-2 text-sm  lg:text-lg " +
        (selected
          ? " bg-foreground text-background"
          : " bg-background text-foreground")
      }
    >
      {`#${genre}`}
    </button>
  );
}

function PickSongGenre({ setValue }: { setValue: UseFormSetValue<formdataS> }) {
  const genres = api.genres.getAll.useQuery();
  const [genreSelection, setGenreSelection] = useState<string[]>([]);

  function genreClickHandler(e: boolean, f: string) {
    if (e) {
      if (genreSelection.length > 1) {
        return false;
      }
      setGenreSelection((prevSelection) => {
        const newSelection = [...prevSelection, f];
        setValue("genre", newSelection);
        return newSelection;
      });
      return true;
    } else {
      setGenreSelection((prevSelection) => {
        const newSelection = prevSelection.filter((genre) => genre !== f);
        setValue("genre", newSelection);
        return newSelection;
      });
      return false;
    }
  }
  return (
    <SFormWrapper title={"What Genre?"} amount={2}>
      <div className="flex max-w-screen-sm flex-wrap justify-center gap-2">
        {genres?.data?.map((genre) => (
          <GenreBtn
            key={genre.name}
            genre={genre.name}
            handleGenreClick={genreClickHandler}
          />
        ))}
      </div>
    </SFormWrapper>
  );
}
export default PickSongGenre;
