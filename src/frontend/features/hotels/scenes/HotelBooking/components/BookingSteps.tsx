import React from "react";
import { Check } from "lucide-react";

interface BookingStepsProps {
    currentStep: 1 | 2;
    onStepClick?: (step: 1 | 2) => void;
}

const steps = [
    { id: 1, label: "Traveller Details" },
    { id: 2, label: "Review" },
];

export function BookingSteps({ currentStep, onStepClick }: BookingStepsProps) {
    return (
        <div className="w-full py-6">
            <div className="flex items-start justify-between relative max-w-2xl mx-auto">
                {/* Background Line */}
                <div className="absolute left-0 top-4 h-0.5 w-full bg-gray-200" />

                {/* Active Progress Line */}
                <div
                    className="absolute left-0 top-4 h-0.5 bg-green-600 transition-all duration-500 ease-in-out"
                    style={{ width: currentStep === 1 ? '0%' : '100%' }}
                />

                {steps.map((step) => {
                    const isCompleted = step.id < currentStep;
                    const isCurrent = step.id === currentStep;
                    const isFuture = step.id > currentStep;

                    return (
                        <div
                            key={step.id}
                            className={`relative flex flex-col items-center gap-2 bg-transparent ${!isCurrent ? "cursor-pointer" : ""}`}
                            onClick={() => {
                                if (onStepClick && step.id !== currentStep) {
                                    onStepClick(step.id as 1 | 2);
                                }
                            }}
                        >
                            <div
                                className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 z-10 bg-gray-50
                  ${isCompleted ? "bg-green-600 border-green-600 text-white scale-110" : ""}
                  ${isCurrent ? "bg-white border-green-600 text-green-600 scale-110 shadow-lg shadow-green-100" : ""}
                  ${isFuture ? "bg-white border-gray-300 text-gray-300" : ""}
                `}
                            >
                                {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                            </div>
                            <span
                                className={`absolute top-[110%] left-1/2 -translate-x-1/2 w-max text-center text-xs font-semibold tracking-wide transition-colors duration-300 ${isCurrent ? "text-green-700" : isCompleted ? "text-green-600" : "text-gray-400"}`}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
