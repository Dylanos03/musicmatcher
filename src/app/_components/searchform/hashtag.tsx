import { api } from "~/trpc/react";
import { FormWrapper } from "./formwrapper";
import { useState } from "react";
import { type UseFormSetValue } from "react-hook-form";
import { type formdata } from "~/app/_components/searchform/searchPage";

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
        "rounded-xl border-2 border-foreground bg-background p-2 text-sm text-foreground lg:text-lg" +
        (selected ? " bg-foreground text-background" : "")
      }
    >
      {`#${genre}`}
    </button>
  );
}

function PickHashtag({ setValue }: { setValue: UseFormSetValue<formdata> }) {
  const hashtags = api.hashtag.getAll.useQuery();
  const [HashtagSelection, setHashtagSelection] = useState<string[]>([]);

  function hashtagClickHandler(e: boolean, f: string) {
    if (e) {
      setHashtagSelection((prevSelection) => {
        const newSelection = [...prevSelection, f];
        setValue("hashtags", newSelection);
        return newSelection;
      });
      return true;
    } else {
      setHashtagSelection((prevSelection) => {
        const newSelection = prevSelection.filter((genre) => genre !== f);
        setValue("hashtags", newSelection);
        return newSelection;
      });
      return false;
    }
  }
  return (
    <FormWrapper amount={5} title={"Pick your mood"}>
      <div className="flex max-w-screen-sm flex-wrap justify-center gap-2">
        {hashtags?.data?.map((hashtags) => (
          <HashBtn
            key={hashtags.name}
            genre={hashtags.name}
            handleHashtagClick={(e, f) => hashtagClickHandler(e, f)}
          />
        ))}
      </div>
    </FormWrapper>
  );
}
export default PickHashtag;
