import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // TODO: 로그인 처리
  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ status: "ready" });
}
