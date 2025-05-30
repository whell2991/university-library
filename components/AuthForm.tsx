"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  useForm,
  UseFormReturn,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ZodType } from "zod";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import ImageUpload from "@/components/ui/ImageUpload";
import {} from "process";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface Props<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean; error?: string }>;
  type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  type,
  schema,
  defaultValues,
  onSubmit,
}: Props<T>) => {
  const router = useRouter();
  const isSignIn = type === "SIGN_IN"; // For Define Type if Sign in or Up

  // 1. Define your form.
  const form: UseFormReturn<T> = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  // 2. Define a submit handler.
  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = await onSubmit(data);

    if (result.success) {
      // Handle successful submission, e.g., redirect or show success message
      toast({
        title: isSignIn ? "Signed In" : "Account Created",
        description: isSignIn
          ? "Welcome back! You have successfully signed in."
          : "Your account has been created successfully.",
      });
      router.push("/"); // Redirect to home page or any other page
    } else {
      // Handle error, e.g., show error message
      toast({
        title: isSignIn ? "Signing In Failed" : "Account Creation Failed",
        description: result.error || "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-5">
        <h1 className="font-semibold text-white text-3xl">
          {isSignIn
            ? "Welcome Back to the BookWise"
            : "Create Your Library Account"}
        </h1>
        <p className="text-ligh-100 mt-2">
          {isSignIn
            ? "Access the vast collection of resources, and stay updated"
            : "Please complete all fields and upload a valid university ID to gain access to the library"}
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8 w-full"
        >
          {Object.keys(defaultValues).map((field) => (
            <FormField
              key={field}
              control={form.control}
              name={field as import("react-hook-form").Path<T>}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel className="capitalize">
                    {FIELD_NAMES[field as keyof typeof FIELD_NAMES]}
                  </FormLabel>
                  <FormControl>
                    {field === "universityCard" ? (
                      <ImageUpload
                        value={formField.value}
                        onChange={formField.onChange}
                      />
                    ) : (
                      <Input
                        required
                        type={FIELD_TYPES[field as keyof typeof FIELD_TYPES]}
                        {...formField}
                        className="form-input"
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <Button type="submit" className="form-btn">
            Submit
          </Button>
        </form>
      </Form>
      <div className="flex gap-1 justify-center items-center">
        <p className="text-center text-base font-medium max-xs:text-[14px]">
          {isSignIn
            ? "Don’t have an account already?"
            : "Have an account already?"}
        </p>
        <Link
          href={isSignIn ? "/sign-up" : "/sign-in"}
          className="font-semibold text-primary max-xs:text-[14px]"
        >
          {isSignIn ? "Register here" : "Login"}
        </Link>
      </div>
    </div>
  );
};

export default AuthForm;
