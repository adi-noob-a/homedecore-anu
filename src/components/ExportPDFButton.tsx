"use client";

import { useRef, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { FileDown, Loader2, CheckCircle } from "lucide-react";
import type { CalculatorResult, StepData } from "@/lib/types";

interface ExportPDFButtonProps {
  result: CalculatorResult;
  state: StepData;
  clientName?: string;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ExportPDFButton({ result, state, clientName }: ExportPDFButtonProps) {
  const [status, setStatus] = useState<"idle" | "generating" | "success">("idle");
  const printRef = useRef<HTMLDivElement>(null);

  const quoteId = useRef(
    `IDH-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`
  );

  const handleExport = useCallback(async () => {
    setStatus("generating");

    try {
      const html2pdf = (await import("html2pdf.js")).default;

      // Build a hidden print element
      const el = document.createElement("div");
      el.style.cssText = "position:fixed;left:-9999px;top:0;width:210mm;padding:20mm;font-family:sans-serif;background:#fff;color:#111;";
      el.innerHTML = buildPDFHTML(result, state, clientName, quoteId.current);
      document.body.appendChild(el);

      await html2pdf()
        .set({
          margin: [10, 10, 10, 10],
          filename: `Interior-Estimate-${quoteId.current}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, logging: false },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(el)
        .save();

      document.body.removeChild(el);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      console.error("[PDF] generation failed:", err);
      setStatus("idle");
    }
  }, [result, state, clientName]);

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleExport}
      disabled={status === "generating"}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
        status === "success"
          ? "bg-brand-100 text-brand-700"
          : "bg-brand-500 text-white hover:bg-brand-600"
      } disabled:opacity-60`}
    >
      {status === "generating" ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating PDF...
        </>
      ) : status === "success" ? (
        <>
          <CheckCircle className="w-4 h-4" />
          Downloaded!
        </>
      ) : (
        <>
          <FileDown className="w-4 h-4" />
          Download Detailed Estimate (PDF)
        </>
      )}
    </motion.button>
  );
}

function buildPDFHTML(
  result: CalculatorResult,
  state: StepData,
  clientName?: string,
  quoteId?: string
): string {
  const date = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const selectedRooms = state.rooms
    .filter((r) => r.selected)
    .map((r) => `${r.label}${r.quantity > 1 ? ` ×${r.quantity}` : ""}`)
    .join(", ");

  return `
    <div style="max-width:170mm;margin:0 auto;">
      <!-- Header -->
      <div style="border-bottom:3px solid #10b981;padding-bottom:15px;margin-bottom:20px;">
        <h1 style="font-size:22px;font-weight:800;margin:0;color:#0f172a;">Interior Design Hub</h1>
        <p style="font-size:11px;color:#64748b;margin:4px 0 0 0;">Detailed Cost Estimate</p>
      </div>

      <!-- Meta Row -->
      <table style="width:100%;font-size:11px;margin-bottom:20px;">
        <tr>
          <td style="padding:4px 0;"><strong>Quote ID:</strong> ${quoteId ?? "—"}</td>
          <td style="padding:4px 0;text-align:right;"><strong>Date:</strong> ${date}</td>
        </tr>
        ${clientName ? `<tr><td style="padding:4px 0;" colspan="2"><strong>Client:</strong> ${clientName}</td></tr>` : ""}
        <tr>
          <td style="padding:4px 0;" colspan="2"><strong>Property:</strong> ${state.propertyType.charAt(0).toUpperCase() + state.propertyType.slice(1)} · Tier ${state.cityTier.replace("tier", "")}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;" colspan="2"><strong>Rooms:</strong> ${selectedRooms || "None selected"}</td>
        </tr>
      </table>

      <!-- Summary Cards -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="background:#f8fafc;border:1px solid #e2e8f0;padding:10px;width:33%;">
            <div style="font-size:10px;color:#64748b;">Estimated Total Cost</div>
            <div style="font-size:16px;font-weight:700;color:#0f172a;">${formatINR(result.totalCost)}</div>
          </td>
          <td style="background:#f8fafc;border:1px solid #e2e8f0;padding:10px;width:33%;">
            <div style="font-size:10px;color:#64748b;">Budget Range</div>
            <div style="font-size:13px;font-weight:700;color:#0f172a;">${formatINR(result.budgetRange.min)} – ${formatINR(result.budgetRange.max)}</div>
          </td>
          <td style="background:#f8fafc;border:1px solid #e2e8f0;padding:10px;width:33%;">
            <div style="font-size:10px;color:#64748b;">Property Value</div>
            <div style="font-size:13px;font-weight:700;color:#0f172a;">${formatINR(state.propertyValue)}</div>
          </td>
        </tr>
      </table>

      <!-- Selections Table -->
      <h2 style="font-size:13px;font-weight:700;color:#0f172a;margin:0 0 8px 0;">Selected Finishes & Materials</h2>
      <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:20px;">
        <thead>
          <tr style="background:#10b981;color:#fff;">
            <th style="padding:6px 8px;text-align:left;">Category</th>
            <th style="padding:6px 8px;text-align:left;">Selection</th>
            <th style="padding:6px 8px;text-align:right;">Detail</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:6px 8px;">Kitchen Finish</td>
            <td style="padding:6px 8px;text-transform:capitalize;">${state.kitchenFinish}</td>
            <td style="padding:6px 8px;text-align:right;">${state.includeTallUnit ? "+Tall Unit " : ""}${state.includeWickerBaskets ? "+Wicker" : ""}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:6px 8px;">Wardrobe Type</td>
            <td style="padding:6px 8px;text-transform:capitalize;" colspan="2">${state.wardrobeType} · ${state.wardrobeFinish}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:6px 8px;">Countertop</td>
            <td style="padding:6px 8px;text-transform:capitalize;" colspan="2">${state.countertop}</td>
          </tr>
          <tr style="border-bottom:1px solid #e2e8f0;">
            <td style="padding:6px 8px;">Hardware</td>
            <td style="padding:6px 8px;text-transform:capitalize;" colspan="2">${state.hardwareTier}</td>
          </tr>
        </tbody>
      </table>

      <!-- Cost Breakdown -->
      <h2 style="font-size:13px;font-weight:700;color:#0f172a;margin:0 0 8px 0;">Cost Breakdown</h2>
      <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:20px;">
        <thead>
          <tr style="background:#0f172a;color:#fff;">
            <th style="padding:6px 8px;text-align:left;">Category</th>
            <th style="padding:6px 8px;text-align:right;">Amount</th>
            <th style="padding:6px 8px;text-align:right;">% of Total</th>
          </tr>
        </thead>
        <tbody>
          ${result.breakdown.map((b) => `
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:6px 8px;">${b.category}</td>
              <td style="padding:6px 8px;text-align:right;">${formatINR(b.amount)}</td>
              <td style="padding:6px 8px;text-align:right;">${b.percent}%</td>
            </tr>
          `).join("")}
          <tr style="background:#f8fafc;font-weight:700;">
            <td style="padding:8px;">Total Estimated Cost</td>
            <td style="padding:8px;text-align:right;">${formatINR(result.totalCost)}</td>
            <td style="padding:8px;text-align:right;">100%</td>
          </tr>
        </tbody>
      </table>

      <!-- Red Flags -->
      ${result.redFlags.length > 0 ? `
        <h2 style="font-size:13px;font-weight:700;color:#0f172a;margin:0 0 8px 0;">Alerts & Notes</h2>
        <ul style="font-size:10px;color:#475569;padding-left:16px;margin:0 0 20px 0;">
          ${result.redFlags.map((f) => `<li style="margin-bottom:4px;">${f.severity === "critical" ? "🔴" : f.severity === "warning" ? "🟡" : "🔵"} ${f.message}</li>`).join("")}
        </ul>
      ` : ""}

      <!-- Footer -->
      <div style="border-top:2px solid #e2e8f0;padding-top:12px;margin-top:20px;">
        <p style="font-size:9px;color:#94a3b8;line-height:1.5;">
          <strong>Disclaimer:</strong> This document is a structural engineering estimate generated by the Interior Design Hub platform based on the reference interior manual text. All figures are indicative and subject to change based on actual site conditions, material availability, and finalized design scope. This is not a legally binding quotation.
        </p>
        <p style="font-size:9px;color:#94a3b8;margin-top:4px;">
          Generated by Interior Design Hub · ${date} · Quote ID: ${quoteId ?? "—"}
        </p>
      </div>
    </div>
  `;
}
