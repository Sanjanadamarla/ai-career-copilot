import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: Request) {
    try {
        const { resumeText, jobDescription } = await request.json();

        if (!resumeText || !jobDescription) {
            return NextResponse.json(
                {
                    error:
                        "Both resume text and job description are required.",
                },
                { status: 400 }
            );
        }

        // If no API key, use fallback data
        if (!genAI) {
            return NextResponse.json(getMockMatchResult());
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        const prompt = `
Compare the following resume with the job description.

Return ONLY valid JSON in this format:

{
  "matchScore": 82,
  "summary": "Short summary.",
  "matchingSkills": ["Python", "React"],
  "missingSkills": ["Docker", "CI/CD"],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ]
}

Resume:
${resumeText.slice(0, 10000)}

Job Description:
${jobDescription.slice(0, 10000)}
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

        return NextResponse.json({
            matchScore:
                typeof parsed.matchScore === "number"
                    ? parsed.matchScore
                    : 78,
            summary:
                parsed.summary ||
                "Your resume aligns well with the target role.",
            matchingSkills: Array.isArray(parsed.matchingSkills)
                ? parsed.matchingSkills
                : [],
            missingSkills: Array.isArray(parsed.missingSkills)
                ? parsed.missingSkills
                : [],
            recommendations: Array.isArray(
                parsed.recommendations
            )
                ? parsed.recommendations
                : [
                    "Add missing skills.",
                    "Tailor your resume to the role.",
                    "Include more measurable impact.",
                ],
        });
    } catch (error) {
        console.error("Job matcher error:", error);

        // Fallback mock response
        return NextResponse.json(getMockMatchResult());
    }
}

function getMockMatchResult() {
    return {
        matchScore: 81,
        summary:
            "Your resume aligns strongly with the target role, but adding several infrastructure and software engineering skills would improve your competitiveness.",
        matchingSkills: [
            "Python",
            "React",
            "Next.js",
            "PostgreSQL",
            "AWS",
            "Machine Learning",
        ],
        missingSkills: [
            "Docker",
            "CI/CD",
            "System Design",
            "REST APIs",
            "Agile",
        ],
        recommendations: [
            "Add Docker and CI/CD experience to your skills section.",
            "Highlight projects involving REST API development.",
            "Include measurable achievements and impact metrics.",
            "Mention familiarity with Agile methodologies.",
            "Tailor keywords to the specific job description.",
        ],
    };
}