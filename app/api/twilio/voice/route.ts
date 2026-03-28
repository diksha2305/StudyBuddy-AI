import { NextResponse } from "next/server";
import twilio from "twilio";

const VoiceResponse = twilio.twiml.VoiceResponse;

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const eventId = url.searchParams.get("eventId") || "unknown";
    const taskName = url.searchParams.get("taskName") || "your task";

    const twiml = new VoiceResponse();
    
    // Add a small pause for the user to hear the start clearly
    twiml.pause({ length: 1 });

    const gather = twiml.gather({
      input: ["speech"],
      speechModel: "numbers_and_commands",
      speechTimeout: "auto",
      action: `/api/twilio/process?eventId=${encodeURIComponent(eventId)}`,
      method: "POST",
    });

    gather.say(`Hi. You are running five minutes behind on your task: ${taskName}. Should I push your schedule back, or do you want to skip this task? Please say your command now.`);

    // If they don't say anything
    twiml.say("I didn't hear anything. Please update your dashboard manually. Goodbye.");

    return new NextResponse(twiml.toString(), {
      status: 200,
      headers: {
        "Content-Type": "text/xml",
      },
    });
  } catch (error: any) {
    console.error("Twilio Voice Webhook Error:", error);
    return new NextResponse("<Response><Say>An internal error occurred. Please check your dashboard.</Say></Response>", {
      status: 500,
      headers: { "Content-Type": "text/xml" },
    });
  }
}
