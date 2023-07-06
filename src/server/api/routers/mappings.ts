import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const mappingRouter = createTRPCRouter({
  createTwitterAccount: publicProcedure
    .input(z.object({ accountId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.twitterAccount.create({ data: { accountId: input.accountId } });
    }),
  createThreadAccount: publicProcedure
    .input(z.object({ accountId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return ctx.prisma.threadAccount.create({ data: { accountId: input.accountId } });
    }),
  getAllMappings: publicProcedure.query(async ({ ctx }) => {
    const [mappings, allTwits, allThreaders] = await Promise.all([
      ctx.prisma.twitterThreadMap.findMany(),
      ctx.prisma.twitterAccount.findMany(),
      ctx.prisma.threadAccount.findMany()
    ]);

    const twits = new Map(allTwits.map(twit => [twit.accountId, twit]))
    const threaders = new Map(allThreaders.map(threader => [threader.accountId, threader]))
    return {
      mappings: mappings.map(mapping => ({
        ...mapping,
        twitterAccount: twits.get(mapping.twitterAccountId),
        threadAccount: threaders.get(mapping.threadAccountId),
      })),
    }
  }),
  getAllAccounts: publicProcedure.query(async ({ ctx }) => {
    return {
      twitterAccounts: await ctx.prisma.twitterAccount.findMany(),
      threadAccounts: await ctx.prisma.threadAccount.findMany(),
    }
  }),
});
