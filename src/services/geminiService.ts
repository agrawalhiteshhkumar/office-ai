export interface RegulatoryAnalysisResult {
  issuingAuthority: string;
  circularSubject: string;
  deadlines: string[];
  mandatedActions: string[];
  affectedSections: string[];
  statutoryRiskLevel: "CRITICAL" | "HIGH" | "ROUTINE";
  summary: string;
}

export async function analyzeCircularWithGemini(
  circularText: string,
  apiKey: string
): Promise<RegulatoryAnalysisResult> {
  const prompt = `You are the Lead Institutional Compliance Officer for D. P. Kharde Navjeevan College of Pharmacy (MSBTE Code: 62386, DTE: 5539, PCI: 9178).
Analyze this official communication / circular from a statutory body (MSBTE, PCI, DTE, or FRA):

"""${circularText}"""

Extract strictly a JSON object with this exact shape:
{
  "issuingAuthority": "MSBTE | PCI | DTE | FRA | OTHER",
  "circularSubject": "One-line clear summary",
  "deadlines": ["List of all mandatory cutoff dates or timelines"],
  "mandatedActions": ["Specific procedural steps the college must perform"],
  "affectedSections": ["PRINCIPAL_DESK", "ESTABLISHMENT", "EXAM_CELL", "STUDENT_SECTION", "ACCOUNTS", "STORES"],
  "statutoryRiskLevel": "CRITICAL" | "HIGH" | "ROUTINE",
  "summary": "Concise executive briefing"
}
Output raw JSON only. Do not wrap in backticks or markdown formatting.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      issuingAuthority: "MSBTE / Statutory Body",
      circularSubject: "Automated analysis fallback",
      deadlines: ["Immediate review required"],
      mandatedActions: ["Verify physical circular document manually"],
      affectedSections: ["PRINCIPAL_DESK"],
      statutoryRiskLevel: "ROUTINE",
      summary: "Manual inspection necessary due to processing limits.",
    };
  }
}
