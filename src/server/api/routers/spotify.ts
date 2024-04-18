import { z } from "zod";
import { searchRes } from "~/app/page";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

export const spotifyRouter = createTRPCRouter({
  search: publicProcedure.input(z.string()).query(async ({ input }) => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_SECRET;
    async function refreshAccessToken() {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(clientId + ":" + clientSecret).toString("base64"),
        },
        body: "grant_type=client_credentials",
      });

      const data: SpotifyTokenResponse = await response.json();
      console.log(data);
      return data.access_token;
    }

    // Use the refreshed access token
    // Use the refreshed access token
    const accessToken: unknown = await refreshAccessToken();
    if (typeof accessToken === "string") {
      process.env.SPOTIFY_ACCESS_TOKEN = accessToken;
    } else {
      throw new Error("Access token is not a string");
    }
    const result = await fetch(
      `https://api.spotify.com/v1/search?q=${input}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
        },
      },
    );
    const data: searchRes = await result.json();
    return data;
  }),
});
