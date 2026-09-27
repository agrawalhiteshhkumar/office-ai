export interface ReportConfig {
  title: string;
  subtitle: string;
  regulatoryBody: "PCI" | "MSBTE" | "DTE" | "MAHA_FFC" | "MAHADBT" | "GOVERNANCE";
  reportRefNo: string;
  dataHeaders: string[];
  dataRows: (string | number)[][];
  summaryMetrics?: { label: string; value: string | number }[];
  auditHash: string;
}

export function generateOfficialReport(config: ReportConfig) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow pop-ups to view printable reports.");
    return;
  }

  const currentDate = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("en-IN");

  const tableHeaderHtml = config.dataHeaders
    .map(
      (h) =>
        `<th style="border: 1px solid #cbd5e1; padding: 8px 10px; background-color: #f1f5f9; color: #0f172a; font-size: 11px; text-transform: uppercase; font-family: sans-serif; text-align: left;">${h}</th>`
    )
    .join("");

  const tableBodyHtml = config.dataRows
    .map(
      (row) =>
        `<tr style="border-bottom: 1px solid #e2e8f0;">
          ${row
            .map(
              (cell) =>
                `<td style="border: 1px solid #cbd5e1; padding: 7px 10px; font-size: 11px; font-family: sans-serif; color: #1e293b;">${cell}</td>`
            )
            .join("")}
        </tr>`
    )
    .join("");

  const summaryMetricsHtml = config.summaryMetrics
    ? `<div style="display: flex; gap: 15px; margin: 15px 0; padding: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px;">
        ${config.summaryMetrics
          .map(
            (m) =>
              `<div style="flex: 1;">
                <div style="font-size: 10px; color: #64748b; font-weight: 600; text-transform: uppercase;">${m.label}</div>
                <div style="font-size: 13px; color: #0f172a; font-weight: bold; margin-top: 2px;">${m.value}</div>
              </div>`
          )
          .join("")}
      </div>`
    : "";

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${config.title} - DPKCOP Sinnar</title>
        <style>
          @page { size: A4; margin: 12mm 15mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #0f172a; margin: 0; padding: 0; }
          .header-box { border-bottom: 2px solid #1e3a8a; padding-bottom: 12px; margin-bottom: 16px; }
          .inst-title { font-size: 18px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin: 0; }
          .inst-sub { font-size: 11px; color: #475569; margin: 2px 0; }
          .statutory-badge { font-size: 10px; font-family: monospace; font-weight: 700; color: #1e40af; background: #dbeafe; padding: 2px 8px; border-radius: 4px; display: inline-block; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          .footer-box { margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid #cbd5e1; padding-top: 16px; }
          .seal-box { border: 1.5px dashed #0284c7; padding: 10px 14px; border-radius: 8px; background: #f0f9ff; max-width: 320px; }
          @media print {
            .no-print { display: none !important; }
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="background: #1e293b; color: white; padding: 10px 16px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-radius: 6px;">
          <span style="font-size: 12px; font-weight: 600;">Office AI Genie™ Official Inspection Document Preview</span>
          <button onclick="window.print()" style="background: #2563eb; color: white; border: none; padding: 6px 16px; font-size: 12px; font-weight: bold; border-radius: 4px; cursor: pointer;">
            Print / Save as PDF
          </button>
        </div>

        <div class="header-box">
          <table style="width: 100%; border: none; margin: 0;">
            <tr>
              <td style="border: none; width: 60px; vertical-align: top;">
                <img src="https://raw.githubusercontent.com/agrawalhiteshhkumar/faculty-ai-genie/main/brightpath-logo.png" style="width: 52px; height: 52px; object-fit: contain;" alt="Logo" />
              </td>
              <td style="border: none; padding-left: 10px; vertical-align: top;">
                <div class="inst-title">D. P. Kharde Navjeevan College of Pharmacy</div>
                <div class="inst-sub">Run by: Navjeevan Education Society, Sinnar, Dist. Nashik - 422103</div>
                <div class="statutory-badge">MSBTE: 62386 | DTE: 5539 | PCI: 9178 | AISHE: S-22693</div>
              </td>
              <td style="border: none; text-align: right; vertical-align: top;">
                <div style="font-size: 10px; color: #64748b; font-weight: 600;">REPORT REF NO</div>
                <div style="font-size: 11px; font-family: monospace; font-weight: bold; color: #0f172a;">${config.reportRefNo}</div>
                <div style="font-size: 10px; color: #64748b; margin-top: 4px;">Date: ${currentDate}</div>
              </td>
            </tr>
          </table>
        </div>

        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <h2 style="font-size: 15px; margin: 0; color: #0f172a; text-transform: uppercase; font-weight: 800;">${config.title}</h2>
            <span style="background: #0f172a; color: #fff; font-size: 9px; font-weight: 700; padding: 3px 8px; border-radius: 4px; font-family: monospace;">REGULATORY: ${config.regulatoryBody}</span>
          </div>
          <div style="font-size: 12px; color: #475569; margin-top: 2px;">${config.subtitle}</div>
        </div>

        ${summaryMetricsHtml}

        <table>
          <thead>
            <tr>${tableHeaderHtml}</tr>
          </thead>
          <tbody>
            ${tableBodyHtml}
          </tbody>
        </table>

        <div class="footer-box">
          <div class="seal-box">
            <div style="font-size: 9px; font-weight: bold; color: #0369a1; text-transform: uppercase; letter-spacing: 0.5px;">Statutory Verification Seal</div>
            <div style="font-size: 12px; font-weight: 800; color: #0f172a; margin-top: 2px;">Dr. Hiteshkumar Agrawal</div>
            <div style="font-size: 10px; color: #475569;">Founder & Chief Academic Architect • Principal</div>
            <div style="font-size: 9px; font-family: monospace; color: #059669; font-weight: bold; margin-top: 4px;">LEDGER HASH: ${config.auditHash}</div>
          </div>

          <div style="text-align: right;">
            <div style="font-size: 11px; font-weight: bold; color: #0f172a;">Executive Authority Signatory</div>
            <div style="font-size: 10px; color: #64748b; margin-top: 2px;">D. P. Kharde Navjeevan College of Pharmacy</div>
            <div style="font-size: 9px; color: #94a3b8; margin-top: 4px;">Generated via Office AI Genie™ • v2026.4</div>
          </div>
        </div>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
