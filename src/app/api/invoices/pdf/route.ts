import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();

  // PDF generation placeholder — integrate @react-pdf/renderer or puppeteer later
  return NextResponse.json({
    url: null,
    message: "PDF generation not yet configured",
    invoice: body,
  });
}
