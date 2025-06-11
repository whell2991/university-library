import { auth } from "@/auth";

import BookOverview from "@/components/BookOverview";
import BookVideo from "@/components/BookVideo";
import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { eq } from "drizzle-orm";
import React from "react";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;

  const session = await auth();

  const [bookdetails] = await db
    .select()
    .from(books)
    .where(eq(books.id, id))
    .limit(1);

  return (
    <>
      <BookOverview {...bookdetails} userId={session?.user?.id as string} />

      <div className="book-details">
        <div className="flex[1.5]">
          <section className="flex flex-col gap-7">
            <h3>Video</h3>
            <BookVideo videoUrl={bookdetails.videoUrl} />
          </section>
          <section className="mt-10 flex flex-col gap-7">
            <h3>Summary</h3>
            <div className="space-y-5 text-xl text-light-100 ">
              {bookdetails.summary.split("\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default page;
