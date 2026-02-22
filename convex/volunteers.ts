import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const register = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        message: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const volunteerId = await ctx.db.insert("volunteers", {
            name: args.name,
            email: args.email,
            phone: args.phone,
            message: args.message,
            status: "pending",
            createdAt: Date.now(),
        });

        return volunteerId;
    },
});

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("volunteers").order("desc").collect();
    },
});
