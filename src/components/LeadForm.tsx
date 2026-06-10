"use client";

import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Phone, Clock, ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import type { LeadInfo } from "@/lib/hooks/useCalculatorState";

interface LeadFormProps {
  leadInfo: LeadInfo;
  onUpdate: <K extends keyof LeadInfo>(key: K, value: LeadInfo[K]) => void;
  onSubmit: () => Promise<void>;
  submissionState: "idle" | "submitting" | "success" | "error";
  submissionError: string;
  onBack: () => void;
}

const TIMELINE_OPTIONS = [
  { value: "immediate" as const, label: "Immediate", subtitle: "Starting within a month" },
  { value: "1-3-months" as const, label: "1–3 Months", subtitle: "Planning in progress" },
  { value: "planning" as const, label: "Planning Phase", subtitle: "Just exploring options" },
];

export function LeadForm({
  leadInfo,
  onUpdate,
  onSubmit,
  submissionState,
  submissionError,
  onBack,
}: LeadFormProps) {
  const isValid =
    leadInfo.name.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadInfo.email) &&
    /^[0-9]{10}$/.test(leadInfo.phone.replace(/\D/g, ""));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || submissionState === "submitting") return;
    await onSubmit();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-200 p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {submissionState === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-8 h-8 text-brand-600" />
            </motion.div>
            <h3 className="text-xl font-bold text-surface-900 mb-2">
              Estimate Saved! 🎉
            </h3>
            <p className="text-surface-500 text-sm max-w-sm mx-auto">
              Your detailed estimate has been saved. You can now download the PDF or view the full breakdown below.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-surface-900">
                Get Your Detailed Estimate
              </h3>
              <p className="text-sm text-surface-500 mt-1">
                Enter your details to save your calculation and unlock the PDF download.
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  value={leadInfo.name}
                  onChange={(e) => onUpdate("name", e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full pl-9 pr-3 py-2.5 border border-surface-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="email"
                  value={leadInfo.email}
                  onChange={(e) => onUpdate("email", e.target.value)}
                  placeholder="rajesh@example.com"
                  className="w-full pl-9 pr-3 py-2.5 border border-surface-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="tel"
                  value={leadInfo.phone}
                  onChange={(e) => onUpdate("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="9876543210"
                  className="w-full pl-9 pr-3 py-2.5 border border-surface-200 rounded-xl text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* Timeline */}
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2.5">
                <Clock className="w-4 h-4 inline mr-1 text-surface-400" />
                Project Timeline
              </label>
              <div className="grid gap-2">
                {TIMELINE_OPTIONS.map((opt) => (
                  <motion.button
                    key={opt.value}
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => onUpdate("timeline", opt.value)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                      leadInfo.timeline === opt.value
                        ? "border-brand-500 bg-brand-50"
                        : "border-surface-200 hover:border-surface-300"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        leadInfo.timeline === opt.value
                          ? "border-brand-500"
                          : "border-surface-300"
                      }`}
                    >
                      {leadInfo.timeline === opt.value && (
                        <div className="w-2 h-2 rounded-full bg-brand-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-surface-900">{opt.label}</div>
                      <div className="text-xs text-surface-500">{opt.subtitle}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Error */}
            {submissionState === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-danger-50 border border-danger-200 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-danger-500 mt-0.5 shrink-0" />
                <span className="text-xs text-danger-700">
                  {submissionError || "Something went wrong. Please try again."}
                </span>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={onBack}
                className="text-sm text-surface-500 hover:text-surface-700 transition-colors"
              >
                ← Back
              </button>
              <motion.button
                type="submit"
                whileHover={{ scale: isValid ? 1.02 : 1 }}
                whileTap={{ scale: isValid ? 0.98 : 1 }}
                disabled={!isValid || submissionState === "submitting"}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isValid && submissionState !== "submitting"
                    ? "bg-brand-500 text-white hover:bg-brand-600"
                    : "bg-surface-100 text-surface-400 cursor-not-allowed"
                }`}
              >
                {submissionState === "submitting" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Save & Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
