import BookForm from "@/components/admin/forms/BookForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <>
      <Button className="back-btn">
        <ArrowLeft />
        <Link href="/admin/books">Go Back</Link>
      </Button>
      <BookForm type={"create"} />
    </>
  );
};

export default page;
