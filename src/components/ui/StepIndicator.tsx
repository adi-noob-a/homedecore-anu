"use client";

import { motion } from "framer-motion";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ currentStep, steps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((label, i) => {
        const isActive = i === currentStep;
        const isCompleted = i < currentStep;
        return (
          <div key={i} className="flex items-center gap-2">
            <button
              onClick={() => onStepClick?.(i)}
              disabled={!isCompleted && !isActive}
              className="flex items-center gap-2 group"
            >
              <motion.div
                animate={
                  isActive
                    ? { scale: [1, 1.15, 1], backgroundColor: "rgb(16, 185, 129)" }
                    : isCompleted
                    ? { backgroundColor: "rgb(16, 185, 129)" }
                    : { backgroundColor: "rgb(203, 213, 225)" }
                }
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white ${
                  isCompleted ? "cursor-pointer" : ""
                }`}
              >
                {isCompleted ? "✓" : i + 1}
              </motion.div>
              <span
                className={`hidden sm:inline text-sm font-medium transition-colors ${
                  isActive
                    ? "text-brand-600"
                    : isCompleted
                    ? "text-brand-500"
                    : "text-surface-400"
                }`}
              >
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (
              <motion.div
                animate={{ backgroundColor: isCompleted ? "rgb(16, 185, 129)" : "rgb(203, 213, 225)" }}
                className="w-8 sm:w-12 h-0.5 rounded"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
