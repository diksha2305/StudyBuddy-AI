import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("Missing GROQ_API_KEY environment variable");
}

const client = new Groq({ apiKey });

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export const chatWithAssistant = async (
  message: string,
  history: ChatMessage[] = [],
  contextData?: any
): Promise<string> => {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) {
    throw new Error("Message cannot be empty");
  }

  const safeHistory = history
    .filter((item) => item.content.trim().length > 0)
    .slice(-8);

  let systemPrompt = "You are StudySmart assistant. Give concise, helpful learning support for student notes and quizzes. Be friendly, encouraging, and use simple language suitable for a high school student to explain complex topics. ALWAYS use standard Markdown for formatting and use strict LaTeX notation (e.g. `$$ E=mc^2 $$` for standalone blocks or `$ x $` for ANY inline math, variable, or scientific symbol) for ALL scientific content. NEVER use plain text for symbols like theta, u_x, etc.; always wrap them in $ signs (e.g. `$ \\\\theta $`). When writing math or scientific notation, always wrap inline expressions in `$...$` and block equations in `$$...$$`. For example: `The energy is $E=mc^2$` or `The formula is $\\alpha + \\beta = \\gamma$`. If the user asks about their screen or their quiz, you have access to their exact dashboard context below.";
  
  if (contextData && contextData.summaryData) {
    systemPrompt += `\n\n--- LIVE DASHBOARD CONTEXT ---`;
    systemPrompt += `\nSUMMARY GENERATED: ${contextData.summaryData.summary}`;
    if (contextData.summaryData.keyTerms?.length) systemPrompt += `\nKEY TERMS: ${JSON.stringify(contextData.summaryData.keyTerms)}`;
    if (contextData.summaryData.formulas?.length) systemPrompt += `\nFORMULAS: ${JSON.stringify(contextData.summaryData.formulas)}`;
    
    if (contextData.summaryData.questions?.length) {
      systemPrompt += `\nQUIZ QUESTIONS:\n`;
      contextData.summaryData.questions.forEach((q: any, i: number) => {
        const userPickedLetter = contextData.quizAnswers ? contextData.quizAnswers[i] : null;
        let userPickedText = "Did not answer";
        if (userPickedLetter) {
          const optIndex = userPickedLetter.charCodeAt(0) - 65;
          userPickedText = q.options[optIndex] || userPickedLetter;
        }
        
        systemPrompt += `Q${i+1}: ${q.question}\nOptions: ${q.options.join(", ")}\nCorrect Answer: ${q.correct}\nExplanation: ${q.explanation}\nUser Selected: ${userPickedText}\n`;
      });
    }
    systemPrompt += `\n------------------------------`;
  }

  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.5,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      ...safeHistory,
      {
        role: "user",
        content: trimmedMessage,
      },
    ],
  });

  const responseText = completion.choices[0]?.message?.content;
  if (!responseText || responseText.trim().length === 0) {
    throw new Error("Empty response from Groq");
  }

  return responseText.trim();
};

