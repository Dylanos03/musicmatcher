import { getServerAuthSession } from "~/server/auth";
import SearchPage from "../_components/searchform/searchPage";
import { redirect } from "next/navigation";

async function Search() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/");
  }
  return <SearchPage session={session} />;
}

export default Search;
