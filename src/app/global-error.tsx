"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md w-full text-center">
            <div className="text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Что-то пошло не так
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Произошла ошибка. Мы уже знаем о ней. Попробуйте обновить страницу.
            </p>
            <button
              onClick={reset}
              className="px-6 py-3 rounded-xl text-white font-semibold transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #D4001A, #F2A900)" }}
            >
              Обновить
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
