import { getServerAuthSession } from "~/server/auth";
import SearchPage from "../_components/searchform/searchPage";

async function Search() {
  const session = await getServerAuthSession();
  return <SearchPage session={session} />;
}

export default Search;
