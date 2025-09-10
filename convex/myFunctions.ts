import { ConvexError, v } from 'convex/values';
import { query, mutation, action } from './_generated/server';
import { api } from './_generated/api';

export const listNumbers = query({
  args: {
    count: v.number(),
  },

  handler: async (ctx, args) => {
    const numbers = await ctx.db
      .query('numbers')
      // Ordered by _creationTime, return most recent
      .order('desc')
      .take(args.count);
    return {
      viewer: (await ctx.auth.getUserIdentity())?.subject ?? null,
      numbers: numbers.reverse().map((number) => number.value),
    };
  },
});

export const addNumber = mutation({
  args: {
    value: v.number(),
  },

  handler: async (ctx, args) => {
    const id = await ctx.db.insert('numbers', { value: args.value });

    console.log('Added new document with id:', id);
  },
});

// You can fetch data from and send data to third-party APIs via an action:
export const myAction = action({
  // Validators for arguments.
  args: {
    first: v.number(),
    second: v.string(),
  },

  handler: async (ctx, args) => {
    const data = await ctx.runQuery(api.myFunctions.listNumbers, {
      count: 10,
    });
    console.log(data);

    await ctx.runMutation(api.myFunctions.addNumber, {
      value: args.first,
    });
  },
});

export const getUserOrThrow = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError('getUserOrThrow ran while Convex deployment did not have a valid JWT');
    return user.subject;
  },
});
