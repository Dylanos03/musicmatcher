import { z } from "zod";

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

interface SpotifySearchResult {
  tracks: {
    items: {
      id: string;
      name: string;
      artists: {
        name: string;
      }[];
      external_urls: {
        spotify: string;
      };
      album: {
        images: {
          url: string;
        }[];
      };
    }[];
  };
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

      const data: SpotifyTokenResponse =
        (await response.json()) as SpotifyTokenResponse;

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
    const data: SpotifySearchResult =
      (await result.json()) as SpotifySearchResult;

    const returnData = data.tracks.items.map((track) => {
      return {
        id: track.id,
        name: track.name,
        artists: track.artists.map((artist) => artist.name),
        image: track.album.images[0]?.url,
        link: track.external_urls.spotify,
      };
    });
    return returnData;
  }),
});
