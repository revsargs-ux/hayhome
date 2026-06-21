"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart, Globe, Shield, Star } from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";
import { getAboutTexts } from "@/lib/aboutTexts";

export default function AboutPage() {
  const { lang, tr } = useLang();
  const a = getAboutTexts(lang);
  const n = tr.nav;

  return (
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative overflow-hidden min-h-[420px] flex items-center">
        <Image src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1600&q=80&auto=format&fit=crop"
          alt={a.heroTitle} fill className="object-cover" priority />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(20,5,0,0.92) 0%, rgba(10,3,0,0.80) 60%, rgba(0,5,30,0.88) 100%)" }} />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center w-full">
          <div className="flex gap-1 justify-center mb-6">
            <div className="h-1.5 w-8 rounded-full" style={{ background: "#D4001A" }} />
            <div className="h-1.5 w-8 rounded-full" style={{ background: "#0033A0" }} />
            <div className="h-1.5 w-8 rounded-full" style={{ background: "#F2A900" }} />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">{a.heroTitle}</h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed whitespace-pre-line">{a.heroSub}</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4" style={{ background: "#FDF6EC", color: "#D4001A" }}>{a.missionLabel}</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
              {a.missionTitle}<br /><span style={{ color: "#D4001A" }}>{a.missionTitleRed}</span>
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">{a.missionSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: <Heart size={28} style={{ color: "#D4001A" }} />, title: a.card1t, desc: a.card1d },
              { icon: <Globe size={28} style={{ color: "#0033A0" }} />, title: a.card2t, desc: a.card2d },
              { icon: <Star size={28} fill="#F2A900" color="#F2A900" />, title: a.card3t, desc: a.card3d },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className="flex justify-center mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20" style={{ background: "#FDF6EC" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style={{ background: "white", color: "#D4001A" }}>{a.storyLabel}</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-6">{a.storyTitle}</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>{a.story1}</p>
                <p>{a.story2}</p>
                <p><strong className="text-gray-900">HayHome</strong> — {a.story3}</p>
              </div>
            </div>
            <div className="relative h-72 lg:h-96 rounded-3xl overflow-hidden shadow-xl">
              <Image src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop"
                alt={a.storyTitle} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4" style={{ background: "#FDF6EC", color: "#D4001A" }}>{a.valuesLabel}</span>
            <h2 className="text-4xl font-extrabold text-gray-900">{a.valuesTitle}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {a.v.map((item) => (
              <div key={item.t} className="flex gap-4 p-6 rounded-2xl bg-gray-50 card-hover">
                <div className="text-3xl flex-shrink-0">{item.emoji}</div>
                <div><h3 className="font-bold text-gray-900 mb-2">{item.t}</h3><p className="text-gray-500 text-sm leading-relaxed">{item.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #1a0800, #00001a)" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-12">{a.statsTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {a.stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-4xl font-extrabold mb-1" style={{ color: "#F2A900" }}>{s.value}</div>
                <div className="text-white/50 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tone */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4" style={{ background: "#FDF6EC", color: "#D4001A" }}>{a.toneLabel}</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">{a.toneTitle}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{a.toneSub}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {a.tones.map((item) => (
              <div key={item.wrong} className="bg-gray-50 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-400 text-sm">✗</span>
                  <span className="text-gray-400 text-sm line-through">{item.wrong}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500 text-sm">✓</span>
                  <span className="text-gray-900 font-semibold text-sm">{item.right}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-16" style={{ background: "#FDF6EC" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-10 shadow-sm flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                <Shield size={36} className="text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-3">{a.secTitle}</h3>
              <p className="text-gray-600 leading-relaxed mb-4">{a.secDesc}</p>
              <div className="flex flex-wrap gap-3">
                {a.secFeatures.map((f) => (
                  <span key={f} className="text-xs font-semibold px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full">{f}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="text-5xl mb-6">🇦🇲</div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            <span style={{ color: "#D4001A" }}>{a.ctaTitle}</span>
          </h2>
          <p className="text-gray-500 text-lg mb-10">{a.ctaSub}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/hosts"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-bold hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
              {n.findFamily} <ArrowRight size={18} />
            </Link>
            <Link href="/become-host"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold border-2 border-gray-200 text-gray-700 hover:border-red-300 hover:text-red-600 transition">
              {n.hostGuests}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
