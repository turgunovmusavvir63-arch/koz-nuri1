import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    project: "Ko‘zNuri AI",
    sprint: 1,
    message: "Frontend prototipi ishlayapti. AI backend keyingi sprintda ulanadi."
  });
}
