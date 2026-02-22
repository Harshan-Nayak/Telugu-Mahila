import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    stories: defineTable({
        name: v.string(),
        field: v.string(), // The field they succeeded in
        struggle: v.string(), // Short description of obstacle
        successStory: v.string(), // Full description of their success
        imageUrl: v.optional(v.string()), // Optional single primary image (legacy)
        images: v.optional(v.array(v.string())), // Array of multiple images for the story
        isActive: v.optional(v.boolean()),
    }),
    awards: defineTable({
        title: v.string(),
        year: v.number(),
        description: v.string(),
        recipientName: v.string(),
        imageUrl: v.optional(v.string()),
    }),
    volunteers: defineTable({
        name: v.string(),
        email: v.string(),
        phone: v.optional(v.string()),
        message: v.optional(v.string()),
        status: v.string(), // e.g., 'pending', 'contacted'
        createdAt: v.number(),
    }),
    nominations: defineTable({
        nomineeName: v.string(),
        field: v.string(),
        struggle: v.string(),
        contactInfo: v.string(), // Now enforced as strictly required
        status: v.string(), // e.g., 'pending', 'reviewed', 'approved'
        createdAt: v.number(),
    }),
});
