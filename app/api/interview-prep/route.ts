import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

type InterviewQuestion = {
    category: string;
    question: string;
    idealAnswer: string;
};

export async function POST(request: Request) {
    try {
        const { role, resumeText, jobDescription } =
            await request.json();

        if (!role || !resumeText || !jobDescription) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            );
        }

        // Fallback if Gemini is not configured
        if (!genAI) {
            return NextResponse.json({
                questions: getMockQuestions(role),
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        const prompt = `
Generate 6 interview questions for the role "${role}".

Return ONLY valid JSON in this format:

{
  "questions": [
    {
      "category": "Technical",
      "question": "Question text",
      "idealAnswer": "Detailed ideal answer"
    }
  ]
}

Include:
- 3 Technical questions
- 2 Behavioral questions
- 1 HR question

Resume:
${resumeText.slice(0, 8000)}

Job Description:
${jobDescription.slice(0, 8000)}
`;

        const result = await model.generateContent(prompt);
        const rawText = result.response.text();

        const cleaned = rawText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");

        if (start === -1 || end === -1) {
            throw new Error("No valid JSON found.");
        }

        const parsed = JSON.parse(
            cleaned.slice(start, end + 1)
        );

        const questions = Array.isArray(parsed.questions)
            ? parsed.questions
            : getMockQuestions(role);

        return NextResponse.json({ questions });
    } catch (error) {
        console.error("Interview prep error:", error);

        const { role = "Software Engineer" } =
            await request
                .json()
                .catch(() => ({}));

        return NextResponse.json({
            questions: getMockQuestions(role),
        });
    }
}

function getMockQuestions(
    role: string
): InterviewQuestion[] {
    return [
        {
            category: "Technical",
            question: `What projects have prepared you for the ${role} role?`,
            idealAnswer:
                "Discuss AI Career Copilot and other projects, highlighting full-stack development, database design, and AI integration.",
        },
        {
            category: "Technical",
            question:
                "How would you design and build a scalable web application?",
            idealAnswer:
                "Explain frontend, backend APIs, database design, authentication, caching, and deployment considerations.",
        },
        {
            category: "Technical",
            question:
                "How do you optimize application performance?",
            idealAnswer:
                "Discuss code splitting, database indexing, caching, and API optimization.",
        },
        {
            category: "Behavioral",
            question:
                "Describe a challenging project you completed.",
            idealAnswer:
                "Use the STAR method and explain obstacles, actions, and measurable outcomes.",
        },
        {
            category: "Behavioral",
            question:
                "How do you learn new technologies quickly?",
            idealAnswer:
                "Explain your approach of documentation study, building projects, and iterative experimentation.",
        },
        {
            category: "HR",
            question:
                "Why do you want to join our company?",
            idealAnswer:
                "Connect your career goals with the company's mission, innovation, and impact.",
        },
    ];
}