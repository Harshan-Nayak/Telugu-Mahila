"use client";

import { useState, useEffect } from "react";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

const HERO_IMAGES = [
  "/unwatermarked_Gemini_Generated_Image_6268ic6268ic6268.png",
  "/unwatermarked_Gemini_Generated_Image_df2sj8df2sj8df2s.png",
  "/unwatermarked_Gemini_Generated_Image_xmz4o9xmz4o9xmz4.png",
];

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const stories = useQuery(api.stories.listAllActive) || [];

  // Get top 3 for featured
  const featuredStories = stories.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-white py-10 md:py-16 px-4 overflow-hidden min-h-[calc(100vh-80px)] flex items-center">
        <div className="container mx-auto max-w-screen-xl">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-8 items-center">
            {/* Left Column - Text */}
            <div className="text-left w-full max-w-2xl md:pr-4 lg:pr-12">
              <h1 className="text-4xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem] font-black tracking-tight mb-5 text-foreground leading-[1.1] md:leading-[1.05]">
                <span className="block mb-1">Celebrating</span>
                <span className="block mb-1">the <span className="text-primary">Strength</span></span>
                <span className="block mb-1">of Telugu</span>
                <span className="block">Women</span>
              </h1>
              <p className="text-base md:text-lg text-foreground mb-8 leading-relaxed font-medium max-w-[500px]">
                Recognizing, awarding, and supporting those who have succeeded in various fields after facing immense struggles and obstacles. Their journey is our inspiration.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm md:text-base rounded-xl px-6 md:px-8 h-12" asChild>
                  <Link href="/stories">Read Their Stories</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/5 font-semibold text-sm md:text-base rounded-xl px-6 md:px-8 h-12 bg-transparent shadow-none" asChild>
                  <Link href="/support">Get Involved</Link>
                </Button>
              </div>
            </div>

            {/* Right Column - Image Stack */}
            <div className="relative w-full h-[350px] md:h-[450px] lg:h-[550px] flex items-center justify-center mt-10 md:mt-0">
              <div className="relative w-full max-w-[280px] md:max-w-[340px] lg:max-w-[420px] aspect-[4/4.5]">
                {/* Layer 3 (Back) */}
                <div className="absolute inset-0 bg-muted translate-x-8 -translate-y-6 md:translate-x-16 md:-translate-y-12 shadow-sm rounded-[25px] overflow-hidden">
                  <img src={HERO_IMAGES[(currentImageIndex + 2) % HERO_IMAGES.length]} alt="Telugu Woman - Background 2" className="object-cover w-full h-full opacity-60 grayscale hover:grayscale-0 transition-all duration-700 ease-in-out" />
                </div>

                {/* Layer 2 (Middle) */}
                <div className="absolute inset-0 bg-muted translate-x-4 -translate-y-3 md:translate-x-8 md:-translate-y-6 shadow-md rounded-[25px] overflow-hidden">
                  <img src={HERO_IMAGES[(currentImageIndex + 1) % HERO_IMAGES.length]} alt="Telugu Woman - Background 1" className="object-cover w-full h-full opacity-80 grayscale hover:grayscale-0 transition-all duration-700 ease-in-out" />
                </div>

                {/* Layer 1 (Front) */}
                <div className="absolute inset-0 bg-muted shadow-2xl border-[12px] border-white z-10 rounded-[25px] overflow-hidden">
                  <img key={currentImageIndex} src={HERO_IMAGES[currentImageIndex]} alt="Telugu Woman - Front" className="object-cover w-full h-full animate-in fade-in duration-700" />
                </div>

                {/* Carousel controls beneath */}
                <div className="absolute -bottom-16 md:-bottom-20 left-0 right-0 flex items-center justify-between text-muted-foreground/40 md:translate-x-8 md:-translate-y-6 px-4 md:px-0">
                  <button onClick={() => setCurrentImageIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length)} className="p-2 hover:text-primary transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                  </button>
                  <div className="flex gap-3">
                    {HERO_IMAGES.map((_, idx) => (
                      <div
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-3 h-3 rounded-full shadow-sm transition-all cursor-pointer ${idx === currentImageIndex ? 'bg-primary scale-110' : 'bg-primary/20 hover:bg-primary/40'}`}
                      ></div>
                    ))}
                  </div>
                  <button onClick={() => setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length)} className="p-2 hover:text-primary transition-colors cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stories Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-screen-xl">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-xl">
              <h2 className="text-3xl font-bold mb-4">Inspiring Journeys</h2>
              <p className="text-muted-foreground">
                Discover the remarkable stories of Telugu women who shattered glass ceilings and triumphed over adversity.
              </p>
            </div>
            <div className="hidden md:block">
              <Button variant="ghost" asChild>
                <Link href="/stories">View All Stories &rarr;</Link>
              </Button>
            </div>
          </div>

          {featuredStories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
              <p>Stories are being curated. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredStories.map((story: any) => (
                <Card key={story._id} className="overflow-hidden hover:shadow-lg transition-shadow border-muted">
                  <div className="aspect-video relative bg-muted flex items-center justify-center overflow-hidden">
                    {story.imageUrl ? (
                      <img
                        src={story.imageUrl}
                        alt={story.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-4xl text-muted-foreground/30">TM</span>
                    )}
                  </div>
                  <CardHeader>
                    <div className="text-sm font-semibold text-primary mb-2 uppercase tracking-wider">{story.field}</div>
                    <CardTitle className="text-xl">{story.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">{story.struggle}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Link href={`/stories/${story._id}`} className="text-sm font-medium text-primary hover:underline">
                      Read full story
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/stories">View All Stories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Impact/Mission Section */}
      <section className="py-20 px-4 bg-white border-t border-b">
        <div className="container mx-auto max-w-screen-xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Telugu Mahila was established with a singular vision: to ensure that the silent struggles of our women do not go unnoticed, and their resounding successes are celebrated.
                </p>
                <p>
                  We believe that behind every successful woman is a story of resilience, sacrifice, and an unbreakable spirit. By bringing these stories into the light, we hope to inspire the next generation to dream bigger and fight harder.
                </p>
                <p>
                  Through our annual recognitions, support networks, and community outreach, we are building an ecosystem of empowerment.
                </p>
              </div>
              <Button className="mt-8" variant="secondary" asChild>
                <Link href="/awards">Explore Our Awards</Link>
              </Button>
            </div>
            <div className="bg-muted aspect-square md:aspect-[4/3] rounded-2xl flex flex-col items-center justify-center p-8 text-center border overflow-hidden relative group">
              {/* Image Background */}
              <img
                src="/unwatermarked_Gemini_Generated_Image_gw05i3gw05i3gw05.png"
                alt="Empowering Voices"
                className="absolute inset-0 object-cover w-full h-full group-hover:scale-100 scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-700"></div>
              <div className="relative z-10 text-center transition-opacity duration-700 group-hover:opacity-0">
                <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-md">Empowering Voices</h3>
                <p className="text-white/90 mt-2 text-lg drop-shadow-sm font-medium">Celebrating milestones. Fostering leaders.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
