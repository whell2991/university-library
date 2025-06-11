import { db } from '@/database/drizzle'
import { books } from '@/database/schema'
import { eq } from 'drizzle-orm'
import React from 'react'

const page = async ({ params } : {params: Promise<{ id: string }>}) => {
    const id = (await params).id

    const [bookdetails] = await db.select().from(books).where(eq(books.id, id)).limit(1);

    return (
      <div>
        {bookdetails ? (
          <pre>{JSON.stringify(bookdetails, null, 2)}</pre>
        ) : (
          <span>Book not found</span>
        )}
      </div>
    );
}

export default page