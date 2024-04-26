import { api } from "~/trpc/react";
import { SFormWrapper } from "./sformwrapper";
import { useState } from "react";
import { type UseFormSetValue } from "react-hook-form";

import { type formdataS } from "./songPage";

function HashBtn({
  genre,
  handleHashtagClick,
}: {
  genre: string;
  handleHashtagClick: (e: boolean, f: string) => boolean;
}) {
  const [selected, setSelected] = useState(false);
  function handleClick() {
    const response = handleHashtagClick(!selected, genre);
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

function PickSongHashtag({
  setValue,
}: {
  setValue: UseFormSetValue<formdataS>;
}) {
  const hashtags = api.hashtag.getAll.useQuery();
  const [HashtagSelection, setHashtagSelection] = useState<string[]>([]);

  function hashtagClickHandler(e: boolean, f: string) {
    if (e) {
      if (HashtagSelection.length > 3) {
        return false;
      }
      setHashtagSelection((prevSelection) => {
        const newSelection = [...prevSelection, f];
        setValue("hashtag", newSelection);
        return newSelection;
      });
      return true;
    } else {
      setHashtagSelection((prevSelection) => {
        const newSelection = prevSelection.filter((genre) => genre !== f);
        setValue("hashtag", newSelection);
        return newSelection;
      });
      return false;
    }
  }
  return (
    <SFormWrapper title={"Describe the song"} amount={4}>
      <div className="flex max-w-screen-sm flex-wrap justify-center gap-2">
        {hashtags?.data?.map((hashtags) => (
          <HashBtn
            key={hashtags.name}
            genre={hashtags.name}
            handleHashtagClick={(e, f) => hashtagClickHandler(e, f)}
          />
        ))}
      </div>
    </SFormWrapper>
  );
}
export default PickSongHashtag;
