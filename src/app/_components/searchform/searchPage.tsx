"use client";

import { useForm } from "react-hook-form";
import PickGenre from "./genre";
import PickHashtag from "./hashtag";
import { usePaginatedForm } from "../../_hooks/usePaginatedForm";
import { api } from "~/trpc/react";
import { Session } from "next-auth";
import { useState } from "react";
import LoadingSelection from "./Loading";

export type formdata = {
  userId: string;
  hashtags: string[];
  genres: string[];
};

function SearchPage({ session }: { session: Session }) {
  const { setValue, handleSubmit } = useForm<formdata>({
    defaultValues: {
      userId: session.user.id,
      hashtags: [],
      genres: [],
    },
  });

  const { step, next, back, isFirstPage, isLastPage } = usePaginatedForm([
    <PickGenre setValue={setValue} />,
    <PickHashtag setValue={setValue} />,
  ]);
  const updatePref = api.profile.updateSearch.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
  });
  const [loading, setLoading] = useState(false);

  function submitHandler(data: formdata) {
    setLoading(true);
    console.log(data);
    updatePref.mutate(data);
  }

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background p-2 text-foreground">
      {loading && <LoadingSelection />}
      {step}
      <div className="my-4 flex w-full max-w-screen-sm justify-between">
        <button
          onClick={back}
          disabled={isFirstPage}
          className="rounded-xl border-2 bg-background px-4 py-2 text-foreground"
        >
          Back
        </button>
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

export default SearchPage;
