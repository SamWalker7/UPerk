"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../common/Loader";
import { trackEvent } from "@/lib/analytics";
export function Subscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false)
  const endPoint =
    "https://nbttrereyf.execute-api.us-east-1.amazonaws.com/prod/api/newsletter";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    trackEvent("newsletter_submit_attempt", {
      category: "lead_generation",
    });

    try {
      setLoading(true)
      const response = await fetch(endPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("succeeded");
        trackEvent("newsletter_submit_success", {
          category: "lead_generation",
        });
        trackEvent("sign_up", {
          category: "lead_generation",
          method: "newsletter",
        });
      } else {
        setStatus("failed");
        trackEvent("newsletter_submit_error", {
          category: "lead_generation",
          status_code: response.status,
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("failed");
      trackEvent("newsletter_submit_error", {
        category: "lead_generation",
      });
    } finally {
      setLoading(false)
    }

    // Reset form
    setEmail("");
  };

  useEffect(() => {
    console.log("see the status", status);
    if (status === "failed") {
      toast.error("Form submission failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastId: "error1",
        className: "toast-position",
      });
    } else if (status === "succeeded") {
      toast.success("Submited successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        toastId: "success1",
        className: "toast-position",
      });
    }
    setStatus("");
  }, [status]); // Run effect on status or message change

  return (
    <div className="mx-4 sm:mx-0 ">
      <div
        className="mx-auto w-full max-w-[1280px] rounded-xl min-h-[266px] p-4 sm:p-8 text-white my-10"
        style={{
          background: "linear-gradient(to right, #2465EA, #298AF0, #2B9CF3)",
        }}
      >
        <div className="grid gap-6 md:grid-cols-2 items-center">
          <div className="space-y-4 w-full">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#DEE4EA]">
              Stay Ahead With The Latest In AI!
            </h2>
            <p className="text-[#DEE4EA]">
              At Universal Park, we share insights on state AI innovations
              transforming web development, customer service, and HR
              recruitment. Discover how AI works and matters!
            </p>
          </div>
          <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-[#DEE4EA]"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="example@gmail.com"
                  className="w-full px-3 py-2 rounded-[7px] text-black bg-white mt-2 h-[43px]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                data-analytics-event="newsletter_submit_click"
                data-analytics-category="lead_generation"
                className="w-full mt-3 h-[43px] bg-gray-900 hover:bg-gray-800 text-[#969696] font-medium py-2 rounded-[7px]"
              >
                {loading ?  <Loader  /> : "Subscribe Now"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscribe;
