import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const spotifyRouter = createTRPCRouter({
  search: protectedProcedure.input(z.string()).query(async ({ input }) => {
    const result = await fetch(
      `https://api.spotify.com/v1/search?q=${input}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
        },
      },
    );
    const data = await result.json();
    return data;
  }),
});
