"use client";

import { ValidationRule } from "../ui/validation-rule";

interface PasswordRulesProps {
  validations: {
    min: boolean;
    letter: boolean;
    number: boolean;
    special: boolean;
  };
}

export function PasswordRules({ validations }: PasswordRulesProps) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: "#E2E8F0", background: "#FAFAFA" }}
    >
      <p className="mb-3 text-[13px] font-semibold" style={{ color: "#1B2559" }}>
        Password requirements
      </p>
      <div className="space-y-2 text-[12px]">
        <ValidationRule ok={validations.min} text="At least 8 characters" />
        <ValidationRule ok={validations.letter} text="Contains letters" />
        <ValidationRule ok={validations.number} text="Contains numbers" />
        <ValidationRule ok={validations.special} text="Contains special characters" />
      </div>
    </div>
  );
}