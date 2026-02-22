"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AwardsPage() {
    const awards = useQuery(api.awards.listAll);

    return (
        <div className="container mx-auto px-4 py-16 max-w-screen-xl">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-bold mb-4 text-primary">Recognizing Excellence</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Through our annual awards, Telugu Mahila honors the exceptional resilience and achievements of women across various domains. These distinctions celebrate the extraordinary paths forged against all odds.
                </p>
            </div>

            {awards === undefined ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[1, 2].map((i) => (
                        <div key={i} className="animate-pulse flex items-start gap-6 p-6 border rounded-xl">
                            <div className="w-24 h-32 bg-muted rounded shrink-0"></div>
                            <div className="flex-1 space-y-4">
                                <div className="h-6 bg-muted rounded w-1/3"></div>
                                <div className="h-4 bg-muted rounded w-1/4"></div>
                                <div className="h-16 bg-muted rounded w-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : awards.length === 0 ? (
                <div className="py-24 text-center bg-secondary/5 rounded-2xl border border-secondary/20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/20 text-secondary mb-4 drop-shadow-sm">
                        <span className="text-2xl">🏆</span>
                    </div>
                    <h3 className="text-2xl font-medium mb-2 text-foreground">Awards Announcing Soon</h3>
                    <p className="text-muted-foreground">Nominations are currently under review for this year's recognitions.</p>
                </div>
            ) : (
                <div className="space-y-8 max-w-4xl mx-auto">
                    {awards.map((award: any) => (
                        <Card key={award._id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow border-muted flex flex-col md:flex-row">
                            <div className="md:w-1/3 relative bg-secondary/10 flex items-center justify-center min-h-[200px]">
                                {award.imageUrl ? (
                                    <img
                                        src={award.imageUrl}
                                        alt={award.title}
                                        className="object-cover w-full h-full"
                                    />
                                ) : (
                                    <div className="text-center p-6">
                                        <span className="text-4xl block mb-2">⭐</span>
                                        <span className="text-sm font-semibold text-primary uppercase tracking-widest">{award.year}</span>
                                    </div>
                                )}
                            </div>
                            <div className="md:w-2/3 flex flex-col justify-center p-2">
                                <CardHeader>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-2 py-1 rounded">Award</span>
                                        <span className="text-sm font-medium text-muted-foreground">{award.year}</span>
                                    </div>
                                    <CardTitle className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-primary">{award.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-base md:text-lg font-medium text-foreground mb-4">
                                        Honoree: <span className="font-bold border-b border-primary/30 pb-1">{award.recipientName}</span>
                                    </p>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {award.description}
                                    </p>
                                </CardContent>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
