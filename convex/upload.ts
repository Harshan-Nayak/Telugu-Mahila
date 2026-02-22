import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
    return await ctx.storage.generateUploadUrl();
});

export const getUrl = query({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        return await ctx.storage.getUrl(args.storageId);
    },
});

export const resolveUrl = mutation({
    args: { storageId: v.id("_storage") },
    handler: async (ctx, args) => {
        // Expose a mutation version of getUrl so we can await it sequentially right after uploading
        return await ctx.storage.getUrl(args.storageId);
    },
});
