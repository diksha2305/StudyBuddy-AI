import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const updatePath = path.join(process.cwd(), "tmp", "twilio_update.json");
  
  if (fs.existsSync(updatePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(updatePath, "utf8"));
      // Delete the file after it's been consumed
      fs.unlinkSync(updatePath);
      return NextResponse.json({ updateAvailable: true, ...data });
    } catch (e) {
      console.error("Poller Error:", e);
      return NextResponse.json({ updateAvailable: false });
    }
  }

  return NextResponse.json({ updateAvailable: false });
}
