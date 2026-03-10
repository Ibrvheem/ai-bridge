"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useSignupForm } from "../_hooks/use-signup-form";
import ControlledInput from "@/components/molecules/controlled-input";
import Link from "next/link";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, onSubmit, isSubmitting } = useSignupForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Enter your details to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="grid gap-6">
              <div className="grid gap-4">
                <ControlledInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                />
                <ControlledInput
                  label="Password"
                  name="password"
                  type="password"
                />
                <ControlledInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                />
                <Button
                  type="submit"
                  className="w-full"
                  onClick={() => onSubmit()}
                  loading={isSubmitting}
                >
                  Create Account
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
