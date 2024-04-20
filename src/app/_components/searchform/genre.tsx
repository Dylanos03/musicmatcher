import { api } from "~/trpc/react";
import { FormWrapper } from "./formwrapper";
import { useState } from "react";
import { type UseFormSetValue } from "react-hook-form";
import { type formdata } from "~/app/_components/searchform/searchPage";

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
        "rounded-xl  p-2 text-sm  lg:text-lg " +
        (selected
          ? " bg-foreground text-background"
          : "border-2 border-foreground bg-background text-foreground")
      }
    >
      {genre}
    </button>
  );
}

function PickGenre({ setValue }: { setValue: UseFormSetValue<formdata> }) {
  const genres = api.genres.getAll.useQuery();
  const [genreSelection, setGenreSelection] = useState<string[]>([]);

  function genreClickHandler(e: boolean, f: string) {
    if (e) {
      if (genreSelection.length > 1) {
        return false;
      }
      setGenreSelection((prevSelection) => {
        const newSelection = [...prevSelection, f];
        setValue("genres", newSelection);
        return newSelection;
      });
      return true;
    } else {
      setGenreSelection((prevSelection) => {
        const newSelection = prevSelection.filter((genre) => genre !== f);
        setValue("genres", newSelection);
        return newSelection;
      });
      return false;
    }
  }
  return (
    <FormWrapper amount={2} title={"Pick your genres"}>
      <div className="flex max-w-screen-sm flex-wrap justify-center gap-2">
        {genres?.data?.map((genre) => (
          <GenreBtn
            key={genre.name}
            genre={genre.name}
            handleGenreClick={(e, f) => genreClickHandler(e, f)}
          />
        ))}
      </div>
    </FormWrapper>
  );
}
export default PickGenre;
