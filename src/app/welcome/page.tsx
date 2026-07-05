"use client";
import Link from "next/link";
import { useLang } from "@/contexts/LanguageContext";

export default function WelcomePage() {
  const { tr } = useLang();
  const w = tr.welcome;

  if (!w) return null;

  const steps = [
    {
      icon: "🏡",
      title: w.step1title,
      desc: w.step1desc,
      color: "from-red-50 to-orange-50",
      border: "border-red-100",
      num: "01",
    },
    {
      icon: "📅",
      title: w.step2title,
      desc: w.step2desc,
      color: "from-orange-50 to-yellow-50",
      border: "border-orange-100",
      num: "02",
    },
    {
      icon: "🎭",
      title: w.step3title,
      desc: w.step3desc,
      color: "from-yellow-50 to-amber-50",
      border: "border-yellow-100",
      num: "03",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
            >
              H
            </div>
            <span className="text-2xl font-bold text-gray-900">
              Hay<span style={{ color: "#D4001A" }}>Home</span>
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            {w.title}
          </h1>
          <p className="text-gray-500 mt-3 text-lg">{w.subtitle}</p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className={`bg-gradient-to-r ${step.color} border ${step.border} rounded-2xl p-5 flex items-start gap-4`}
            >
              <div className="text-3xl flex-shrink-0">{step.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-gray-400 tracking-widest">{step.num}</span>
                  <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/hosts"
            className="flex-1 text-center py-4 rounded-2xl text-white font-bold text-lg hover:opacity-90 transition shadow-lg"
            style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
          >
            {w.startBtn}
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 text-center py-4 rounded-2xl text-gray-600 font-semibold text-lg border border-gray-200 bg-white hover:bg-gray-50 transition"
          >
            {w.skipBtn}
          </Link>
        </div>
      </div>
    </div>
  );
}
