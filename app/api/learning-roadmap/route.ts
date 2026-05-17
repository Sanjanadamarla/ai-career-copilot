import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

type RoadmapPhase = {
    title: string;
    duration: string;
    topics: string[];
};

type Roadmap = {
    overview: string;
    missingSkills: string[];
    phases: RoadmapPhase[];
};

export async function POST(request: Request) {
    try {
        const { currentSkills, targetRole } =
            await request.json();

        if (!currentSkills || !targetRole) {
            return NextResponse.json(
                {
                    error:
                        "Current skills and target role are required.",
                },
                { status: 400 }
            );
        }

        // Fallback if Gemini is not configured
        if (!genAI) {
            return NextResponse.json(
                getMockRoadmap(targetRole)
            );
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        const prompt = `
Create a personalized learning roadmap for becoming a "${targetRole}".

Current Skills:
${currentSkills}

Return ONLY valid JSON in this format:

{
  "overview": "Short roadmap overview.",
  "missingSkills": ["Docker", "CI/CD"],
  "phases": [
    {
      "title": "Phase 1: Foundations",
      "duration": "2 weeks",
      "topics": ["Topic 1", "Topic 2"]
    }
  ]
}

Create 4 phases.
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
            overview:
                parsed.overview ||
                `A structured roadmap to become a ${targetRole}.`,
            missingSkills: Array.isArray(parsed.missingSkills)
                ? parsed.missingSkills
                : [
                    "Docker",
                    "CI/CD",
                    "System Design",
                ],
            phases: Array.isArray(parsed.phases)
                ? parsed.phases
                : getMockRoadmap(targetRole).phases,
        });
    } catch (error) {
        console.error("Roadmap generation error:", error);

        const { targetRole = "Software Engineer" } =
            await request
                .json()
                .catch(() => ({}));

        return NextResponse.json(
            getMockRoadmap(targetRole)
        );
    }
}

function getMockRoadmap(
    targetRole: string
): Roadmap {
    return {
        overview:
            `This roadmap is designed to help you become a ${targetRole} by strengthening software engineering fundamentals, tooling, and interview preparation.`,
        missingSkills: [
            "Docker",
            "CI/CD",
            "System Design",
            "Testing",
            "Agile",
        ],
        phases: [
            {
                title: "Phase 1: Strengthen Foundations",
                duration: "2 weeks",
                topics: [
                    "Data Structures & Algorithms",
                    "Object-Oriented Programming",
                    "SQL and Database Design",
                ],
            },
            {
                title: "Phase 2: Development Tools",
                duration: "2 weeks",
                topics: [
                    "Git and GitHub",
                    "Docker",
                    "REST APIs",
                    "Testing Fundamentals",
                ],
            },
            {
                title: "Phase 3: Scalable Systems",
                duration: "3 weeks",
                topics: [
                    "CI/CD Pipelines",
                    "System Design Basics",
                    "Caching and Performance",
                    "Cloud Deployment",
                ],
            },
            {
                title: "Phase 4: Interview Preparation",
                duration: "2 weeks",
                topics: [
                    "Resume Refinement",
                    "Behavioral Interview Practice",
                    "Mock Interviews",
                    "Company-Specific Preparation",
                ],
            },
        ],
    };
}