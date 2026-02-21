import React, { useState } from "react";
import { setUser } from "@/redux/user.slice";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { RouteSignUp, RouteUpload } from "@/helper/RouteName";
import { showToast } from "../helper/ShowToast";
import GuitarNotesBackground from "@/components/GuitarNotesBackground";

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values) {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      // Handle Errors
      if (!response.ok) {

        // 🔐 Email not verified → redirect to verify page
        if (response.status === 403 && data.redirectToVerify) {
          showToast(
            data.message || "Email not verified. OTP sent to your email.",
            "info"
          );

          navigate("/verify-email", { state: { email: values.email } });
          return;
        }

        // ❌ User not found / wrong password
        if (response.status === 404) {
          showToast("Invalid email or password", "error");
          return;
        }

        // ❌ Validation / bad request
        if (response.status === 400) {
          showToast(data.message || "Invalid input", "error");
          return;
        }

        // ❌ Any other error
        showToast(data.message || "Login failed. Please try again.", "error");
        return;
      }

      // ✅ Success Scenario
      showToast(data.message || "Login successful", "success");
      dispatch(setUser(data.user));

      // Redirect to main app
      navigate(RouteUpload);

    } catch (error) {
      showToast("Unable to connect to server. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden">
      <GuitarNotesBackground />
      <div className="z-10 flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-primary/5 via-background to-accent/5 px-4 py-8">
        {/* Logo */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-tr from-primary/10 via-accent/10 to-secondary/10 backdrop-blur-md shadow-lg ring-1 ring-white/10 overflow-hidden">
            <img
              src="/AarohAI.jpg"
              alt="Aaroh AI Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-semibold mt-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-1">
            Log in to continue making music smarter 🎶
          </p>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-sm p-6 sm:p-8 shadow-lg border border-border/60 bg-card/80 backdrop-blur-md">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-foreground">
            Login to your account
          </h2>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email..."
                        className="h-11 rounded-xl focus:ring-2 focus:ring-primary/50"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password..."
                        className="h-11 rounded-xl focus:ring-2 focus:ring-primary/50"
                        {...field}
                      />
                    </FormControl>
                    <div className="flex justify-end text-sm mt-1">
                      <Link to="#" className="text-primary hover:underline">
                        Forgot Password?
                      </Link>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 text-base font-medium rounded-xl bg-gradient-to-r from-primary via-accent to-secondary text-white shadow-md hover:opacity-90 transition"
              >
                {loading ? "Logging in..." : "Continue"}
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              to={RouteSignUp}
              className="text-primary font-semibold hover:underline"
            >
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default Signin;