"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../common/Loader";

interface FormData {
  projectType: string;
  additionalInfo: string;
  budgetRange: string;
  timeline: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  company: string;
  address: string;
}

const PROJECT_TYPES = [
  {
    value: "Web Development",
    label: "Web Dev",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    value: "Mobile App",
    label: "Mobile App",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    value: "Software / API",
    label: "Software / API",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    value: "Cloud & DevOps",
    label: "Cloud & DevOps",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
  {
    value: "AI Solution",
    label: "AI Solution",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    value: "Not Sure",
    label: "Not Sure",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const BUDGET_RANGES = ["<$25K", "$25K - $100k", "$100K – $250K", "$250K+"];
const BUDGET_MAP: Record<string, string> = {
  "<$25K": "0-25000",
  "$25K - $100k": "25000-100000",
  "$100K – $250K": "100000-250000",
  "$250K+": "250000+",
};

const TIMELINES = ["<3 months", "3–6 months", "6–12 months", "1+ Years"];
const TIMELINE_MAP: Record<string, string> = {
  "<3 months": "0-3 month",
  "3–6 months": "3-6 month",
  "6–12 months": "6-12 month",
  "1+ Years": "12+ month",
};

const STEPS = ["Project", "Timeline", "Contact"];

const GetAQuote = ({ handleQuoteClose }: { handleQuoteClose: () => void }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const [formData, setFormData] = useState<FormData>({
    projectType: "",
    additionalInfo: "",
    budgetRange: "",
    timeline: "",
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    company: "",
    address: "",
  });

  useEffect(() => {
    if (status === "failed") {
      toast.error("Form submission failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        toastId: "error1",
      });
    } else if (status === "succeeded") {
      toast.success("Submitted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        toastId: "success1",
      });
      handleQuoteClose();
    }
    setStatus("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = () => {
    const newErrors: Partial<FormData> = {};
    if (currentStep === 1) {
      if (!formData.projectType) newErrors.projectType = "Please select a project type";
      if (!formData.additionalInfo) newErrors.additionalInfo = "Project description is required";
    } else if (currentStep === 2) {
      if (!formData.budgetRange) newErrors.budgetRange = "Please select a budget range";
      if (!formData.timeline) newErrors.timeline = "Please select a timeline";
    } else if (currentStep === 3) {
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.emailAddress) newErrors.emailAddress = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.emailAddress))
        newErrors.emailAddress = "Invalid email format";
      if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
      if (!formData.company) newErrors.company = "Company name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep() && currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const quoteEndpoint =
    "https://nbttrereyf.execute-api.us-east-1.amazonaws.com/prod/api/form/submit-form";

  const handleSubmit = async () => {
    if (validateStep()) {
      const formattedData = {
        projectDetails: {
          projectType: formData.projectType,
          projectDescription: formData.additionalInfo,
        },
        timelineAndBudget: {
          budgetRange: BUDGET_MAP[formData.budgetRange] || formData.budgetRange,
          timeline: TIMELINE_MAP[formData.timeline] || formData.timeline,
        },
        contactInfo: {
          fullName: formData.fullName,
          email: formData.emailAddress,
          address: formData.address || "",
          phoneNumber: formData.phoneNumber,
          company: formData.company,
        },
      };

      try {
        setLoading(true);
        const response = await axios.post(quoteEndpoint, formattedData, {
          headers: { "Content-Type": "application/json" },
        });
        setStatus("succeeded");
        console.log("Success:", response.data);
      } catch (error) {
        setStatus("failed");
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const step1Valid = !!(formData.projectType && formData.additionalInfo);
  const step2Valid = !!(formData.budgetRange && formData.timeline);
  const step3Valid = !!(
    formData.fullName &&
    formData.emailAddress &&
    formData.phoneNumber &&
    formData.company
  );

  return (
    <div className="w-full max-w-lg mx-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Get a Free Quote
              </h2>
              <p className="text-[13px] text-gray-400 dark:text-gray-500 mt-0.5">
                We&apos;ll respond within 24 hours
              </p>
            </div>
            <button
              onClick={handleQuoteClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer flex-shrink-0"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex items-center">
            {STEPS.map((step, i) => {
              const stepNum = i + 1;
              const isCompleted = currentStep > stepNum;
              const isActive = currentStep === stepNum;
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold transition-all ${
                        isCompleted
                          ? "bg-blue-600 text-white"
                          : isActive
                          ? "bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/40"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {isCompleted ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        stepNum
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-medium whitespace-nowrap ${
                        isActive || isCompleted
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-3 mb-4 transition-all ${
                        currentStep > stepNum
                          ? "bg-blue-600"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Step 1 — Project Type */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 block mb-3">
                  What are you looking to build?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PROJECT_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange("projectType", type.value)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.projectType === type.value
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                          : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      <span
                        className={
                          formData.projectType === type.value
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-400 dark:text-gray-500"
                        }
                      >
                        {type.icon}
                      </span>
                      <span className="text-[11px] font-medium leading-tight">
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.projectType && (
                  <p className="text-red-500 text-[12px] mt-2">{errors.projectType}</p>
                )}
              </div>

              <div>
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                  Tell us about your project
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[14px] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 resize-none transition-colors"
                  placeholder="Describe your current problem, what you're building, or the outcome you're looking for..."
                  rows={4}
                />
                {errors.additionalInfo && (
                  <p className="text-red-500 text-[12px] mt-1">{errors.additionalInfo}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2 — Timeline & Budget */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 block mb-3">
                  What&apos;s your estimated budget?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BUDGET_RANGES.map((range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => handleInputChange("budgetRange", range)}
                      className={`py-3 px-4 rounded-xl border text-[13px] font-medium transition-all cursor-pointer ${
                        formData.budgetRange === range
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
                {errors.budgetRange && (
                  <p className="text-red-500 text-[12px] mt-2">{errors.budgetRange}</p>
                )}
              </div>

              <div>
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 block mb-3">
                  What&apos;s your ideal timeline?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TIMELINES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleInputChange("timeline", t)}
                      className={`py-3 px-4 rounded-xl border text-[13px] font-medium transition-all cursor-pointer ${
                        formData.timeline === t
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {errors.timeline && (
                  <p className="text-red-500 text-[12px] mt-2">{errors.timeline}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 3 — Contact Info */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                    Full Name
                  </label>
                  <input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[14px] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                    placeholder="Jane Smith"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-[12px] mt-1">{errors.fullName}</p>
                  )}
                </div>
                <div>
                  <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                    Company
                  </label>
                  <input
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[14px] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                    placeholder="Acme Inc."
                  />
                  {errors.company && (
                    <p className="text-red-500 text-[12px] mt-1">{errors.company}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                  Work Email
                </label>
                <input
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[14px] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                  placeholder="jane@company.com"
                />
                {errors.emailAddress && (
                  <p className="text-red-500 text-[12px] mt-1">{errors.emailAddress}</p>
                )}
              </div>

              <div>
                <label className="text-[13px] font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-transparent text-[14px] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-[12px] mt-1">{errors.phoneNumber}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-[14px] font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all cursor-pointer"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              disabled={currentStep === 1 ? !step1Valid : !step2Valid}
              className={`px-6 py-2.5 rounded-xl text-[14px] font-semibold text-white transition-all cursor-pointer ${
                (currentStep === 1 ? !step1Valid : !step2Valid)
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:opacity-90"
              }`}
              style={{
                background: "linear-gradient(to right, #2563EB, #2CA2F4, #34E5FF)",
              }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!step3Valid || loading}
              className={`px-6 py-2.5 rounded-xl text-[14px] font-semibold text-white transition-all cursor-pointer ${
                !step3Valid || loading ? "opacity-40 cursor-not-allowed" : "hover:opacity-90"
              }`}
              style={{
                background: "linear-gradient(to right, #2563EB, #2CA2F4, #34E5FF)",
              }}
            >
              {loading ? <Loader /> : "Send Request"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetAQuote;
