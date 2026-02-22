import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("awards").collect();
    },
});

export const addAward = mutation({
    args: {
        title: v.string(),
        year: v.number(),
        description: v.string(),
        recipientName: v.string(),
        imageUrl: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("awards", {
            title: args.title,
            year: args.year,
            description: args.description,
            recipientName: args.recipientName,
            imageUrl: args.imageUrl,
        });
    },
});
