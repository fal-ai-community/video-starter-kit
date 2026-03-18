import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy-key");

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: [process.env.FEEDBACK_TO_EMAIL || "gostudio@gmail.com"],
      subject: `GoStudio Clips: Access Request from ${email}`,
      replyTo: email,
      text: `
        New access request for GoStudio Clips (clip.ai)
        
        Email: ${email}
        
        Please connect with this user to give advanced credits/access.
      `,
      html: `
        <h1>New Access Request for GoStudio Clips</h1>
        <p><strong>Email:</strong> ${email}</p>
        <p>Please connect with this user to give advanced credits/access.</p>
      `,
    });

    if (error) {
      return NextResponse.json(
        { error: "Failed to send request" },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
