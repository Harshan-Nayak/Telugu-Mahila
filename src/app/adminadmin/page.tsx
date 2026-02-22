"use client";

import { useState } from "react";
import Dashboard from "./Dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LockIcon } from "lucide-react";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        
        const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
        
        if (password === correctPassword) {
            setIsAuthenticated(true);
            setError("");
        } else {
            setError("Incorrect password");
        }
    };

    if (isAuthenticated) {
        return <Dashboard />;
    }

    return (
        <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-lg border-primary/10">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <LockIcon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
                    <CardDescription>
                        Enter your administrative credentials to manage content.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={error ? "border-red-500" : ""}
                            />
                            {error && <p className="text-sm text-red-500">{error}</p>}
                        </div>
                        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
                            Login to Dashboard
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
