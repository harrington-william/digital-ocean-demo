import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/prisma/db";
import { serializeBigInts } from "@/src/lib/serialize";
import { toVarchar, VarcharTooLongError } from "@/src/lib/varchar";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, biography } = body ?? {};

  if (typeof name !== "string" || name.trim() === "") {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  try {
    const author = await db.orm.public.Author.create({
      name: toVarchar(name, 255),
      biography: biography ?? null,
    });
    return NextResponse.json(serializeBigInts(author), { status: 201 });
  } catch (error) {
    if (error instanceof VarcharTooLongError) {
      return NextResponse.json({ error: `name ${error.message}` }, { status: 400 });
    }
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
