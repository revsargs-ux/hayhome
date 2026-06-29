import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "linear-gradient(135deg, #D4001A 0%, #F2A900 100%)" }}
    >
      <h1 className="text-[8rem] sm:text-[12rem] font-bold text-white leading-none drop-shadow-lg">
        404
      </h1>
      <p className="text-xl sm:text-2xl text-white/90 font-medium mt-2">
        Страница не найдена
      </p>
      <Link
        href="/"
        className="mt-8 px-8 py-3 bg-white text-[#D4001A] rounded-full font-semibold text-lg shadow-lg hover:scale-105 transition-transform"
      >
        На главную
      </Link>
    </div>
  );
}
