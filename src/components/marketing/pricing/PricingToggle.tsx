"use client";

interface PricingToggleProps {
  isAnnual: boolean;
  onChange: (value: boolean) => void;
}

export function PricingToggle({ isAnnual, onChange }: PricingToggleProps) {
  const options = [
    { id: "month", label: "Mensual", value: false },
    { id: "year", label: "Anual", value: true },
  ];

  return (
    <div className="mt-10 flex items-center justify-center gap-3">
      <div className="inline-flex rounded-full p-1 bg-white border border-border">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.value)}
            className={`rounded-full px-5 py-2 text-[13px] font-semibold transition-all ${
              isAnnual === opt.value
                ? "bg-[#1B2559] text-white"
                : "text-muted-foreground bg-transparent hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {isAnnual && (
        <span className="rounded-full px-3 py-1 text-[12px] font-semibold bg-[#DCFCE7] text-[#15803D]">
          2 meses gratis
        </span>
      )}
    </div>
  );
}