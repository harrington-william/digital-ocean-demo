import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/serialize";
import { toVarchar, VarcharTooLongError } from "@/src/lib/varchar";

export async function GET() {
  const books = await db.orm.public.Book.all();
  return NextResponse.json(books.map(serializeBigInts));
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, authorId, isbn, publishedYear } = body ?? {};

  if (typeof title !== "string" || title.trim() === "") {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (authorId === undefined || authorId === null) {
    return NextResponse.json({ error: "authorId is required" }, { status: 400 });
  }

  try {
    const book = await db.orm.public.Book.create({
      title: toVarchar(title, 255),
      authorId: BigInt(authorId),
      isbn: typeof isbn === "string" ? toVarchar(isbn, 13) : null,
      publishedYear: publishedYear ?? null,
    });
    return NextResponse.json(serializeBigInts(book), { status: 201 });
  } catch (error) {
    if (error instanceof VarcharTooLongError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
