import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: Request) {
    try {
        const {
            company,
            role,
            resumeText,
            jobDescription,
        } = await request.json();

        if (
            !company ||
            !role ||
            !resumeText ||
            !jobDescription
        ) {
            return NextResponse.json(
                { error: "All fields are required." },
                { status: 400 }
            );
        }

        // Fallback if Gemini is not configured
        if (!genAI) {
            return NextResponse.json({
                coverLetter: generateMockCoverLetter(
                    company,
                    role
                ),
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash",
        });

        const prompt = `
Write a professional and compelling cover letter for the role "${role}" at "${company}".

Use the resume and job description below to tailor the content.

Resume:
${resumeText.slice(0, 10000)}

Job Description:
${jobDescription.slice(0, 10000)}

Requirements:
- Professional tone
- 3 to 5 paragraphs
- Highlight relevant skills and projects
- Explain enthusiasm for the company
- Return plain text only
`;

        const result = await model.generateContent(prompt);
        const coverLetter = result.response.text().trim();

        return NextResponse.json({
            coverLetter,
        });
    } catch (error) {
        console.error("Cover letter generation error:", error);

        // Fallback response if quota is exceeded or an error occurs
        const {
            company = "the company",
            role = "the position",
        } = await request
            .json()
            .catch(() => ({}));

        return NextResponse.json({
            coverLetter: generateMockCoverLetter(
                company,
                role
            ),
        });
    }
}

function generateMockCoverLetter(
    company: string,
    role: string
) {
    return `Dear Hiring Manager,

I am writing to express my interest in the ${role} position at ${company}. As a Computer Science Engineering student with strong experience in Python, React, Next.js, PostgreSQL, AWS, and Machine Learning, I am excited about the opportunity to contribute to your team.

Through projects such as AI Career Copilot and Brain Tumor Classification, I have developed practical experience in full-stack development, database design, and AI-powered applications. These projects strengthened my ability to build scalable, user-focused software solutions.

I am particularly interested in ${company} because of its innovation and commitment to building impactful products. I am eager to bring my technical skills, problem-solving abilities, and enthusiasm for learning to your organization.

Thank you for considering my application. I would welcome the opportunity to discuss how I can contribute to your team.

Sincerely,
Sanjana Damarla`;
}