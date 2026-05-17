import { jsPDF } from "jspdf";

export function exportToPdf(
    title: string,
    content: string,
    filename: string
) {
    const doc = new jsPDF();

    const margin = 20;
    const pageWidth =
        doc.internal.pageSize.getWidth() - margin * 2;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(title, margin, 20);

    // Body
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");

    const lines = doc.splitTextToSize(
        content,
        pageWidth
    );

    let y = 35;

    lines.forEach((line: string) => {
        if (
            y >
            doc.internal.pageSize.getHeight() - 20
        ) {
            doc.addPage();
            y = 20;
        }

        doc.text(line, margin, y);
        y += 6;
    });

    doc.save(filename);
}