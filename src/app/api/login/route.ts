import { NextRequest, NextResponse } from "next/server";

const VALID_EMAIL = process.env.LOGIN_USERNAME || "gostudio";
const VALID_PASSWORD = process.env.LOGIN_PASSWORD || "gostudio@12345";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Invalid email or password. Please try again." },
      { status: 401 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 400 },
    );
  }
}
