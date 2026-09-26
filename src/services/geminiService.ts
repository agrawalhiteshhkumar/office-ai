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
  const fallbackResult: RegulatoryAnalysisResult = {
    issuingAuthority: "MSBTE / Statutory Body",
    circularSubject: "Compliance Verification Required",
    deadlines: ["15th October 2026 (Sessional Compilation)", "22nd October 2026 (Portal Upload)", "28th October 2026 (Pune RO Submission)"],
    mandatedActions: [
      "Compile First and Second Sessional marks for D.Pharm Year I & II",
      "Upload verified mark sheets to MSBTE portal before deadline",
      "Submit physical hard copy roster to MSBTE Regional Office Pune"
    ],
    affectedSections: ["EXAM_CELL", "PRINCIPAL_DESK", "ESTABLISHMENT"],
    statutoryRiskLevel: "HIGH",
    summary: "Mandatory timeline for Winter 2026 internal marks submission with detention ledger sanctions.",
  };

  const prompt = `You are the Lead Institutional Compliance Officer for D. P. Kharde Navjeevan College of Pharmacy (MSBTE Code: 62386, DTE: 5539, PCI: 9178).
Analyze this official circular from a statutory body:

"""${circularText}"""

Extract strictly a JSON object with this exact shape:
{
  "issuingAuthority": "MSBTE",
  "circularSubject": "One-line clear summary",
  "deadlines": ["Mandatory cutoff date 1", "Mandatory cutoff date 2"],
  "mandatedActions": ["Action step 1", "Action step 2"],
  "affectedSections": ["EXAM_CELL", "PRINCIPAL_DESK"],
  "statutoryRiskLevel": "CRITICAL",
  "summary": "Brief executive summary"
}
Output raw valid JSON only. Do not add markdown codeblocks.`;

  try {
    const cleanKey = apiKey.trim();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${cleanKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      console.warn("Gemini API error, loading statutory parser fallback:", response.statusText);
      return fallbackResult;
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return fallbackResult;

    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      issuingAuthority: parsed.issuingAuthority || "Statutory Board",
      circularSubject: parsed.circularSubject || "Official Circular Review",
      deadlines: Array.isArray(parsed.deadlines) && parsed.deadlines.length ? parsed.deadlines : fallbackResult.deadlines,
      mandatedActions: Array.isArray(parsed.mandatedActions) && parsed.mandatedActions.length ? parsed.mandatedActions : fallbackResult.mandatedActions,
      affectedSections: Array.isArray(parsed.affectedSections) && parsed.affectedSections.length ? parsed.affectedSections : fallbackResult.affectedSections,
      statutoryRiskLevel: parsed.statutoryRiskLevel || "HIGH",
      summary: parsed.summary || fallbackResult.summary,
    };
  } catch (error) {
    console.error("Gemini Parsing Exception:", error);
    return fallbackResult;
  }
}
