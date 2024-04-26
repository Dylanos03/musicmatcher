import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        songName: z.string(),
        artists: z.array(z.string()),
        art: z.string(),
        genre: z.array(z.string()),
        hashtag: z.array(z.string()),
        postedBy: z.string(),
        href: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input.postedBy,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }

      const hashtags = [];
      const genres = [];

      for (const genre of input.genre) {
        const foundgenres = await ctx.db.genre.findFirst({
          where: { name: genre },
        });

        if (!foundgenres) {
          throw new Error("Genre not found");
        }
        genres.push(foundgenres);
      }

      for (const hashtag of input.hashtag) {
        const foundHashtag = await ctx.db.hashtag.findFirst({
          where: { name: hashtag },
        });
        if (!foundHashtag) {
          throw new Error("Hashtag not found");
        }
        hashtags.push(foundHashtag);
      }

      return await ctx.db.post.create({
        data: {
          songName: input.songName,
          artist: input.artists,
          artwork: input.art,

          hashtags: {
            connect: hashtags,
          },
          genre: {
            connect: genres,
          },
          createdBy: {
            connect: user,
          },
          url: input.href,
        },
      });
    }),

  getAllByPref: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input,
        },
        include: {
          genres: true,
          hashtags: true,
        },
      });

      if (!user) {
        return await ctx.db.post.findMany({
          include: {
            genre: true,
            createdBy: true,
            hashtags: true,
          },
        });
      }

      const posts = await ctx.db.post.findMany({
        where: {
          AND: [
            {
              genre: {
                some: {
                  id: {
                    in: user.genres.map((genre) => genre.id),
                  },
                },
              },
            },
            {
              hashtags: {
                some: {
                  id: {
                    in: user.hashtags.map((hashtag) => hashtag.id),
                  },
                },
              },
            },
          ],
        },
        include: {
          genre: true,
          createdBy: true,
          hashtags: true,
        },
      });

      return posts.slice(0, 9);
    }),
  getSavedPosts: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: {
          id: input,
        },
        include: {
          savedPosts: {
            include: {
              genre: true,
              createdBy: true,
              hashtags: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user.savedPosts;
    }),
});
