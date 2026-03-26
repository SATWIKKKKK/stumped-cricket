import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { createCredentialsUser, findUserByEmail, findUserByPlayerId } from "@/lib/server/repositories";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email(),
  playerId: z
    .string()
    .trim()
    .min(4)
    .max(30)
    .regex(/^[a-zA-Z0-9-]+$/, "Player ID can contain only letters, numbers and hyphen"),
  accessKey: z
    .string()
    .min(8)
    .max(128)
    .regex(/[A-Z]/, "Access key must include an uppercase letter")
    .regex(/[a-z]/, "Access key must include a lowercase letter")
    .regex(/[0-9]/, "Access key must include a number")
    .regex(/[^a-zA-Z0-9]/, "Access key must include a special character"),
  confirmAccessKey: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = schema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Invalid data",
      },
      { status: 400 }
    );
  }

  const { name, email, playerId, accessKey, confirmAccessKey } = parsed.data;

  if (accessKey !== confirmAccessKey) {
    return NextResponse.json({ error: "Access keys do not match" }, { status: 400 });
  }

  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    return NextResponse.json({ error: "Email is already registered" }, { status: 409 });
  }

  const existingPlayer = await findUserByPlayerId(playerId);
  if (existingPlayer) {
    return NextResponse.json({ error: "Player ID is already registered" }, { status: 409 });
  }

  const passwordHash = await hash(accessKey, 12);

  const created = await createCredentialsUser({
    name,
    email,
    playerId,
    passwordHash,
  });

  return NextResponse.json({ data: created }, { status: 201 });
}
