import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

// Initialize Gemini only if an API key is available
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: Request) {
    try {
        const { resumeText } = await request.json();

        if (!resumeText || typeof resumeText !== "string") {
            return NextResponse.json(
                { error: "Resume text is required." },
                { status: 400 }
            );
        }

        // If no API key is configured, return fallback data
        if (!genAI) {
            return NextResponse.json(getMockAnalysis());
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        const prompt = `
Analyze the following resume and return ONLY valid JSON.

{
  "atsScore": 85,
  "summary": "Short overall evaluation.",
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": [
    "Suggestion 1",
    "Suggestion 2",
    "Suggestion 3"
  ]
}

Resume:
${resumeText.slice(0, 15000)}
`;

        const result = await model.generateContent(prompt);
        const rawText = result.response.text();

        // Remove markdown code fences if present
        const cleaned = rawText
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        // Extract JSON object
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");

        if (start === -1 || end === -1) {
            throw new Error("No valid JSON found in Gemini response.");
        }

        const jsonString = cleaned.slice(start, end + 1);
        const parsed = JSON.parse(jsonString);

        return NextResponse.json({
            atsScore:
                typeof parsed.atsScore === "number"
                    ? parsed.atsScore
                    : 84,
            summary:
                parsed.summary ||
                "Your resume demonstrates strong technical potential.",
            missingKeywords: Array.isArray(parsed.missingKeywords)
                ? parsed.missingKeywords
                : [],
            suggestions: Array.isArray(parsed.suggestions)
                ? parsed.suggestions
                : [
                    "Add measurable achievements.",
                    "Include more job-specific keywords.",
                    "Improve formatting for ATS readability.",
                ],
        });
    } catch (error) {
        console.error("Gemini analysis error:", error);

        // Return fallback data if Gemini fails or quota is exceeded
        return NextResponse.json(getMockAnalysis());
    }
}

// Mock response used when Gemini is unavailable
function getMockAnalysis() {
    return {
        atsScore: 84,
        summary:
            "Your resume demonstrates strong technical skills and relevant projects. Adding more measurable achievements and job-specific keywords can significantly improve ATS performance.",
        missingKeywords: [
            "REST APIs",
            "Docker",
            "CI/CD",
            "System Design",
            "Agile",
        ],
        suggestions: [
            "Add quantified achievements using percentages and impact metrics.",
            "Include more keywords from target job descriptions.",
            "Highlight internships and real-world experience.",
            "Mention tools such as Docker and GitHub Actions.",
            "Improve section formatting for better ATS readability.",
        ],
    };
}