import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
    args: {
        nomineeName: v.string(),
        field: v.string(),
        struggle: v.string(),
        contactInfo: v.string(),
    },
    handler: async (ctx, args) => {
        const nominationId = await ctx.db.insert("nominations", {
            nomineeName: args.nomineeName,
            field: args.field,
            struggle: args.struggle,
            contactInfo: args.contactInfo,
            status: "pending",
            createdAt: Date.now(),
        });

        return nominationId;
    },
});

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("nominations").order("desc").collect();
    },
});
