"use client";

import { Session } from "next-auth";
import { usePaginatedForm } from "~/app/_hooks/usePaginatedForm";

function SongPage({ session }: { session: Session }) {
  const {} = usePaginatedForm([]);
  return (
    <section>
      <h1>Add a song</h1>
    </section>
  );
}

export default SongPage;