export const summarizeNotes = async (text: string): Promise<{
  summary: string;
  keyTerms: Array<{ term: string; definition: string }>;
  formulas: Array<{ name: string; formula: string; explanation: string }>;
}> => {
  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: `You are an expert educator. Analyze the following study notes and provide:

1. A highly structured, visually clean bullet-point summary in MARKDOWN FORMAT. The entire summary MUST be a SINGLE STRING within the "summary" JSON key. Do NOT produce a nested JSON object for the summary; instead, use Markdown headers (\`##\`, \`###\`) and bullets (\`-\`) within your string.
2. Every distinct fact, property, or step MUST be its own bullet point (\`-\`). Never produce long paragraphs of text.
3. Use bolding (\`**Term**\`) to highlight key vocabulary within the summary.
4. Ensure double newlines (\`\\\\n\\\\n\`) between sections and sub-sections to create clear visual breathing room.
5. Use blockquotes (\`> **Tip:** ...\`) for "Expert Tips", "JEE-specific Advice", or "Common Mistakes". These will be rendered with special emphasis.
6. Explain foundational concepts clearly, focusing on the "learning approach"—explain *why* things happen and connect ideas logically. Use simple, high-school level language.
7. Key terms and definitions. If any important equations are foundational, include them here as well.
8. Extract ALL relevant equations into a dedicated formulas array. If none, return an empty array.

CRITICAL FORMATTING RULE: You MUST format all mathematical expressions, equations, variables, and scientific constants using strict LaTeX notation. Use \`$$ equation $$\` for standalone blocks and \`$ variable $\` for ANY inline math or symbol (e.g., use \`$ u_x $\` instead of \`u_x\`, \`$ \\\\theta $\` instead of \`theta\`). NEVER use plain text for scientific symbols. 
VERY IMPORTANT: Because your output is strictly parsed as JSON, you MUST double-escape ALL LaTeX backslashes. For example, you must write \`\\\\frac\` instead of \`\\frac\`, \`\\\\sin\` instead of \`\\sin\`, and \`\\\\theta\` instead of \`\\theta\`. Failure to double-escape will corrupt the math rendering. Use proper standard Markdown for everything else.

Format your response as a FLAT JSON (ONLY JSON, no other text). Use real newlines in your strings, not literal \\n characters.
{
  "summary": "## Main Topic
- Bullet point 1
- Bullet point 2

### Sub Topic
- Point 1",
  "keyTerms": [
    { "term": "Term name", "definition": "Clear, simple definition" }
  ],
  "formulas": [
    { "name": "Name of Formula", "formula": "$$ F = ma $$", "explanation": "What it calculates" }
  ]
}

NOTES TO ANALYZE:
${text}

Remember: Output ONLY valid JSON.`,
      },
    ],
  });

  try {
    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) throw new Error("Empty response from Groq");

    // Extract JSON from potential markdown code blocks
    let jsonText = responseText;
    if (jsonText.includes("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.includes("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }

    const parsed = JSON.parse(jsonText.trim());
    return {
      summary: parsed.summary,
      keyTerms: parsed.keyTerms || [],
      formulas: parsed.formulas || [],
    };
  } catch (error) {
    console.error("Failed to parse Groq summary response:", error);
    throw new Error("Failed to parse AI response");
  }
};

export const generateMCQ = async (
  text: string,
  difficulty: "Easy" | "Medium" | "Hard",
  count: number,
  targetedTopics?: string
): Promise<
  Array<{
    question: string;
    options: string[];
    correct: string;
    explanation: string;
  }>
> => {
  const difficultyGuide = {
    Easy: "simple, definition-based, straightforward concepts",
    Medium: "application-level, requires understanding, some analysis",
    Hard: "critical thinking, synthesis, complex scenarios, rarely obvious",
  };

  let userPrompt = `You are an expert exam question creator. Create ${count} multiple-choice questions from the following study material at ${difficulty} level.

Difficulty level: ${difficultyGuide[difficulty]}

Return ONLY valid JSON in this format (no markdown, no explanation before/after):
{
  "questions": [
    {
      "question": "The actual question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": "Option A",
      "explanation": "Why this is correct and why others are wrong. Use simple, easy-to-understand language."
    }
  ]
}`;

  if (targetedTopics) {
    userPrompt += `\n\nTARGETED REMEDIAL LEARNING FOCUS:\nThe student recently struggled with or answered incorrectly questions regarding the following specific topics/concepts:\n${targetedTopics}\n\nYou MUST heavily prioritize and test these specific failed topics in your new questions to help them learn, while keeping the rest organically balanced. Do NOT generate the exact same questions as before.`;
  }

  userPrompt += `\n\nSTUDY MATERIAL:\n${text}\n
IMPORTANT RULES:
1. Return ONLY JSON, nothing else
2. Each question must have 4 distinct options
3. Options should be plausible but only one correct
4. Include explanations for learning
5. Vary question types (definition, application, analysis)
6. CRITICAL: ANY mathematical/scientific notation, variable, or symbol (e.g., $ \theta $, $ u_x $) MUST be written in strict LaTeX ($$ equation $$ or $ inline $). NEVER use plain text for scientific symbols.
7. JSON ESCANING: You MUST double-escape all LaTeX backslashes (e.g. \\\\frac, \\\\theta) so they do not break JSON parsing. DO NOT use raw ascii symbols like * or /.`;

  const completion = await client.chat.completions.create({
    model: "llama-3.1-8b-instant",
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: userPrompt,
      },
    ],
  });

  try {
    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) throw new Error("Empty response from Groq");

    let jsonText = responseText;
    if (jsonText.includes("```json")) {
      jsonText = jsonText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    } else if (jsonText.includes("```")) {
      jsonText = jsonText.replace(/```\n?/g, "");
    }

    const parsed = JSON.parse(jsonText.trim());
    return parsed.questions || [];
  } catch (error) {
    console.error("Failed to parse Groq MCQ response:", error);
    throw new Error("Failed to generate MCQs");
  }
};

export default client;