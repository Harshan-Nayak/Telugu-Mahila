"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function StoryArticlePage() {
    const params = useParams();
    const storyId = params.id as string;

    const story = useQuery(api.stories.getStory, { id: storyId as Id<"stories"> });

    if (story === undefined) {
        return (
            <div className="min-h-screen bg-white">
                <div className="animate-pulse w-full h-[300px] md:h-[500px] bg-muted"></div>
                <div className="container mx-auto max-w-4xl px-4 py-12">
                    <div className="h-4 bg-muted w-24 mb-6 rounded"></div>
                    <div className="h-10 bg-muted w-3/4 mb-8 rounded"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-muted w-full rounded"></div>
                        <div className="h-4 bg-muted w-full rounded"></div>
                        <div className="h-4 bg-muted w-2/3 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (story === null) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <h1 className="text-4xl font-bold mb-4">Story Not Found</h1>
                <p className="text-muted-foreground mb-8">The story you are looking for doesn't exist or has been removed.</p>
                <Button asChild>
                    <Link href="/stories">Browse All Stories</Link>
                </Button>
            </div>
        );
    }

    return (
        <article className="min-h-screen bg-white pb-20">
            {/* Hero Section */}
            <div className="relative w-full h-[40vh] md:h-[60vh] bg-muted flex items-center justify-center overflow-hidden">
                {story.imageUrl ? (
                    <>
                        <img
                            src={story.imageUrl}
                            alt={story.name}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40"></div>
                    </>
                ) : (
                    <div className="absolute inset-0 bg-primary/5 flex items-center justify-center">
                        <span className="text-6xl md:text-9xl font-black text-primary/10 uppercase">{story.name.charAt(0)}</span>
                    </div>
                )}

                <div className="relative z-10 container mx-auto px-4 w-full max-w-4xl pt-[80px] group">
                    <Link href="/stories" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors shadow-black drop-shadow-md">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Stories
                    </Link>
                    <div className="pt-8">
                        <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-bold tracking-wider uppercase rounded-full mb-4 shadow-sm">
                            {story.field}
                        </div>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-md leading-tight break-words">
                            {story.name}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="container mx-auto max-w-4xl px-4 py-12 md:py-16">

                {/* Intro / Struggle Section */}
                <div className="bg-muted/30 border-l-4 border-primary p-6 md:p-8 rounded-r-2xl mb-12">
                    {/* <h2 className="text-xl font-semibold mb-3 text-foreground tracking-tight">The Obstacle</h2> */}
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed italic break-words">
                        "{story.struggle}"
                    </p>
                </div>

                {/* Full Article Text */}
                <div className="prose prose-lg md:prose-xl prose-gray max-w-none mb-16 break-words">
                    {story.successStory.split('\n').map((paragraph, index) => (
                        paragraph.trim() ? (
                            <p key={index} className="mb-6 leading-relaxed text-gray-800 break-words">
                                {paragraph}
                            </p>
                        ) : null
                    ))}
                </div>

                {/* Additional Images Gallery */}
                {story.images && story.images.length > 0 && (
                    <div className="mt-16 pt-12 border-t">
                        <h3 className="text-2xl font-bold mb-8">Story Gallery</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {story.images.map((imgUrl, index) => (
                                <a
                                    href={imgUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    key={index}
                                    className="group aspect-square rounded-2xl overflow-hidden bg-muted shadow-sm hover:shadow-md transition-all cursor-zoom-in block"
                                >
                                    <img
                                        src={imgUrl}
                                        alt={`Gallery ${index + 1}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </article>
    );
}
