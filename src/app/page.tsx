import Link from "next/link";
import Image from "next/image";
import { getHosts, getReviews } from "@/lib/data";
import HostCard from "@/components/HostCard";
import { MapPin, ChevronRight, Star, Users, Globe, ArrowRight } from "lucide-react";

export default async function HomePage() {
  const allHosts = await getHosts();
  const activeHosts = allHosts.filter((h) => h.status === "active");
  const featuredHosts = activeHosts.slice(0, 3);
  const topHost = activeHosts.sort((a, b) => b.rating - a.rating)[0];

  const allReviews = await Promise.all(activeHosts.map((h) => getReviews(h.id)));
  const flatReviews = allReviews.flat();
  const storyReviews = flatReviews.slice(0, 3);

  const totalReviews = flatReviews.length;

  return (
    <div>

      {/* ───── HERO ───── */}
      <section className="relative overflow-hidden min-h-[680px] flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1800&q=80&auto=format&fit=crop"
          alt="Армянское гостеприимство"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(30,8,0,0.92) 0%, rgba(20,5,0,0.80) 50%, rgba(0,10,40,0.85) 100%)" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 w-full">
          <div className="max-w-3xl">
            {/* Armenian flag stripe */}
            <div className="flex gap-1 mb-8">
              <div className="h-1.5 w-10 rounded-full" style={{ background: "#D4001A" }} />
              <div className="h-1.5 w-10 rounded-full" style={{ background: "#0033A0" }} />
              <div className="h-1.5 w-10 rounded-full" style={{ background: "#F2A900" }} />
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-none tracking-tight">
              Bari Ekeq!
              <br />
              <span style={{ color: "#F2A900" }}>Войди — стань</span>
              <br />
              <span className="text-white">частью большой</span>
              <br />
              <span style={{ color: "#F2A900" }}>армянской семьи</span>
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-xl mb-10 leading-relaxed">
              Армения открывается через сердце семьи. Настоящий ужин, живые истории, вид на Арарат.
              Не отель — <strong className="text-white/90">дом</strong>.
            </p>

            {/* Search bar */}
            <div className="max-w-lg bg-white rounded-2xl p-2 flex gap-2 shadow-2xl mb-8">
              <div className="flex-1 flex items-center gap-2 px-3">
                <MapPin size={18} className="text-gray-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Ереван, Дилижан, Севан..."
                  className="w-full outline-none text-gray-800 placeholder-gray-400 text-sm"
                />
              </div>
              <Link href="/hosts"
                className="px-6 py-3 rounded-xl text-white font-bold text-sm whitespace-nowrap hover:opacity-90 transition"
                style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                Найти семью
              </Link>
            </div>

            {/* Live stats */}
            <div className="flex flex-wrap gap-6">
              {[
                { value: `${activeHosts.length}`, label: "семей ждут вас" },
                { value: "10+", label: "регионов Армении" },
                { value: `${totalReviews}+`, label: "историй гостей" },
                { value: "4.9★", label: "средний рейтинг" },
              ].map((s) => (
                <div key={s.label} className="text-white">
                  <span className="text-2xl font-extrabold" style={{ color: "#F2A900" }}>{s.value}</span>
                  <span className="text-white/60 text-sm ml-1.5">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───── ДЛЯ КОГО ───── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4" style={{ background: "#FDF6EC", color: "#D4001A" }}>Для кого</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Армения — для всех,<br />кто ищет настоящее</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Не важно откуда вы. Важно, что вы открыты новому опыту.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "✈️", title: "Иностранный турист", desc: "Устал от безликих отелей. Хочет увидеть настоящую Армению — не открыточную, а живую.", color: "#D4001A" },
              { icon: "🇦🇲", title: "Армянская диаспора", desc: "Живёт в России, США или Франции. Хочет вернуться к корням, почувствовать родину.", color: "#0033A0" },
              { icon: "🏘️", title: "Армянская семья", desc: "Ереванцы едут в Гюмри. Гюмрийцы едут к Севану. Армения огромна — откройте её для себя.", color: "#F2A900" },
              { icon: "💻", title: "Цифровой кочевник", desc: "Работает удалённо. Ищет тихое место с душой, где можно остановиться на неделю-месяц.", color: "#2D6A4F" },
            ].map((item) => (
              <div key={item.title} className="group p-6 rounded-2xl border-2 border-transparent hover:border-current transition-all card-hover"
                style={{ background: "#FAFAFA" }}>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── КАК ЭТО РАБОТАЕТ ───── */}
      <section className="py-20" style={{ background: "#FDF6EC" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4" style={{ background: "white", color: "#D4001A" }}>Простой вход</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Три шага до незабываемого опыта</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Никаких сложностей. Выбрал — договорился — приехал.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "🔍",
                title: "Выбери семью",
                desc: "Фильтруй по региону, звёздам, опыту, языку и цене. Читай истории реальных гостей.",
                note: "Фильтры: город, звёзды, язык, цена",
              },
              {
                step: "02",
                icon: "💬",
                title: "Забронируй опыт",
                desc: "Напиши семье в чате, уточни детали. Депозит — только после подтверждения.",
                note: "Бесплатная отмена за 48 часов",
              },
              {
                step: "03",
                icon: "🏡",
                title: "Стань своим",
                desc: "Приедь — тебя встретят как дорогого гостя. Уедешь другом. Вернёшься снова.",
                note: "Средний рейтинг возврата: 68%",
              },
            ].map((item, i) => (
              <div key={item.step} className="relative bg-white rounded-2xl p-8 shadow-sm">
                {i < 2 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full items-center justify-center bg-white shadow-md">
                    <ArrowRight size={16} style={{ color: "#D4001A" }} />
                  </div>
                )}
                <div className="text-5xl font-black mb-4 select-none" style={{ color: "#F2A900", opacity: 0.25 }}>{item.step}</div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{item.desc}</p>
                <p className="text-xs font-semibold px-3 py-1.5 rounded-full inline-block" style={{ background: "#FDF6EC", color: "#D4001A" }}>
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── ИЗБРАННЫЕ СЕМЬИ ───── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4" style={{ background: "#FDF6EC", color: "#D4001A" }}>Наши хозяева</span>
              <h2 className="text-4xl font-extrabold text-gray-900">Настоящие армянские семьи</h2>
              <p className="text-gray-500 mt-2">Каждая прошла верификацию. Каждая — особенная.</p>
            </div>
            <Link href="/hosts" className="hidden sm:flex items-center gap-1.5 font-bold hover:gap-3 transition-all text-sm"
              style={{ color: "#D4001A" }}>
              Все {activeHosts.length} семей <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredHosts.map((host) => (
              <HostCard key={host.id} host={host} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/hosts"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
              Посмотреть все семьи <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───── РЕЙТИНГИ ───── */}
      <section className="py-20" style={{ background: "linear-gradient(135deg, #1a0a00 0%, #0a0020 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4 text-yellow-300" style={{ background: "rgba(242,169,0,0.15)" }}>Живые рейтинги</span>
            <h2 className="text-4xl font-extrabold text-white mb-4">Лучшие этого месяца</h2>
            <p className="text-white/50 max-w-xl mx-auto">Голосуют сами гости — честно и открыто</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                trophy: "🏆",
                title: "Семья года",
                winner: "Геворкян",
                detail: "Хор Вирап · 5.0★ · 31 отзыв",
                badge: "⭐ Семья года",
                color: "#F2A900",
              },
              {
                trophy: "🍽️",
                title: "Лучшая кухня",
                winner: "Арутюнян",
                detail: "Ереван · 4.9★ · 23 отзыва",
                badge: "🍽️ Лучшая кухня",
                color: "#D4001A",
              },
              {
                trophy: "🌄",
                title: "Лучший вид",
                winner: "Геворкян",
                detail: "Вид на Арарат · 5.0★",
                badge: "🌄 Лучший вид",
                color: "#0033A0",
              },
              {
                trophy: "🌿",
                title: "Эко-хозяин",
                winner: "Саркисян",
                detail: "Дилижан · 4.8★ · 15 отзывов",
                badge: "🌿 Фермер",
                color: "#2D6A4F",
              },
            ].map((item) => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
                <div className="text-4xl mb-3">{item.trophy}</div>
                <div className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: item.color }}>{item.title}</div>
                <div className="text-xl font-extrabold text-white mb-1">Семья {item.winner}</div>
                <div className="text-white/50 text-sm mb-4">{item.detail}</div>
                <span className="inline-block text-xs px-3 py-1 rounded-full font-semibold" style={{ background: `${item.color}22`, color: item.color }}>
                  {item.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── ИСТОРИИ ГОСТЕЙ ───── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4" style={{ background: "#FDF6EC", color: "#D4001A" }}>Истории, не отзывы</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">«Я приехал туристом,<br />уехал сыном этой семьи»</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Реальные истории людей со всего мира</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {storyReviews.map((rev) => {
              const host = activeHosts.find((h) => h.id === rev.hostId);
              return (
                <div key={rev.id} className="bg-gray-50 rounded-2xl p-7 flex flex-col relative">
                  <div className="text-5xl font-serif text-gray-200 absolute top-4 right-5 leading-none select-none">&ldquo;</div>
                  <div className="flex gap-1 mb-5">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} size={14} fill="#F2A900" color="#F2A900" />
                    ))}
                  </div>
                  <p className="text-gray-700 leading-relaxed mb-6 flex-1 text-sm italic">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                        style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                        {rev.guestName[0]}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{rev.guestName}</div>
                        <div className="text-gray-400 text-xs flex items-center gap-1">
                          <Globe size={10} /> {rev.guestCountry} · {rev.date}
                        </div>
                      </div>
                    </div>
                    {host && (
                      <Link href={`/hosts/${host.id}`} className="text-xs font-semibold hover:underline" style={{ color: "#D4001A" }}>
                        Семья {host.name} →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───── ДЛЯ СВОИХ ───── */}
      <section className="py-20" style={{ background: "#FDF6EC" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style={{ background: "white", color: "#D4001A" }}>Только у нас</span>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                Для своих —<br />
                <span style={{ color: "#D4001A" }}>армяне знакомят армян</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                HayHome — это не только для иностранных туристов. Это платформа, где армянские семьи
                из разных регионов открывают Армению друг другу. Ереванцы едут в Гюмри.
                Гюмрийцы едут к Севану. Вся страна — одна большая семья.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "📖", text: "Обмен рецептами между регионами" },
                  { icon: "🌞", text: "«Отправь детей на лето в деревню» — краткосрочный обмен" },
                  { icon: "🎉", text: "Семейные ивенты и встречи по всей Армении" },
                  { icon: "💬", text: "Форум советов между семьями" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-white shadow-sm">
                      {item.icon}
                    </div>
                    <span className="text-gray-700 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link href="/register" className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full text-white font-bold hover:opacity-90 transition"
                style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>
                Присоединиться <ArrowRight size={18} />
              </Link>
            </div>

            <div className="relative">
              <div className="relative h-80 lg:h-[480px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80&auto=format&fit=crop"
                  alt="Для своих"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg">🤝</div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">Семья Саркисян приглашает</div>
                        <div className="text-gray-500 text-xs">«Приедьте к нам летом — дети будут счастливы!»</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badge */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 text-center">
                <div className="text-3xl font-extrabold" style={{ color: "#D4001A" }}>{activeHosts.length}</div>
                <div className="text-xs text-gray-500 font-medium">семей<br />в сети</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── КУЛЬТУРНЫЙ КОД ───── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4" style={{ background: "#FDF6EC", color: "#D4001A" }}>Чем мы не Airbnb</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Армянский культурный код</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Каждый визит — погружение в культуру, которой тысячи лет</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80&auto=format&fit=crop",
                icon: "🍽️",
                title: "Армянская кухня",
                desc: "Долма, хаш, толма, кюфта, гата, пахлава. Мастер-классы прямо на кухне хозяйки.",
              },
              {
                img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop",
                icon: "🔨",
                title: "Ремёсла",
                desc: "Ковроткачество, кузнечное дело, гончарство, резьба по камню. Живые мастера.",
              },
              {
                img: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&q=80&auto=format&fit=crop",
                icon: "🍷",
                title: "Виноделие",
                desc: "Армения — прародина вина. Домашние погреба, дегустации, сбор урожая.",
              },
              {
                img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80&auto=format&fit=crop",
                icon: "⛪",
                title: "История и вера",
                desc: "Монастыри XII века, хачкары, легенды. Каждая семья — хранитель своей истории.",
              },
            ].map((item) => (
              <div key={item.title} className="group rounded-2xl overflow-hidden shadow-sm border border-gray-100 card-hover">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 text-3xl">{item.icon}</div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── ГЕЙМИФИКАЦИЯ / БЕЙДЖИ ───── */}
      <section className="py-20" style={{ background: "#FDF6EC" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6" style={{ background: "white", color: "#D4001A" }}>Геймификация</span>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-6">
                Зарабатывай статусы.<br />
                <span style={{ color: "#D4001A" }}>Гордись своей семьёй.</span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Каждая семья зарабатывает бейджи за реальные достижения. Это не просто иконки —
                это признание сообщества. Гости видят их первыми.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { emoji: "🍽️", label: "Лучшая кухня", desc: "Рейтинг еды 5.0" },
                  { emoji: "🏡", label: "Хранитель традиций", desc: "100+ гостей" },
                  { emoji: "🍷", label: "Мастер вина", desc: "Виноградник и погреб" },
                  { emoji: "🌍", label: "Полиглот", desc: "3+ языка" },
                  { emoji: "⭐", label: "Семья года", desc: "Голосование" },
                  { emoji: "🌿", label: "Эко-хозяин", desc: "Своё хозяйство" },
                  { emoji: "🔨", label: "Мастер ремёсел", desc: "Мастер-классы" },
                  { emoji: "🐟", label: "Рыбак", desc: "Рыбалка включена" },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                    <span className="text-2xl">{b.emoji}</span>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{b.label}</div>
                      <div className="text-gray-400 text-xs">{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl"
                  style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}>Г</div>
                <div>
                  <div className="font-extrabold text-xl text-gray-900">Семья Геворкян</div>
                  <div className="text-gray-500 text-sm">Хор Вирап, Арарат · С нами с 2024</div>
                </div>
              </div>
              <div className="flex gap-1 mb-6">
                {[1,2,3,4,5].map((i) => <Star key={i} size={20} fill="#F2A900" color="#F2A900" />)}
                <span className="ml-2 font-bold text-gray-900">5.0</span>
                <span className="text-gray-400 text-sm ml-1">(31 отзыв)</span>
              </div>
              <div className="flex flex-wrap gap-2 mb-6">
                {["🍷 Мастер вина", "⭐ Семья года", "🏡 Хранитель традиций"].map((badge) => (
                  <span key={badge} className="badge-pill">{badge}</span>
                ))}
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-gray-600 text-sm italic leading-relaxed">
                  &ldquo;Я приехал туристом, а уехал сыном этой семьи. Геворкяны встретили меня так, как будто знали всю жизнь...&rdquo;
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: "#D4001A" }}>H</div>
                  <span className="text-xs text-gray-500 font-semibold">Hiroshi Tanaka, Япония</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="font-extrabold text-xl" style={{ color: "#D4001A" }}>31</div>
                  <div className="text-xs text-gray-400">отзывов</div>
                </div>
                <div>
                  <div className="font-extrabold text-xl" style={{ color: "#D4001A" }}>5★</div>
                  <div className="text-xs text-gray-400">звёзд</div>
                </div>
                <div>
                  <div className="font-extrabold text-xl" style={{ color: "#D4001A" }}>$55</div>
                  <div className="text-xs text-gray-400">за ночь</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── СТАНДАРТЫ ───── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4" style={{ background: "#FDF6EC", color: "#D4001A" }}>Гарантия качества</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Система звёзд</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Не отельная бюрократия — живые стандарты гостеприимства</p>
          </div>
          <div className="space-y-3">
            {[
              { stars: 1, label: "Базовый", desc: "Чистый дом, отдельная комната, базовый завтрак, базовые удобства" },
              { stars: 2, label: "Стандарт", desc: "Полное питание, Wi-Fi, знание русского или английского языка" },
              { stars: 3, label: "Комфорт", desc: "Экскурсионная программа, отдельный санузел, трансфер, особые удобства" },
              { stars: 4, label: "Премиум", desc: "Профессиональные фото, рейтинг 4.8+, особый сервис, дополнительные опыты" },
              { stars: 5, label: "Элит", desc: "Уникальный опыт: мастер-класс, история семьи, эксклюзивная программа" },
            ].map((tier) => (
              <div key={tier.stars} className="flex items-center gap-4 bg-gray-50 rounded-xl p-5">
                <div className="flex-shrink-0 text-yellow-400 text-lg w-28 font-bold">
                  {"★".repeat(tier.stars)}
                  <span className="text-gray-200">{"★".repeat(5 - tier.stars)}</span>
                </div>
                <div className="font-bold text-gray-900 w-24 flex-shrink-0">{tier.label}</div>
                <div className="text-gray-500 text-sm">{tier.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── CTA — СТАТЬ ХОЗЯИНОМ ───── */}
      <section className="relative py-24 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1600&q=80&auto=format&fit=crop"
          alt="Принять гостей"
          fill className="object-cover"
        />
        <div className="absolute inset-0" style={{ background: "rgba(20,5,0,0.87)" }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">🏠</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            У вас есть дом<br />и желание принять гостей?
          </h2>
          <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
            Зарегистрируйтесь как хозяин бесплатно. Первые 12 месяцев — без комиссии. Вы принимаете гостей — мы берём заботу об остальном.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/become-host"
              className="px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition"
              style={{ background: "linear-gradient(135deg, #F2A900, #D4001A)", color: "white" }}>
              Принять гостей бесплатно
            </Link>
            <Link href="/hosts"
              className="px-10 py-4 rounded-full font-bold text-lg border-2 border-white/30 text-white hover:bg-white/10 transition">
              Посмотреть семьи
            </Link>
          </div>
          <p className="text-white/30 text-sm mt-6">Уже {activeHosts.length} семей принимают гостей · Присоединяйтесь</p>
        </div>
      </section>

    </div>
  );
}
