"use client";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users, Globe, Star, Phone, Mail, Check, ChevronLeft, X, Camera, Trash2 } from "lucide-react";
import { Host, Review, Booking } from "@/lib/types";
import { useLang } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useLightbox } from "@/contexts/LightboxContext";
import { translateLang, translateBadge, translateAmenity, translateExperience, getLocalizedField } from "@/lib/i18n-utils";
import FavoriteButton from "@/components/FavoriteButton";
import ChatWidget from "@/components/ChatWidget";
import getUI from "@/lib/ui";
import { addToHistory } from "@/lib/viewHistory";
import Recommendations from "@/components/Recommendations";
import JsonLd from "@/components/JsonLd";

export default function HostProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { tr, lang } = useLang();
  const h = tr.hosts;
  const { user } = useAuth();
  const lightbox = useLightbox();

  const [host, setHost] = useState<Host | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [hasCompletedBooking, setHasCompletedBooking] = useState(false);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const ui = getUI(lang);

  // Review media state
  const [reviewMedia, setReviewMedia] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [mediaError, setMediaError] = useState("");

  // Host photo upload state
  const [hostPhotoInput, setHostPhotoInput] = useState<HTMLInputElement | null>(null);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const isHostOwner = user && host && (user.id === host.user_id || user.role === "admin");

  useEffect(() => {
    Promise.all([
      fetch(`/api/hosts/${id}`).then((r) => r.json()),
      fetch(`/api/reviews?hostId=${id}`).then((r) => r.json()),
      fetch(`/api/bookings?hostId=${id}`).then((r) => r.ok ? r.json() : []),
    ]).then(([hostData, reviewData, bookingData]) => {
      setHost(hostData);
      setReviews(Array.isArray(reviewData) ? reviewData : []);
      setHostBookings(Array.isArray(bookingData) ? bookingData : []);
      setLoading(false);
    });
  }, [id]);

  // Add to view history on mount
  useEffect(() => {
    if (id) addToHistory(id);
  }, [id]);

  // Check if user can leave a review (has completed booking with this host)
  useEffect(() => {
    if (!user) { setCanReview(false); return; }
    fetch("/api/bookings")
      .then((r) => r.ok ? r.json() : [])
      .then((bookings: Booking[]) => {
        const hasCompleted = bookings && bookings.some(
          (b) => b.hostId === id && b.status === "completed"
        );
        setHasCompletedBooking(!!hasCompleted);
        setCanReview(!!hasCompleted);
        // Check if user has a confirmed/paid booking → unlock contacts
        const hasConfirmed = bookings && bookings.some(
          (b) => b.hostId === id && (b.status === "confirmed" || b.status === "completed")
        );
        setBookingConfirmed(!!hasConfirmed);
      })
      .catch(() => setCanReview(false));
  }, [user, id]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaError("");
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 1024 * 1024) {
        setMediaError(ui.maxFileSize);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setReviewMedia((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (audioInputRef.current) audioInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const removeMedia = (index: number) => {
    setReviewMedia((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle host photo upload
  const handleHostPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !host) return;

    setUploadingPhotos(true);
    setPhotoError("");

    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      fd.append("folder", "hosts");

      const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
      if (!uploadRes.ok) {
        const errData = await uploadRes.json().catch(() => ({}));
        setPhotoError(errData.error || "Upload failed");
        setUploadingPhotos(false);
        return;
      }

      const { urls } = await uploadRes.json();
      const newPhotos = [...(host.photos || []), ...urls];

      const patchRes = await fetch(`/api/hosts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: newPhotos }),
      });

      if (patchRes.ok) {
        const updated = await patchRes.json();
        setHost(updated);
      }
    } catch {
      setPhotoError("Network error");
    } finally {
      setUploadingPhotos(false);
      if (e.target) e.target.value = "";
    }
  };

  const handleDeletePhoto = async (photoUrl: string) => {
    if (!host || !isHostOwner) return;
    if (!confirm("Удалить это фото?")) return;

    const newPhotos = host.photos.filter((p) => p !== photoUrl);
    const newCover = host.coverPhoto === photoUrl ? (newPhotos[0] || "") : host.coverPhoto;

    try {
      // Delete from Supabase Storage
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: photoUrl }),
      });

      const patchRes = await fetch(`/api/hosts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photos: newPhotos, coverPhoto: newCover }),
      });

      if (patchRes.ok) {
        const updated = await patchRes.json();
        setHost(updated);
      }
    } catch {
      // ignore
    }
  };

  const getMediaType = (url: string): "image" | "audio" | "video" => {
    if (url.startsWith("data:image")) return "image";
    if (url.startsWith("data:audio")) return "audio";
    if (url.startsWith("data:video")) return "video";
    if (/\.(jpg|jpeg|png|gif|webp|svg)/i.test(url)) return "image";
    if (/\.(mp3|wav|ogg|m4a|aac)/i.test(url)) return "audio";
    if (/\.(mp4|webm|mov|avi|mkv)/i.test(url)) return "video";
    return "image";
  };

  const computeMediaType = (media: string[]): "image" | "audio" | "video" | "mixed" => {
    const types = new Set(media.map(getMediaType));
    if (types.size <= 1) {
      return (Array.from(types)[0] as "image" | "audio" | "video") || "image";
    }
    return "mixed";
  };

  const submitReview = async () => {
    if (reviewComment.trim().length < 10 || submitting) return;
    setSubmitting(true);
    setReviewSuccess(false);
    try {
      const body: Record<string, unknown> = {
        hostId: id,
        guestName: user?.name || "",
        guestEmail: user?.email || "",
        rating: reviewRating,
        comment: reviewComment.trim(),
        guestCountry: "Unknown",
      };
      if (reviewMedia.length > 0) {
        body.media = reviewMedia;
        body.media_type = computeMediaType(reviewMedia);
      }
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const newReview = await res.json();
        setReviews((prev) => [newReview, ...prev]);
        setReviewComment("");
        setReviewRating(5);
        setReviewMedia([]);
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

  const lodgingJsonLd = host ? {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: getLocalizedField(host.familyName, host.i18n, 'familyName', lang) || host.familyName,
    description: getLocalizedField(host.description, host.i18n, 'description', lang) || host.description,
    url: `https://hay-home.com/hosts/${host.id}`,
    image: host.photos?.[0] || host.coverPhoto,
    address: {
      "@type": "PostalAddress",
      addressLocality: host.city || "Yerevan",
      addressCountry: "AM",
    },
    priceRange: host.pricePerNight ? `$${host.pricePerNight}` : "$$",
    telephone: host.phone,
    aggregateRating: reviews.length > 0 ? {
      "@type": "AggregateRating",
      ratingValue: (reviews.reduce((acc: number, r: Review) => acc + r.rating, 0) / reviews.length).toFixed(1),
      reviewCount: reviews.length,
    } : undefined,
  } : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {lodgingJsonLd && <JsonLd data={lodgingJsonLd} />}
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
              <div
                className="relative rounded-2xl overflow-hidden h-72 md:h-96 bg-gray-200 cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => {
                  const imgs = [host.coverPhoto, ...host.photos.filter(p => p !== host.coverPhoto)];
                  lightbox.open(imgs, 0);
                }}
              >
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
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {host.photos.slice(0, 4).map((photo, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl overflow-hidden aspect-square bg-gray-200 cursor-pointer hover:opacity-90 transition-opacity group"
                      onClick={() => {
                        const imgs = [host.coverPhoto, ...host.photos.filter(p => p !== host.coverPhoto)];
                        const targetIdx = Math.min(idx + 1, imgs.length - 1);
                        lightbox.open(imgs, targetIdx);
                      }}
                    >
                      <Image src={photo} alt={`${host.familyName} ${idx + 2}`} fill
                        className="object-cover hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 25vw, 15vw" />
                      {isHostOwner && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeletePhoto(photo); }}
                          className="absolute top-1 right-1 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md hover:scale-110"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Upload button for host/admin */}
              {isHostOwner && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    ref={setHostPhotoInput}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleHostPhotoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => hostPhotoInput?.click()}
                    disabled={uploadingPhotos}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-sm font-semibold transition hover:opacity-90 disabled:opacity-50"
                    style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
                  >
                    <Camera size={16} /> {uploadingPhotos ? "..." : "Добавить фото"}
                  </button>
                  {photoError && <span className="text-red-500 text-xs">{photoError}</span>}
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
                  <span key={l} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 rounded-full text-sm font-medium border border-amber-100">
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

                      {/* Review media gallery */}
                      {rev.media && rev.media.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {rev.media.map((m, idx) => {
                            const type = getMediaType(m);
                            if (type === "image") {
                              return (
                                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200 cursor-pointer group">
                                  <Image src={m} alt={`media-${idx}`} fill className="object-cover" sizes="80px"
                                    onClick={() => lightbox.open(rev.media!.filter((mm) => getMediaType(mm) === "image"), idx)} />
                                </div>
                              );
                            }
                            if (type === "audio") {
                              return (
                                <div key={idx} className="bg-white rounded-lg p-2 border border-gray-200">
                                  <audio controls className="h-8 max-w-[200px]">
                                    <source src={m} />
                                  </audio>
                                </div>
                              );
                            }
                            // video thumbnail
                            return (
                              <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-800 cursor-pointer group">
                                <video src={m} className="w-full h-full object-cover" muted />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-white text-2xl opacity-80 group-hover:opacity-100">▶</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

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
              {!user && (
                <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                  <a href="/auth/login" className="inline-block px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition text-sm">
                    Войти чтобы оставить отзыв
                  </a>
                </div>
              )}
              {user && !hasCompletedBooking && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-500 text-sm text-center py-2">Отзыв можно оставить после завершения пребывания</p>
                </div>
              )}
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

                    {/* Media upload buttons */}
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-sm font-medium text-gray-700"
                        >
                          {ui.addPhoto}
                        </button>
                        <button
                          type="button"
                          onClick={() => audioInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-sm font-medium text-gray-700"
                        >
                          {ui.addAudio}
                        </button>
                        <button
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-sm font-medium text-gray-700"
                        >
                          {ui.addVideo}
                        </button>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <input
                        ref={audioInputRef}
                        type="file"
                        accept="audio/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      {mediaError && (
                        <p className="text-red-500 text-xs mt-1">{mediaError}</p>
                      )}

                      {/* Media preview */}
                      {reviewMedia.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {reviewMedia.map((m, idx) => {
                            const type = getMediaType(m);
                            return (
                              <div key={idx} className="relative group">
                                {type === "image" && (
                                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-200">
                                    <Image src={m} alt={`preview-${idx}`} fill className="object-cover" sizes="80px" />
                                  </div>
                                )}
                                {type === "audio" && (
                                  <div className="w-20 h-20 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                                    <span className="text-2xl">🎙️</span>
                                  </div>
                                )}
                                {type === "video" && (
                                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-800">
                                    <video src={m} className="w-full h-full object-cover" muted />
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeMedia(idx)}
                                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:scale-110 transition"
                                >
                                  <X size={11} />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

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
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 lg:sticky lg:top-24">
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
                className="w-full block text-center py-4 rounded-xl text-white font-bold text-lg mb-3 hover:opacity-90 transition active:scale-95"
                style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                {h.book}
              </Link>

              <div className="flex gap-2 mb-4">
                {user && host.user_id && (
                  <button
                    onClick={() => setShowChat(true)}
                    className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition flex items-center justify-center gap-1.5"
                  >
                    💬 {ui.writeMessage}
                  </button>
                )}
                {user && (
                  <div className="flex-shrink-0">
                    <FavoriteButton hostId={host.id} size={24} />
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400 flex-shrink-0" />
                  <span>{h.upTo} <strong>{host.maxGuests}</strong> {h.guests}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                  <span>{host.city}, {host.region}</span>
                </div>
                <a href={`tel:${host.phone}`}
                  className="flex items-center gap-2 group"
                  onClick={(e) => e.stopPropagation()}>
                  <Phone size={16} className="text-gray-400 flex-shrink-0 group-hover:text-red-600 transition" />
                  <span className="font-medium group-hover:text-red-600 transition">{host.phone}</span>
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 font-semibold">📞 {lang === "ru" ? "Позвонить" : "Call"}</span>
                </a>
                <a href={`mailto:${host.email}`}
                  className="flex items-center gap-2 group"
                  onClick={(e) => e.stopPropagation()}>
                  <Mail size={16} className="text-gray-400 flex-shrink-0 group-hover:text-red-600 transition" />
                  <span className="break-all text-xs group-hover:text-red-600 transition">{host.email}</span>
                </a>
              </div>

              {/* 7-day availability calendar */}
              {hostBookings.length > 0 && (() => {
                const today = new Date();
                const bookedDates = new Set<string>();
                hostBookings.forEach((b: Booking) => {
                  if (b.status === "confirmed" || b.status === "completed" || b.status === "pending") {
                    let d = new Date(b.checkIn);
                    const end = new Date(b.checkOut);
                    while (d < end) {
                      bookedDates.add(d.toISOString().split("T")[0]);
                      d.setDate(d.getDate() + 1);
                    }
                  }
                });
                const days = Array.from({ length: 7 }, (_, i) => {
                  const d = new Date(today);
                  d.setDate(d.getDate() + i);
                  return d;
                });
                const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
                const monthNames = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
                return (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-600 mb-2">📅 {lang === "ru" ? "Занятость на 7 дней" : "Availability — next 7 days"}</p>
                    <div className="grid grid-cols-7 gap-1">
                      {days.map((d) => {
                        const dateStr = d.toISOString().split("T")[0];
                        const isBooked = bookedDates.has(dateStr);
                        return (
                          <div key={dateStr} className={`text-center rounded-lg py-1.5 ${isBooked ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
                            <div className="text-[10px] text-gray-400">{dayNames[d.getDay()]}</div>
                            <div className={`text-sm font-bold ${isBooked ? "text-red-500 line-through" : "text-green-600"}`}>{d.getDate()}</div>
                            <div className="text-[9px] text-gray-400">{monthNames[d.getMonth()]}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

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

      {/* Smart Recommendations */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Recommendations
          type="similar-hosts"
          hostId={host.id}
          title="🏠 Другие семьи в этом регионе"
          titleEn="🏠 Other families in this region"
          limit={4}
        />
        <Recommendations
          type="similar-services"
          hostId={host.id}
          title="✨ Услуги рядом"
          titleEn="✨ Services nearby"
          limit={4}
        />
      </div>

      {showChat && user && host.user_id && (
        <ChatWidget
          initialWithUserId={host.user_id}
          openInitially
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}
