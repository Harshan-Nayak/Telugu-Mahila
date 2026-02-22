"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const navLinks = [
        { href: "/stories", label: "Stories" },
        { href: "/awards", label: "Awards" },
        { href: "/support", label: "Support Us" },
    ];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between mx-auto px-4">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold text-xl inline-block text-primary">Telugu Mahila</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="transition-colors hover:text-primary text-foreground/80"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    {/* Desktop Action Button */}
                    <div className="hidden md:block">
                        <Button variant="default" asChild>
                            <Link href="/support">Nominate a Woman</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-foreground"
                        onClick={toggleMenu}
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            {isOpen && (
                <div className="md:hidden border-t border-border/40 bg-background absolute top-16 left-0 w-full shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
                    <nav className="flex flex-col p-4 gap-4 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="transition-colors hover:text-primary text-foreground/80 py-2 border-b border-border/10"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Button variant="default" className="mt-2 w-full" asChild onClick={() => setIsOpen(false)}>
                            <Link href="/support">Nominate a Woman</Link>
                        </Button>
                    </nav>
                </div>
            )}
        </header>
    );
}
