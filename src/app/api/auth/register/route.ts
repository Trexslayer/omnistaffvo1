
import { NextResponse } from "next/server";
import { z } from "zod";
import argon2 from "argon2";
import { prisma } from "@/lib/db/prisma";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform(
    (value) => value.toLowerCase()
  ),
  password: z.string().min(12).max(128),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(
    await request.json().catch(() => null)
  );

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Enter a valid name, email and password (12–128 characters)." },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;

  try {
    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        // Do not mark email as verified here.
      },
    });

    return NextResponse.json(
      {
        message:
          "Account created. Complete email verification before signing in.",
      },
      { status: 201 }
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Unable to create account with these details." },
        { status: 409 }
      );
    }

    console.error("Registration error", error);
    return NextResponse.json(
      { error: "Could not create account." },
      { status: 500 }
    );
  }
}
