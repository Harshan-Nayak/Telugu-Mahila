"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function StoriesPage() {
    const stories = useQuery(api.stories.listAllActive);

    return (
        <div className="container mx-auto px-4 py-16 max-w-screen-xl">
            <div className="mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Their Stories</h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                    Discover the incredible journeys of endurance, triumph, and success. Every narrative here represents a woman who faced significant obstacles and emerged victorious in her respective field.
                </p>
            </div>

            {stories === undefined ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse flex flex-col gap-4">
                            <div className="bg-muted aspect-video rounded-xl"></div>
                            <div className="h-6 bg-muted rounded w-1/4"></div>
                            <div className="h-8 bg-muted rounded w-3/4"></div>
                            <div className="h-20 bg-muted rounded w-full"></div>
                        </div>
                    ))}
                </div>
            ) : stories.length === 0 ? (
                <div className="py-20 text-center bg-muted/30 rounded-2xl border border-dashed">
                    <h3 className="text-2xl font-medium mb-2">No Stories Yet</h3>
                    <p className="text-muted-foreground">Stories are currently being collected and will appear here soon.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stories.map((story: any) => (
                        <Card key={story._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border group flex flex-col">
                            <div className="aspect-video relative bg-secondary/10 flex items-center justify-center overflow-hidden">
                                {story.imageUrl ? (
                                    <img
                                        src={story.imageUrl}
                                        alt={story.name}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <span className="text-4xl text-primary/30 font-bold uppercase">{story.name.charAt(0)}</span>
                                )}
                            </div>
                            <CardHeader>
                                <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{story.field}</div>
                                <CardTitle className="text-xl md:text-2xl break-words">{story.name}</CardTitle>
                                <CardDescription className="text-sm mt-3 line-clamp-3 break-all">
                                    {story.struggle}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-muted-foreground line-clamp-4 text-sm leading-relaxed break-all">
                                    {story.successStory}
                                </p>
                            </CardContent>
                            <CardFooter className="pt-4 pb-6 bg-muted/20 border-t">
                                <Link href={`/stories/${story._id}`} className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors flex items-center">
                                    Read Full Journey <span className="ml-2">&rarr;</span>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
