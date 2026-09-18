import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/serialize";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let bookId: bigint;
  try {
    bookId = BigInt(id);
  } catch {
    return NextResponse.json({ error: "invalid book id" }, { status: 400 });
  }

  const book = await db.orm.public.Book.first({ id: bookId });
  if (!book) {
    return NextResponse.json({ error: "book not found" }, { status: 404 });
  }

  return NextResponse.json(serializeBigInts(book));
}
