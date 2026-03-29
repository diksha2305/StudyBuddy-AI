import { NextResponse } from "next/server";
import twilio from "twilio";
import groq from "@/lib/groq";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const eventIdParam = url.searchParams.get("eventId") || "unknown";
    
    // Parse Twilio form data
    const formData = await req.formData();
    const speechResult = formData.get("SpeechResult") as string;
    
    if (!speechResult) {
      console.log("No speech heard, skipping mutation.");
      return new NextResponse("<Response><Say>I didn't hear a command. Please check your dashboard.</Say></Response>", {
        headers: { "Content-Type": "text/xml" }
      });
    }

    console.log(`🎙️ Voice Agent heard: "${speechResult}"`);

    // Load context (saved in the /call/ route)
    const contextPath = path.join(process.cwd(), "tmp", "call_context.json");
    if (!fs.existsSync(contextPath)) {
       throw new Error("Missing call context file");
    }
    
    const context = JSON.parse(fs.readFileSync(contextPath, "utf8"));
    const { profile, eventId, taskName } = context;

    // Use Groq to generate a new task list
    const systemPrompt = `You are a world-class AI Study Planner agent.
    A student missed their deadline for "${taskName}".
    They just said: "${speechResult}".
    
    Your goal is to REWRITE their study plan for TODAY according to their voice command.
    If they say "Push it back 30 mins", shift all remaining tasks.
    If they say "Skip it", remove the overdue task.
    You must output ONLY the new task list array inside [UPDATE_PLAN] tags.
    
    [UPDATE_PLAN]
    [
      { "task": "...", "type": "...", "estimated_time": "...", "priority": "...", "reason": "..." }
    ]
    [/UPDATE_PLAN]`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.1,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `CURRENT PLAN TASKS: ${JSON.stringify(profile.events.find((e: any) => e.id === eventId)?.plan?.today_tasks || [])}` }
      ]
    });

    const responseText = completion.choices[0]?.message?.content || "";
    const updateMatch = responseText.match(/\[UPDATE_PLAN\]([\s\S]*?)\[\/UPDATE_PLAN\]/);

    if (updateMatch) {
      const rawBlock = updateMatch[1].trim().replace(/```json/g, "").replace(/```/g, "");
      const newTasks = JSON.parse(rawBlock);
      
      // Save for frontend to poll
      const updatePath = path.join(process.cwd(), "tmp", "twilio_update.json");
      fs.writeFileSync(updatePath, JSON.stringify({ eventId, newTasks, voiceCommand: speechResult }));
    }

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say("Command received. Your dashboard is updating in real-time. Good luck with your study.");
    twiml.hangup();

    return new NextResponse(twiml.toString(), {
      headers: { "Content-Type": "text/xml" }
    });
  } catch (error: any) {
    console.error("Twilio Process Error:", error);
    return new NextResponse("<Response><Say>Error processing your request.</Say></Response>", {
      headers: { "Content-Type": "text/xml" }
    });
  }
}
