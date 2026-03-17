import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";
import { VCARD } from "@/lib/card-constants";

export async function GET() {
  let photoBase64 = "";
  try {
    const photoPath = join(process.cwd(), "public/nick-stephens-professional.png");
    const photoBuffer = readFileSync(photoPath);
    photoBase64 = photoBuffer.toString("base64");
  } catch {
    // Photo is optional — vCard works without it
  }

  const photoLine = photoBase64
    ? `PHOTO;ENCODING=b;TYPE=PNG:${photoBase64}\n`
    : "";

  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${VCARD.lastName};${VCARD.firstName};;;`,
    `FN:${VCARD.fullName}`,
    `ORG:${VCARD.org}`,
    `TITLE:${VCARD.title}`,
    `TEL;TYPE=CELL:${VCARD.phone}`,
    `EMAIL;TYPE=INTERNET:${VCARD.email}`,
    `URL:${VCARD.url}`,
    `ADR;TYPE=WORK:;;${VCARD.location};;;;`,
    `NOTE:${VCARD.note}`,
    photoLine ? photoLine.trim() : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");

  return new NextResponse(vcf, {
    status: 200,
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="nick-stephens.vcf"',
      "Cache-Control": "public, max-age=86400",
    },
  });
}
