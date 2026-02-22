"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircleIcon } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { countries } from "@/lib/countries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

export default function SupportPage() {
    const razorpayFormRef = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const registerVolunteer = useMutation(api.volunteers.register);

    const handleVolunteerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const countryCode = formData.get("countryCode") as string;
        const phoneData = formData.get("phone") as string;
        const fullPhone = phoneData ? `${countryCode} ${phoneData}` : undefined;

        try {
            await registerVolunteer({
                name: formData.get("name") as string,
                email: formData.get("email") as string,
                phone: fullPhone,
                message: (formData.get("message") as string) || undefined,
            });
            setIsSuccess(true);
        } catch (error) {
            console.error("Failed to register volunteer", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
        if (!open) {
            // small delay to let dialog exit animation run before resetting
            setTimeout(() => setIsSuccess(false), 200);
        }
    };

    const submitNomination = useMutation(api.nominations.submit);
    const [isSubmittingNomination, setIsSubmittingNomination] = useState(false);
    const [nominationSuccess, setNominationSuccess] = useState(false);

    const handleNominationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmittingNomination(true);
        setNominationSuccess(false);

        const formData = new FormData(e.currentTarget);

        try {
            await submitNomination({
                nomineeName: formData.get("nomineeName") as string,
                field: formData.get("field") as string,
                struggle: formData.get("struggle") as string,
                contactInfo: formData.get("contact") as string,
            });
            setNominationSuccess(true);
            e.currentTarget.reset(); // clear form explicitly
        } catch (error) {
            console.error("Failed to submit nomination", error);
        } finally {
            setIsSubmittingNomination(false);
        }
    };

    useEffect(() => {
        if (razorpayFormRef.current && razorpayFormRef.current.children.length === 0) {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/payment-button.js";
            script.async = true;
            script.dataset.payment_button_id = "pl_SItGi6E8XGuJNU";
            razorpayFormRef.current.appendChild(script);
        }
    }, []);

    return (
        <div className="container mx-auto px-4 py-16 max-w-screen-xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4 text-foreground">Get Involved</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Help us uncover hidden stories, nominate deserving individuals, or support our efforts to recognize and uplift the resilient women of our community.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Nomination Form */}
                <Card className="border-muted shadow-sm h-fit">
                    <CardHeader>
                        <CardTitle className="text-primary text-2xl font-black">Nominate a Woman</CardTitle>
                        <CardDescription>
                            Do you know a Telugu woman who has overcome significant hurdles to achieve greatness in her field? Share her story with us.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {nominationSuccess ? (
                            <div className="py-12 text-center space-y-4">
                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                                    <CheckCircleIcon className="h-8 w-8" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">Nomination Submitted</h3>
                                <p className="text-muted-foreground text-sm">
                                    Thank you for sharing this incredible story with us. Our team will review the nomination shortly.
                                </p>
                                <Button variant="outline" className="mt-4" onClick={() => setNominationSuccess(false)}>
                                    Submit Another
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleNominationSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nomineeName">Nominee's Full Name *</Label>
                                    <Input id="nomineeName" name="nomineeName" required placeholder="e.g., Anitha Reddy" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="field">Field of Achievement *</Label>
                                    <Input id="field" name="field" required placeholder="e.g., Education, Business, Sports" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="struggle">A brief on her struggle & success *</Label>
                                    <Textarea
                                        id="struggle"
                                        name="struggle"
                                        required
                                        placeholder="Tell us what she had to overcome and how she succeeded."
                                        className="min-h-[120px]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="contact">Your Contact Info (Required) *</Label>
                                    <Input id="contact" name="contact" required placeholder="Email or Phone number" />
                                </div>
                                <Button type="submit" disabled={isSubmittingNomination} className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90">
                                    {isSubmittingNomination ? "Submitting..." : "Submit Nomination"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* Other Support Means */}
                <div className="space-y-8">
                    <Card className="bg-secondary/10 border-none shadow-none">
                        <CardHeader>
                            <CardTitle className="text-secondary">Volunteer With Us</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Our foundation operates through the hard work of dedicated volunteers. Help us organize events, conduct interviews, and manage our digital presence.
                            </p>
                            <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
                                        Become a Volunteer
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    {!isSuccess ? (
                                        <>
                                            <DialogHeader>
                                                <DialogTitle>Volunteer Registration</DialogTitle>
                                                <DialogDescription>
                                                    Join us in our mission to empower Telugu women. Fill out the details below and we will get in touch with you.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleVolunteerSubmit} className="space-y-4 pt-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Full Name *</Label>
                                                    <Input id="name" name="name" required placeholder="e.g., Harsha Vardhan" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email Address *</Label>
                                                    <Input id="email" name="email" type="email" required placeholder="name@example.com" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="phone">Phone Number</Label>
                                                    <div className="flex gap-2">
                                                        <select
                                                            name="countryCode"
                                                            className="flex h-10 w-[140px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                            defaultValue="+91"
                                                        >
                                                            {countries.map((country) => (
                                                                <option key={`${country.code}-${country.dial_code}`} value={country.dial_code}>
                                                                    {country.dial_code} ({country.name})
                                                                </option>
                                                            ))}
                                                        </select>
                                                        <Input id="phone" name="phone" placeholder="99999 00000" className="flex-1" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="message">How would you like to help?</Label>
                                                    <Textarea
                                                        id="message"
                                                        name="message"
                                                        placeholder="Briefly tell us your interests or skills..."
                                                    />
                                                </div>
                                                <Button type="submit" className="w-full bg-secondary text-white hover:bg-secondary/90" disabled={isSubmitting}>
                                                    {isSubmitting ? "Submitting..." : "Complete Registration"}
                                                </Button>
                                            </form>
                                        </>
                                    ) : (
                                        <div className="py-6 text-center space-y-4">
                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                                                <CheckCircleIcon className="h-8 w-8" />
                                            </div>
                                            <h3 className="text-xl font-semibold text-foreground">Thank you for registering!</h3>
                                            <p className="text-muted-foreground text-sm">
                                                Thank you for registering as a volunteer with us. Our representative will contact you shortly.
                                            </p>
                                            <div className="pt-4">
                                                <p className="text-sm text-muted-foreground mb-3">Or you can enquire on WhatsApp:</p>
                                                <a
                                                    href="https://wa.me/917989628048"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-[#25D366]/90 transition-colors"
                                                >
                                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                                    </svg>
                                                    Message on WhatsApp
                                                </a>
                                            </div>
                                            <Button variant="outline" className="mt-6 w-full" onClick={() => handleOpenChange(false)}>
                                                Close
                                            </Button>
                                        </div>
                                    )}
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-none shadow-none">
                        <CardHeader>
                            <CardTitle className="text-primary">Donate to the Cause</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Your contributions go directly into funding the awards, creating awareness events, and building support networks for women in need.
                            </p>
                            <form ref={razorpayFormRef} className="min-h-[50px] flex items-center" />
                        </CardContent>
                    </Card>

                    <div id="contact-us" className="p-6 scroll-m-24">
                        <h3 className="font-semibold text-lg mb-2">Contact Us</h3>
                        <p className="text-muted-foreground">Email: mentpath@gmail.com</p>
                        <p className="text-muted-foreground mb-4">Phone: +91 7989628048</p>

                        <a
                            href="https://wa.me/917989628048"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2 text-sm font-medium rounded-md hover:bg-[#25D366]/90 transition-colors"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                            </svg>
                            Message on WhatsApp
                        </a>

                        <p className="text-muted-foreground mt-8 italic text-sm border-t pt-4">
                            "When you support a woman, you uplift an entire generation."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
