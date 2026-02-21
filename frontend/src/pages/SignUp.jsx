import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { RouteSignIn } from "@/helper/RouteName";
import { showToast } from "@/helper/ShowToast";
import GuitarNotesBackground from "@/components/GuitarNotesBackground";

// ✅ Schema with Strict Gmail Validation
const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z
      .string()
      .email("Invalid email")
      .refine((email) => email.toLowerCase().endsWith("@gmail.com"), {
        message: "Only @gmail.com addresses are allowed",
      }),
    password: z.string().min(8, "Password must be at least 8 characters").max(30),
    confirmpassword: z.string(),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match.",
    path: ["confirmpassword"],
  });

export default function SignUp() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Add loading state

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmpassword: "",
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          showToast("User already registered. Please login.", "error");
        } else if (response.status === 400) {
          showToast(data.message || "Invalid input", "error");
        } else {
          showToast(data.message || "Registration failed", "error");
        }
        setLoading(false);
        return;
      }


      showToast("Account created! Please verify your email.", "success");

      // Navigate to Verify Page with email
      navigate("/verify-email", { state: { email: values.email } });

    } catch (error) {
      showToast(error.message || "Server connection failed", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden">
      <GuitarNotesBackground />
      <div className="z-10 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary/5 via-background to-accent/5 px-4 py-8">

        {/* Logo Section */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-tr from-primary/10 via-accent/10 to-secondary/10 backdrop-blur-md shadow-lg ring-1 ring-white/10 overflow-hidden">
            <img src="/AarohAI.jpg" alt="Aaroh AI Logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-semibold mt-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Create your account
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Let’s begin your musical journey with Aaroh AI 🎶
          </p>
        </div>

        {/* Form Card */}
        <Card className="w-full max-w-sm p-6 sm:p-8 shadow-lg border border-border/60 bg-card/80 backdrop-blur-md">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" className="h-11 rounded-xl focus:ring-2 focus:ring-primary/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@gmail.com" className="h-11 rounded-xl focus:ring-2 focus:ring-primary/50" {...field} />
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
                      <Input type="password" placeholder="Create password" className="h-11 rounded-xl focus:ring-2 focus:ring-primary/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmpassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirm password" className="h-11 rounded-xl focus:ring-2 focus:ring-primary/50" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base font-medium rounded-xl bg-gradient-to-r from-primary via-accent to-secondary text-white shadow-md hover:opacity-90 transition"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to={RouteSignIn} className="text-primary font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}