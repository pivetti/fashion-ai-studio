type Step = {
  description?: string;
  label: string;
};

type StepperProps = {
  currentStep?: number;
  onStepChange?: (step: number) => void;
  steps: Step[];
};

export function Stepper({
  currentStep = 0,
  onStepChange,
  steps,
}: StepperProps) {
  return (
    <ol className="space-y-2">
      {steps.map((step, index) => {
        const active = index === currentStep;
        const content = (
          <div className="flex items-start gap-3">
            <span
              className={
                active
                  ? "text-sm font-semibold text-[#E3C98A]"
                  : "text-sm font-semibold text-[#6F6A63]"
              }
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p
                className={
                  active
                    ? "text-sm font-semibold text-[#F4EBDD]"
                    : "text-sm font-medium text-[#A9A096]"
                }
              >
                {step.label}
              </p>
              {step.description ? (
                <p className="mt-1 text-xs leading-5 text-[#6F6A63]">
                  {step.description}
                </p>
              ) : null}
            </div>
          </div>
        );

        return (
          <li
            className={
              active
                ? "rounded-2xl border border-[#5C4724] bg-[#1A1712] p-4"
                : "rounded-2xl border border-transparent p-4 text-[#6F6A63]"
            }
            key={step.label}
          >
            {onStepChange ? (
              <button
                className="w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C8A96E]"
                onClick={() => onStepChange(index)}
                type="button"
              >
                {content}
              </button>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ol>
  );
}
