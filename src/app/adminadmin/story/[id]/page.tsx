"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StoryFormPage() {
    const params = useParams();
    const router = useRouter();
    const storyId = params.id as string;
    const isNew = storyId === "new";

    // Queries & Mutations
    const existingStory = useQuery(
        api.stories.getStory,
        isNew ? "skip" : { id: storyId as Id<"stories"> }
    );
    const updateStory = useMutation(api.stories.updateStory);
    const addStory = useMutation(api.stories.addStory);
    const generateUploadUrl = useMutation(api.upload.generateUploadUrl);
    const resolveUrl = useMutation(api.upload.resolveUrl);

    // Form State
    const [name, setName] = useState("");
    const [field, setField] = useState("");
    const [struggle, setStruggle] = useState("");
    const [successStory, setSuccessStory] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [isUploadingCover, setIsUploadingCover] = useState(false);
    const [isUploadingGallery, setIsUploadingGallery] = useState(false);

    // Hydrate form on edit load
    useEffect(() => {
        if (!isNew && existingStory) {
            setName(existingStory.name);
            setField(existingStory.field);
            setStruggle(existingStory.struggle);
            setSuccessStory(existingStory.successStory);
            setImageUrl(existingStory.imageUrl || "");
            setImages(existingStory.images || (existingStory.imageUrl ? [existingStory.imageUrl] : []));
        }
    }, [isNew, existingStory]);

    const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploadingCover(true);
        try {
            const uploadUrl = await generateUploadUrl();
            const result = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            });
            const { storageId } = await result.json();
            const rawUrl = await resolveUrl({ storageId });
            if (rawUrl) setImageUrl(rawUrl);
        } catch (error) {
            console.error(error);
            alert("Failed to upload cover image");
        } finally {
            setIsUploadingCover(false);
            if (e.target) e.target.value = '';
        }
    };

    const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsUploadingGallery(true);
        try {
            const uploadedUrls: string[] = [];
            for (const file of files) {
                const uploadUrl = await generateUploadUrl();
                const result = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": file.type },
                    body: file,
                });
                const { storageId } = await result.json();
                const rawUrl = await resolveUrl({ storageId });
                if (rawUrl) uploadedUrls.push(rawUrl);
            }
            if (uploadedUrls.length > 0) {
                setImages((prev) => [...prev, ...uploadedUrls]);
            }
        } catch (error) {
            console.error(error);
            alert("Failed to upload gallery image(s)");
        } finally {
            setIsUploadingGallery(false);
            if (e.target) e.target.value = '';
        }
    };

    const removeGalleryImage = (index: number) => {
        setImages((prev) => {
            const newImages = [...prev];
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const handleSubmit = async (submitAsActive: boolean) => {
        try {
            if (!isNew) {
                await updateStory({
                    id: storyId as Id<"stories">,
                    name,
                    field,
                    struggle,
                    successStory,
                    imageUrl: imageUrl || undefined,
                    images,
                    isActive: submitAsActive,
                });
            } else {
                await addStory({
                    name,
                    field,
                    struggle,
                    successStory,
                    imageUrl: imageUrl || undefined,
                    images,
                    isActive: submitAsActive,
                });
            }
            router.push("/adminadmin");
        } catch (error) {
            console.error(error);
            alert("Failed to save story");
        }
    };

    if (!isNew && existingStory === undefined) {
        return <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50 border shadow-sm">Loading Form Data...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b shadow-sm sticky top-0 z-10 w-full px-6 py-4 flex items-center gap-4">
                <Link href="/adminadmin">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-xl font-bold text-primary">{isNew ? "Create New Story" : "Edit Story"}</h1>
                    <p className="text-sm text-muted-foreground">Manage story content and preview the result</p>
                </div>
            </header>

            <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Form Editor */}
                    <div className="bg-white p-6 md:p-8 rounded-xl border shadow-sm space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nominee Name *</Label>
                                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="field">Field of Achievement *</Label>
                                <Input id="field" value={field} onChange={(e) => setField(e.target.value)} placeholder="e.g. Science, Sports" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="struggle">Short Struggle Summary *</Label>
                                <Textarea id="struggle" value={struggle} onChange={(e) => setStruggle(e.target.value)} placeholder="Brief summary for cards" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="successStory">Full Success Story *</Label>
                                <Textarea id="successStory" className="min-h-[150px]" value={successStory} onChange={(e) => setSuccessStory(e.target.value)} placeholder="The complete journey..." required />
                            </div>

                            <div className="space-y-4 border p-4 rounded-md bg-muted/20">
                                {/* Cover Image Section */}
                                <div>
                                    <Label>Card Cover Image *</Label>
                                    <p className="text-xs text-muted-foreground mb-3">Upload a single featured image for the Story Card. This appears on the homepage.</p>
                                    <div className="flex gap-4 items-start">
                                        <div className="relative shrink-0">
                                            <Button type="button" variant="outline" className="w-[120px] h-[120px] flex flex-col gap-2 relative overflow-hidden bg-white hover:bg-muted/50 transition-colors border-dashed shadow-sm">
                                                {isUploadingCover ? (
                                                    <span className="text-xs font-medium animate-pulse">Uploading...</span>
                                                ) : (
                                                    <>
                                                        <Upload className="w-6 h-6 text-muted-foreground" />
                                                        <span className="text-xs font-medium text-muted-foreground">Upload Cover</span>
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleCoverUpload}
                                                    className="absolute inset-0 cursor-pointer opacity-0"
                                                    disabled={isUploadingCover}
                                                />
                                            </Button>
                                        </div>
                                        <div className="flex-1 flex items-center justify-center min-h-[140px] border rounded-md p-2 bg-white">
                                            {imageUrl ? (
                                                <div className="relative group w-[100px] h-[100px] shrink-0">
                                                    <img src={imageUrl} alt="Cover Preview" className="w-full h-full object-cover rounded-md border shadow-sm" />
                                                    <button
                                                        type="button"
                                                        onClick={() => setImageUrl("")}
                                                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                    <div className="absolute bottom-1 left-1 right-1 bg-primary text-primary-foreground text-[10px] text-center rounded-sm py-0.5 font-semibold">Cover</div>
                                                </div>
                                            ) : (
                                                <div className="text-xs text-muted-foreground">No cover image set</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Additional Images Section */}
                                <div className="pt-4 border-t border-border/50">
                                    <Label>Story Additional Images</Label>
                                    <p className="text-xs text-muted-foreground mb-3">Upload multiple images for the gallery view inside the full story article.</p>
                                    <div className="flex gap-4 items-start">
                                        <div className="relative shrink-0">
                                            <Button type="button" variant="outline" className="w-[120px] h-[120px] flex flex-col gap-2 relative overflow-hidden bg-white hover:bg-muted/50 transition-colors border-dashed shadow-sm">
                                                {isUploadingGallery ? (
                                                    <span className="text-xs font-medium animate-pulse">Uploading...</span>
                                                ) : (
                                                    <>
                                                        <Upload className="w-6 h-6 text-muted-foreground" />
                                                        <span className="text-xs font-medium text-muted-foreground">Upload Images</span>
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    onChange={handleGalleryUpload}
                                                    className="absolute inset-0 cursor-pointer opacity-0"
                                                    disabled={isUploadingGallery}
                                                />
                                            </Button>
                                        </div>

                                        <div className="flex-1 flex gap-2 flex-wrap max-h-[250px] overflow-y-auto w-full border rounded-md p-2 bg-white">
                                            {images.map((img, idx) => (
                                                <div key={idx} className="relative group w-[100px] h-[100px] shrink-0">
                                                    <img src={img} alt={`Gallery Preview ${idx + 1}`} className="w-full h-full object-cover rounded-md border shadow-sm" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(idx)}
                                                        className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            {images.length === 0 && !isUploadingGallery && (
                                                <div className="w-full h-[100px] flex justify-center items-center text-xs text-muted-foreground">
                                                    No gallery images selected
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-6 border-t mt-8">
                                <Link href="/adminadmin">
                                    <Button type="button" variant="outline">Cancel</Button>
                                </Link>
                                <Button type="button" variant="secondary" onClick={() => handleSubmit(false)}>Save as Draft</Button>
                                <Button type="button" className="bg-primary hover:bg-primary/90" onClick={() => handleSubmit(true)}>{!isNew ? "Republish Live" : "Publish Story"}</Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sticky Live Preview */}
                    <div className="xl:sticky xl:top-[120px]">
                        <div className="bg-white p-6 md:p-8 rounded-xl border shadow-sm">
                            <h3 className="font-semibold text-lg border-b pb-4 mb-6">Live Card Preview</h3>

                            <div className="pt-4 flex justify-center bg-gray-50 border-t border-x rounded-t-xl -mx-6 -mt-6 px-6 pb-8 border-b-none border">
                                <div className="w-full max-w-[350px] bg-white rounded-xl overflow-hidden shadow-lg border-muted border mt-8 transform transition-all duration-300">
                                    <div className="aspect-video relative bg-secondary/10 flex items-center justify-center overflow-hidden">
                                        {imageUrl ? (
                                            <img
                                                src={imageUrl}
                                                alt={name || "Preview Image"}
                                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <span className="text-4xl text-primary/30 font-bold uppercase">{name ? name.charAt(0) : "?"}</span>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{field || "Field of Achievement"}</div>
                                        <h3 className="text-2xl font-semibold leading-none tracking-tight break-words">{name || "Nominee Name"}</h3>
                                        <p className="text-sm mt-3 line-clamp-3 text-muted-foreground break-all">
                                            {struggle || "The story's short struggle will appear here. It's used as an introductory snippet on the card footprint..."}
                                        </p>
                                    </div>
                                    <div className="px-6 py-4 bg-muted/20 border-t">
                                        <span className="text-sm font-semibold text-primary">Read Full Journey &rarr;</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
