import { NextResponse } from "next/server";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded." },
                { status: 400 }
            );
        }

        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { error: "Only PDF files are allowed." },
                { status: 400 }
            );
        }

        // Convert uploaded file to Uint8Array
        const arrayBuffer = await file.arrayBuffer();
        const pdfData = new Uint8Array(arrayBuffer);

        // Load PDF
        const loadingTask = pdfjsLib.getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;

        let extractedText = "";

        // Extract text from all pages
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();

            const pageText = content.items
                .map((item: any) => ("str" in item ? item.str : ""))
                .join(" ");

            extractedText += pageText + "\n\n";
        }

        return NextResponse.json({
            text: extractedText.trim(),
        });
    } catch (error) {
        console.error("PDF parsing error:", error);

        return NextResponse.json(
            {
                error:
                    "Failed to parse PDF. Please use a standard text-based PDF.",
            },
            { status: 500 }
        );
    }
}