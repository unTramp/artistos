import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({ data: { status: "ok", service: "web" }, meta: { traceId: crypto.randomUUID() } });
}
