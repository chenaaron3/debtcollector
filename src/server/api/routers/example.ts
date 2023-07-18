import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { LeetCode, type UserProfile } from "leetcode-query";

const users = ["apkirito", "Palak45"]

export const exampleRouter = createTRPCRouter({
  getUserProfiles: publicProcedure
    .query(async () => {
      const leetcode = new LeetCode();
      const promises: Promise<UserProfile>[] = [];
      users.forEach(user => {
        promises.push(leetcode.user(user))
      })
      const profiles = await Promise.all(promises);
      return {
        profiles: profiles
      }
    }),
});
