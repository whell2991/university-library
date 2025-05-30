"use client";
import AuthForm from "@/components/AuthForm";
import React from "react";
import { signUpSchema } from "@/lib/validation";
import { signUp } from "@/lib/actions/auth";

const page = () => (
  <AuthForm
    type="SIGN_UP"
    schema={signUpSchema}
    defaultValues={{
      fullName: "",
      email: "",
      universityId: 0,
      password: "",
      universityCard: "",
    }}
    onSubmit={signUp}
  />
);

export default page;
