import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listAllActive = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("stories")
            .filter((q) => q.eq(q.field("isActive"), true))
            .order("desc")
            .collect();
    },
});

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("stories").order("desc").collect();
    },
});

export const addStory = mutation({
    args: {
        name: v.string(),
        field: v.string(),
        struggle: v.string(),
        successStory: v.string(),
        imageUrl: v.optional(v.string()),
        images: v.optional(v.array(v.string())),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("stories", {
            name: args.name,
            field: args.field,
            struggle: args.struggle,
            successStory: args.successStory,
            imageUrl: args.imageUrl,
            images: args.images,
            isActive: args.isActive !== undefined ? args.isActive : true, // Defaulting newly added stories to active
        });
    },
});

export const updateStory = mutation({
    args: {
        id: v.id("stories"),
        name: v.optional(v.string()),
        field: v.optional(v.string()),
        struggle: v.optional(v.string()),
        successStory: v.optional(v.string()),
        imageUrl: v.optional(v.string()),
        images: v.optional(v.array(v.string())),
        isActive: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        return await ctx.db.patch(id, updates);
    },
});

export const deleteStory = mutation({
    args: {
        id: v.id("stories"),
    },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.id);
    },
});

export const getStory = query({
    args: { id: v.id("stories") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    }
});
