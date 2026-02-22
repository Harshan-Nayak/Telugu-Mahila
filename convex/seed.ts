import { mutation } from "./_generated/server";

const demoStories = [
    {
        name: "Dr. Lakshmi Prasad",
        field: "Medicine & Rural Healthcare",
        struggle: "Childhood polio and extreme poverty in a remote village.",
        successStory: "Overcame her physical disabilities to travel to the city for medical education, facing active discrimination. She eventually established a grid of 12 free clinics across rural Andhra Pradesh offering maternal care. She single-handedly orchestrated aid during the 2018 floods.",
        imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=600&auto=format&fit=crop",
        isActive: true,
    },
    {
        name: "Sunitha Rao",
        field: "Tech Entrepreneurship",
        struggle: "Lost her job and savings during the 2008 crash while raising two children alone.",
        successStory: "Taught herself coding at midnight. She built a logistics software platform that now powers over 500 SMEs in Telangana. Her initiative now exclusively hires single mothers and offers free technical training.",
        imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
        isActive: true,
    },
    {
        name: "K. Bhavani",
        field: "Agriculture",
        struggle: "Widowed young with massive farming debts left behind by her husband.",
        successStory: "Refused to sell her land. She learned and implemented organic dry-land farming techniques. Now she trains over 3,000 farmers in drought-resistant crop cultivation, turning her village into a model of agrarian sustainability.",
        imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=600&auto=format&fit=crop",
        isActive: true,
    }
];

const demoAwards = [
    {
        title: "Telugu Mahila Lifetime Achievement Award",
        year: 2024,
        description: "Awarded for exceptional lifelong dedication to eradicating illiteracy among girls in tribal areas of the Eastern Ghats.",
        recipientName: "Smt. Vimala Devi",
        imageUrl: "https://images.unsplash.com/photo-1628191014023-eb5d45d3bc65?q=80&w=600&auto=format&fit=crop"
    },
    {
        title: "Innovator of the Year",
        year: 2025,
        description: "For developing low-cost water purification systems using local clay, benefiting hundreds of villages.",
        recipientName: "Meghana V.",
        imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=600&auto=format&fit=crop"
    }
];

export const seedData = mutation({
    args: {},
    handler: async (ctx) => {
        // Clear existing for a clean slate
        const oldStories = await ctx.db.query("stories").collect();
        for (const story of oldStories) {
            await ctx.db.delete(story._id);
        }
        const oldAwards = await ctx.db.query("awards").collect();
        for (const award of oldAwards) {
            await ctx.db.delete(award._id);
        }

        // Insert new
        for (const story of demoStories) {
            await ctx.db.insert("stories", story);
        }
        for (const award of demoAwards) {
            await ctx.db.insert("awards", award);
        }

        return "Seeding complete!";
    }
});
