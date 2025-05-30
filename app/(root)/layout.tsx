import { auth } from "@/auth";
import Header from "@/components/header";
import { redirect } from "next/navigation";
// This file is used to wrap the entire application with a layout that includes the header and authentication check
import React, { ReactNode } from "react";

const layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();
  if (!session) redirect("/sign-in");
  return (
    <main className="root-container">
      <div className="mx-auto max-w-7xl">
        <Header session={session} />
        <div className="mt-20 pb-20">{children}</div>
      </div>
    </main>
  );
};

export default layout;
