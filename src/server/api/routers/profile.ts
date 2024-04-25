import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  updateSearch: publicProcedure
    .input(
      z.object({
        genres: z.array(z.string()),
        hashtags: z.array(z.string()),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        include: { genres: true, hashtags: true },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const hashtags = [];
      const genres = [];
      for (const genre of input.genres) {
        const foundgenre = await ctx.db.genre.findFirst({
          where: { name: genre },
        });
        if (foundgenre) {
          genres.push(foundgenre);
        }
      }
      for (const hashtag of input.hashtags) {
        const foundHashtag = await ctx.db.hashtag.findFirst({
          where: { name: hashtag },
        });
        if (foundHashtag) {
          hashtags.push(foundHashtag);
        }
      }

      await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          genres: {
            disconnect: user.genres,
            connect: genres,
          },
          hashtags: {
            disconnect: user.hashtags,
            connect: hashtags,
          },
        },
      });
    }),
  savePost: publicProcedure
    .input(z.object({ postId: z.number(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          savedPosts: {
            connect: { id: input.postId },
          },
        },
      });
    }),
  isPostSaved: publicProcedure
    .input(z.object({ postId: z.number(), userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        include: { savedPosts: true },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const savedPost = user.savedPosts.find(
        (post) => post.id === input.postId,
      );
      return !!savedPost;
    }),
  unsavePost: publicProcedure
    .input(z.object({ postId: z.number(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: { id: input.userId },
        data: {
          savedPosts: {
            disconnect: { id: input.postId },
          },
        },
      });
    }),
});
