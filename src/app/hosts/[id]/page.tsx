"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Globe, Star, Phone, Mail, Check, ChevronLeft } from "lucide-react";
import { Host, Review, Booking } from "@/lib/types";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { translateLang, translateBadge, translateAmenity, translateExperience, getLocalizedField } from "@/lib/i18n-utils";

export default function HostProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { tr, lang } = useLang();
  const h = tr.hosts;
  const { user } = useAuth();

  const [host, setHost] = useState<Host | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`/api/hosts/${id}`).then((r) => r.json()),
      fetch(`/api/reviews?hostId=${id}`).then((r) => r.json()),
    ]).then(([hostData, reviewData]) => {
      setHost(hostData);
      setReviews(Array.isArray(reviewData) ? reviewData : []);
      setLoading(false);
    });
  }, [id]);

  // Check if user can leave a review (has completed booking with this host)
  useEffect(() => {
    if (!user) { setCanReview(false); return; }
    fetch("/api/bookings")
      .then((r) => r.ok ? r.json() : [])
      .then((bookings: Booking[]) => {
        const hasCompleted = bookings.some(
          (b) => b.hostId === id && b.status === "completed"
        );
        setCanReview(hasCompleted);
      })
      .catch(() => setCanReview(false));
  }, [user, id]);

  const submitReview = async () => {
    if (reviewComment.trim().length < 10 || submitting) return;
    setSubmitting(true);
    setReviewSuccess(false);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostId: id,
          guestName: user?.name || "",
          guestEmail: user?.email || "",
          rating: reviewRating,
          comment: reviewComment.trim(),
          guestCountry: "Unknown",
        }),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews((prev) => [newReview, ...prev]);
        setReviewComment("");
        setReviewRating(5);
        setReviewSuccess(true);
        setTimeout(() => setReviewSuccess(false), 4000);
      }
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">{tr.common.loading}</p>
      </div>
    </div>
  );

  const familyName = host ? getLocalizedField(host.familyName, host.i18n, "familyName", lang) : "";
  const description = host ? getLocalizedField(host.description, host.i18n, "description", lang) : "";
  const longDescription = host ? getLocalizedField(host.longDescription, host.i18n, "longDescription", lang) : "";

  if (!host) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">
      {h.notFound}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Link href="/hosts" className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium">
          <ChevronLeft size={16} /> {h.backToList}
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden h-72 md:h-96 bg-gray-200">
                <Image src={host.coverPhoto} alt={familyName} fill className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-lg">{familyName}</h1>
                  <div className="flex items-center gap-1.5 text-white/90 mt-1 text-sm">
                    <MapPin size={14} /><span>{host.location}</span>
                  </div>
                </div>
              </div>
              {host.photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {host.photos.slice(0, 4).map((photo, idx) => (
                    <div key={idx} className="relative rounded-xl overflow-hidden aspect-square bg-gray-200">
                      <Image src={photo} alt={`${host.familyName} ${idx + 2}`} fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 25vw, 15vw" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full text-sm font-medium text-yellow-800">
                {"★".repeat(host.stars)} {host.stars}★
              </div>
              {host.verified && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full text-sm font-medium text-green-800">
                  <Check size={13} /> {h.verified}
                </div>
              )}
              {host.rating > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-200 rounded-full text-sm font-medium text-orange-800">
                  <Star size={13} fill="#F2A900" color="#F2A900" />
                  {host.rating} {tr.common.rating} · {host.reviewCount}
                </div>
              )}
              {host.badges?.map((badge) => (
                <span key={badge} className="badge-pill">{translateBadge(badge, lang)}</span>
              ))}
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{h.aboutFamily}</h2>
              <p className="text-gray-700 leading-relaxed">{longDescription}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{h.amenities}</h2>
              <div className="grid grid-cols-2 gap-3">
                {host.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 text-gray-700">
                    <Check size={16} className="text-green-500 flex-shrink-0" />
                    <span>{translateAmenity(a, lang)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Experiences */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{h.experiences}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {host.experiences.map((exp) => (
                  <div key={exp} className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                    <span className="text-xl flex-shrink-0">✨</span>
                    <span className="text-gray-800 font-medium text-sm">{translateExperience(exp, lang)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{h.languages}</h2>
              <div className="flex flex-wrap gap-2">
                {host.languages.map((l) => (
                  <span key={l} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-full text-sm font-medium border border-blue-100">
                    <Globe size={13} /> {translateLang(l, lang)}
                  </span>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">{h.reviews} ({reviews.length})</h2>
                {host.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <Star size={20} fill="#F2A900" color="#F2A900" />
                    <span className="text-3xl font-bold text-gray-900">{host.rating}</span>
                    <span className="text-gray-400 text-sm">/ 5</span>
                  </div>
                )}
              </div>
              {reviews.length === 0 && !canReview ? (
                <p className="text-gray-400 text-center py-8">{h.newGuest}</p>
              ) : (
                <div className="space-y-6">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="relative bg-gray-50 rounded-2xl p-6">
                      <span className="quote-mark">&ldquo;</span>
                      <div className="flex gap-1 mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} size={14}
                            fill={i < rev.rating ? "#F2A900" : "none"}
                            color={i < rev.rating ? "#F2A900" : "#D1D5DB"} />
                        ))}
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">&ldquo;{rev.comment}&rdquo;</p>
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                          style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                          {rev.guestName[0]}
                        </div>
                        <div>
                          <span className="font-bold text-gray-900 block text-sm">{rev.guestName}</span>
                          <span className="text-gray-400 text-xs">🌍 {rev.guestCountry} · {rev.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Review form */}
              {user && canReview && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{h.writeReview}</h3>
                  {reviewSuccess && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-medium">
                      ✓ {h.reviewSuccess}
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button key={star} type="button" onClick={() => setReviewRating(star)}
                            className="hover:scale-110 transition-transform">
                            <Star size={28}
                              fill={star <= reviewRating ? "#F2A900" : "none"}
                              color={star <= reviewRating ? "#F2A900" : "#D1D5DB"} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <textarea
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={h.reviewPlaceholder}
                      rows={4}
                      className="w-full p-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 resize-none"
                    />
                    <button
                      onClick={submitReview}
                      disabled={reviewComment.trim().length < 10 || submitting}
                      className="px-6 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
                    >
                      {submitting ? "..." : h.submitReview}
                    </button>
                  </div>
                </div>
              )}

              {/* Must be guest message */}
              {user && !canReview && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-400 text-sm text-center py-4">{h.mustBeGuest}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right: booking card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-4xl font-extrabold text-gray-900">
                  ${host.pricePerNight}
                  <span className="text-lg font-normal text-gray-500">{h.perNight}</span>
                </div>
                {host.rating > 0 && (
                  <div className="flex items-center justify-center gap-1 mt-1 text-sm text-gray-500">
                    <Star size={14} fill="#F2A900" color="#F2A900" />
                    <span className="font-semibold text-gray-800">{host.rating}</span>
                    <span>({host.reviewCount})</span>
                  </div>
                )}
              </div>

              <Link href={`/book/${host.id}`}
                className="w-full block text-center py-4 rounded-xl text-white font-bold text-lg mb-4 hover:opacity-90 transition active:scale-95"
                style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                {h.book}
              </Link>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400 flex-shrink-0" />
                  <span>{h.upTo} <strong>{host.maxGuests}</strong> {h.guests}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                  <span>{host.city}, {host.region}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-gray-400 flex-shrink-0" />
                  <span>{host.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="break-all text-xs">{host.email}</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 space-y-2">
                {[h.freeCancel, h.directContact, h.noHidden].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
                    <Check size={12} className="text-green-500 flex-shrink-0" />{f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
