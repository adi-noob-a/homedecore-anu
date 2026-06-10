"use client";

import { useState, useCallback, useMemo } from "react";
import type { PropertyType, CityTier, FinishId, WardrobeType, HardwareTier, CountertopType, StepData, CalculatorResult } from "../types";
import { calculateCost, getDefaultRooms, getArchetype } from "../data";

export interface LeadInfo {
  name: string;
  email: string;
  phone: string;
  timeline: "immediate" | "1-3-months" | "planning";
}

export function useCalculatorState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [leadInfo, setLeadInfo] = useState<LeadInfo>({
    name: "",
    email: "",
    phone: "",
    timeline: "planning",
  });
  const [submissionState, setSubmissionState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submissionError, setSubmissionError] = useState<string>("");

  const [state, setState] = useState<StepData>({
    propertyValue: 5000000,
    propertyType: "personal",
    cityTier: "tier1",
    rooms: getDefaultRooms("personal"),
    kitchenFinish: "laminate",
    wardrobeType: "swing",
    wardrobeFinish: "laminate",
    countertop: "granite",
    hardwareTier: "indian",
    includeTallUnit: false,
    includeWickerBaskets: false,
  });

  const update = useCallback(<K extends keyof StepData>(key: K, value: StepData[K]) => {
    setState((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "propertyType") {
        next.rooms = getDefaultRooms(value as PropertyType);
        const archetype = getArchetype(value as PropertyType);
        if (archetype) {
          next.kitchenFinish = archetype.finishDefaults.kitchen;
          next.wardrobeFinish = archetype.finishDefaults.wardrobe;
          next.countertop = archetype.finishDefaults.countertop;
          next.hardwareTier = archetype.hardwareDefault;
        }
      }
      return next;
    });
  }, []);

  const updateLead = useCallback(<K extends keyof LeadInfo>(key: K, value: LeadInfo[K]) => {
    setLeadInfo((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleRoom = useCallback((roomId: string) => {
    setState((prev) => ({
      ...prev,
      rooms: prev.rooms.map((r) =>
        r.id === roomId ? { ...r, selected: !r.selected } : r
      ),
    }));
  }, []);

  const setRoomQuantity = useCallback((roomId: string, quantity: number) => {
    setState((prev) => ({
      ...prev,
      rooms: prev.rooms.map((r) =>
        r.id === roomId ? { ...r, quantity: Math.max(1, quantity) } : r
      ),
    }));
  }, []);

  const result = useMemo<CalculatorResult>(() => calculateCost(state), [state]);

  const canGoNext = useMemo(() => {
    if (currentStep === 0) return state.propertyValue > 0;
    if (currentStep === 1) return state.rooms.some((r) => r.selected);
    return true;
  }, [currentStep, state]);

  const goNext = useCallback(() => {
    if (canGoNext && currentStep < 3) setCurrentStep((s) => s + 1);
  }, [canGoNext, currentStep]);

  const goBack = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  const submit = useCallback(async () => {
    setSubmissionState("submitting");
    setSubmissionError("");

    const { submitCalculation } = await import("../supabaseClient");
    const payload = {
      clientName: leadInfo.name,
      clientEmail: leadInfo.email,
      clientPhone: leadInfo.phone,
      timeline: leadInfo.timeline,
      configurationData: {
        ...state,
        totalCost: result.totalCost,
        budgetRange: result.budgetRange,
        selections: result.selections,
      } as unknown as Record<string, unknown>,
      estimatedTotalCost: result.totalCost,
    };

    const response = await submitCalculation(payload);

    if ("error" in response) {
      setSubmissionState("error");
      setSubmissionError(response.error);
    } else {
      setSubmissionState("success");
      // Auto-advance to breakdown after a brief delay
      setTimeout(() => {
        setCurrentStep(4);
      }, 1200);
    }
  }, [leadInfo, state, result]);

  return {
    state,
    currentStep,
    result,
    leadInfo,
    submissionState,
    submissionError,
    update,
    updateLead,
    toggleRoom,
    setRoomQuantity,
    goNext,
    goBack,
    canGoNext,
    setCurrentStep,
    submit,
    setSubmissionState,
  };
}
