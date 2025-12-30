
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            setIsLoading(true);

            const res = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (res?.error) {
                throw new Error(res?.error);
            }

            toast.success("Login Successfully !");
           window.location.href = "/dashboard";
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        };
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-md"
            >
                <Card className="shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-center">
                            Enter your email and password to login
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Form {...form}>
                            <motion.form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.5 }}
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="john@example.com"
                                                    type="email"
                                                    className="focus-visible:ring-2 focus-visible:ring-primary transition-all"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="••••••••"
                                                    type="password"
                                                    className="focus-visible:ring-2 focus-visible:ring-primary transition-all"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <Button type="submit" className="w-full">
                                        Login {isLoading && <Spinner className="mr-2" />}
                                    </Button>
                                </motion.div>
                            </motion.form>
                        </Form>

                        <p className="text-center text-sm text-muted-foreground mt-4">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" className="text-primary hover:underline">
                                Sign up
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
