"use server";

import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
// import { json } from "stream/consumers";

export const createBook = async (params: BookParams) => {
    try {
        const newBook = await db.insert(books).values({
            ...params,
            availableCopies: params.totalCopies, // Initialize available copies to total copies
      
        }).returning();
        
        return {
            success: true,
            data: JSON.parse(JSON.stringify(newBook[0])), // Return the newly created book as JSON
           
        }
    }catch (error) {
        console.error("Error creating book:", error);
        return {
            success: false,
            message: "Failed to create book",
        }
    }
}

