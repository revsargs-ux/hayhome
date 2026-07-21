"use client";
import { useLang } from "@/contexts/LanguageContext";

export default function AdminNotifications({ hosts, users }: { hosts: any[]; users: any[] }) {
  const { lang } = useLang();
  const t = (ru: string, en: string) => lang === "ru" ? ru : en;

  const handleSend = async () => {
    const recipient = (document.getElementById("notif-recipient") as HTMLSelectElement)?.value;
    const subject = (document.getElementById("notif-subject") as HTMLInputElement)?.value;
    const body = (document.getElementById("notif-body") as HTMLTextAreaElement)?.value;
    if (!recipient || !body) { alert(t("Заполните получателя и сообщение", "Fill recipient and message")); return; }
    try {
      await fetch("/api/chat", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: recipient, subject, body }),
      });
      alert(t("Уведомление отправлено", "Notification sent"));
    } catch { alert(t("Ошибка отправки", "Send error")); }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">{t("Отправить уведомление", "Send Notification")}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Получатель", "Recipient")}</label>
            <select id="notif-recipient" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none">
              <option value="">{t("Выберите...", "Select...")}</option>
              {hosts.filter((h: any) => h.status === "active").map((h: any) => (
                <option key={h.id} value={"host:" + h.id}>{h.familyName} ({h.email})</option>
              ))}
              {users.filter((u: any) => u.role === "guest").map((u: any) => (
                <option key={u.id} value={"user:" + u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Тема", "Subject")}</label>
            <input type="text" id="notif-subject" placeholder={t("Тема сообщения", "Subject")} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("Сообщение", "Message")}</label>
            <textarea id="notif-body" rows={4} placeholder={t("Текст уведомления...", "Message text...")} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none" />
          </div>
          <button onClick={handleSend} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
            {t("Отправить", "Send")}
          </button>
        </div>
      </div>
    </div>
  );
}
