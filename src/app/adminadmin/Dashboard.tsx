"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Id } from "@/convex/_generated/dataModel";
import { LogOut, Plus, Pencil, Trash2, ImageIcon, Eye, Users, FileText, Image as ImageIcon2 } from "lucide-react";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<"stories" | "nominations" | "volunteers">("stories");

    const stories = useQuery(api.stories.listAll);
    const nominations = useQuery(api.nominations.listAll);
    const volunteers = useQuery(api.volunteers.listAll);

    const deleteStory = useMutation(api.stories.deleteStory);

    const [previewStory, setPreviewStory] = useState<any | null>(null);

    const handleDelete = async (id: Id<"stories">) => {
        if (confirm("Are you sure you want to delete this story?")) {
            await deleteStory({ id });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Top Navigation */}
            <header className="bg-white border-b shadow-sm sticky top-0 z-10 w-full px-6 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-primary">Telugu Mahila Admin</h1>
                    <p className="text-sm text-muted-foreground">Content Management System</p>
                </div>
                <Button variant="outline" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => window.location.reload()}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
                        <p className="text-muted-foreground">Manage stories, incoming nominations, and volunteer signups.</p>
                    </div>

                    <Link href="/adminadmin/story/new">
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Story
                        </Button>
                    </Link>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 border-b pb-4">
                    <Button
                        variant={activeTab === "stories" ? "default" : "outline"}
                        onClick={() => setActiveTab("stories")}
                        className={activeTab === "stories" ? "bg-primary text-primary-foreground" : ""}
                    >
                        <ImageIcon2 className="w-4 h-4 mr-2" />
                        Our Stories
                    </Button>
                    <Button
                        variant={activeTab === "nominations" ? "default" : "outline"}
                        onClick={() => setActiveTab("nominations")}
                        className={activeTab === "nominations" ? "bg-primary text-primary-foreground" : ""}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Nominations
                        {nominations && nominations.length > 0 && (
                            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">{nominations.length}</span>
                        )}
                    </Button>
                    <Button
                        variant={activeTab === "volunteers" ? "default" : "outline"}
                        onClick={() => setActiveTab("volunteers")}
                        className={activeTab === "volunteers" ? "bg-primary text-primary-foreground" : ""}
                    >
                        <Users className="w-4 h-4 mr-2" />
                        Volunteers
                        {volunteers && volunteers.length > 0 && (
                            <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">{volunteers.length}</span>
                        )}
                    </Button>
                </div>

                {/* Preview Dialog */}
                <Dialog open={!!previewStory} onOpenChange={(open) => !open && setPreviewStory(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Story Preview</DialogTitle>
                            <DialogDescription>This is how the story card appears on the live website.</DialogDescription>
                        </DialogHeader>
                        {previewStory && (
                            <div className="pt-4 flex justify-center bg-gray-50 -mx-6 px-6 pb-6 mt-2 border-t">
                                <div className="w-full max-w-[350px] bg-white rounded-xl overflow-hidden shadow-lg border-muted border mt-4">
                                    <div className="aspect-video relative bg-secondary/10 flex items-center justify-center overflow-hidden">
                                        {previewStory.imageUrl || (previewStory.images && previewStory.images.length > 0) ? (
                                            <img
                                                src={previewStory.imageUrl || previewStory.images[0]}
                                                alt={previewStory.name}
                                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <span className="text-4xl text-primary/30 font-bold uppercase">{previewStory.name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <div className="text-xs font-bold text-primary mb-2 uppercase tracking-wider">{previewStory.field}</div>
                                        <h3 className="text-2xl font-semibold leading-none tracking-tight">{previewStory.name}</h3>
                                        <p className="text-sm mt-3 line-clamp-3 text-muted-foreground">
                                            {/* <span className="font-semibold text-foreground">The Obstacle: </span> */}
                                            {previewStory.struggle}
                                        </p>
                                    </div>
                                    <div className="px-6 py-4 bg-muted/20 border-t">
                                        <span className="text-sm font-semibold text-primary">Read Full Journey &rarr;</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                {/* Data Tables */}
                <div className="bg-white rounded-md border shadow-sm">
                    {activeTab === "stories" && (
                        !stories ? (
                            <div className="p-8 text-center text-muted-foreground">Loading stories...</div>
                        ) : stories?.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <ImageIcon className="text-muted-foreground w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-medium">No stories found</h3>
                                <p className="text-muted-foreground mt-1">Start by adding your first inspiring story.</p>
                            </div>
                        ) : (
                            <div className="relative w-full overflow-auto">
                                <table className="w-full caption-bottom text-sm">
                                    <thead className="[&_tr]:border-b">
                                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted bg-muted/20">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Image</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Field</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                            <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right w-[150px]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {stories?.map((story) => (
                                            <tr key={story._id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                <td className="p-4 align-middle">
                                                    {story.imageUrl ? (
                                                        <img src={story.imageUrl} alt={story.name} className="w-12 h-12 rounded object-cover border" />
                                                    ) : (
                                                        <div className="w-12 h-12 bg-muted rounded border flex items-center justify-center">
                                                            <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-4 align-middle font-medium">{story.name}</td>
                                                <td className="p-4 align-middle">{story.field}</td>
                                                <td className="p-4 align-middle">
                                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${story.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                        {story.isActive ? 'Live' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="p-4 align-middle text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => setPreviewStory(story)} className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50">
                                                            <Eye className="h-4 w-4" />
                                                            <span className="sr-only">Preview</span>
                                                        </Button>
                                                        <Link href={`/adminadmin/story/${story._id}`}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                                <Pencil className="h-4 w-4" />
                                                                <span className="sr-only">Edit</span>
                                                            </Button>
                                                        </Link>
                                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(story._id)} className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10">
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Delete</span>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}

                    {activeTab === "nominations" && (
                        !nominations ? (
                            <div className="p-8 text-center text-muted-foreground">Loading nominations...</div>
                        ) : nominations?.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <FileText className="text-muted-foreground w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-medium">No Nominations Yet</h3>
                                <p className="text-muted-foreground mt-1">Community nominations will appear here.</p>
                            </div>
                        ) : (
                            <div className="relative w-full overflow-auto">
                                <table className="w-full text-sm">
                                    <thead className="[&_tr]:border-b bg-muted/20">
                                        <tr className="border-b">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Nominee Name</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Field</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Submitter Contact</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {nominations?.map((nom) => (
                                            <tr key={nom._id} className="border-b transition-colors hover:bg-muted/50 block md:table-row pb-4 md:pb-0">
                                                <td className="p-4 align-top whitespace-nowrap text-muted-foreground">
                                                    {new Date(nom.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 align-top font-medium break-words">
                                                    <div>{nom.nomineeName}</div>
                                                    <div className="text-xs text-muted-foreground font-normal mt-1 border-l-2 pl-2 break-all max-w-sm">
                                                        {nom.struggle}
                                                    </div>
                                                </td>
                                                <td className="p-4 align-top break-words">{nom.field}</td>
                                                <td className="p-4 align-top font-mono text-xs break-words">{nom.contactInfo}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}

                    {activeTab === "volunteers" && (
                        !volunteers ? (
                            <div className="p-8 text-center text-muted-foreground">Loading volunteers...</div>
                        ) : volunteers?.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center">
                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                    <Users className="text-muted-foreground w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-medium">No Volunteers Yet</h3>
                                <p className="text-muted-foreground mt-1">People who register to volunteer will pop up here.</p>
                            </div>
                        ) : (
                            <div className="relative w-full overflow-auto">
                                <table className="w-full text-sm">
                                    <thead className="[&_tr]:border-b bg-muted/20">
                                        <tr className="border-b">
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Name</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Contact</th>
                                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Message</th>
                                        </tr>
                                    </thead>
                                    <tbody className="[&_tr:last-child]:border-0">
                                        {volunteers?.map((vol) => (
                                            <tr key={vol._id} className="border-b transition-colors hover:bg-muted/50">
                                                <td className="p-4 align-top whitespace-nowrap text-muted-foreground">
                                                    {new Date(vol.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="p-4 align-top font-medium break-words">{vol.name}</td>
                                                <td className="p-4 align-top break-words">
                                                    <div>{vol.email}</div>
                                                    <div className="text-muted-foreground">{vol.phone}</div>
                                                </td>
                                                <td className="p-4 align-top max-w-md break-words text-muted-foreground">
                                                    {vol.message || "-"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </div>
            </main>
        </div>
    );
}
