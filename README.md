# HayHome — Armenian Hospitality

Платформа армянского гостеприимства. Не очередной Airbnb — культурная экосистема, соединяющая путешественников с настоящими армянскими семьями.

## Стек

- **Next.js 16** + **React 19**
- **Tailwind CSS v4**
- **TypeScript**
- **Supabase** — база данных и аутентификация
- **ZAI (glm-5.2)** — AI-помощник

## Команды

```bash
npm run dev        # Разработка
npm run build      # Продакшн-сборка
npm run test:e2e   # E2E тесты
```

## Деплой

Docker-контейнер `hayhome` + Traefik reverse proxy:

```bash
docker build -t hayhome .
docker run -d --name hayhome --restart unless-stopped \
  --network n8n_default \
  -v /home/n8n/websites/hayhome/.env.local:/app/.env.local:ro \
  -l traefik.enable=true \
  -l "traefik.http.routers.hayhome.rule=Host(`hay-home.com`)" \
  -l traefik.http.routers.hayhome.entrypoints=websecure \
  -l traefik.http.routers.hayhome.tls=true \
  -l traefik.http.routers.hayhome.tls.certresolver=mytlschallenge \
  -l traefik.http.services.hayhome.loadbalancer.server.port=3000 \
  hayhome
```

## Структура проекта

```
src/
├── app/           # Страницы и API-роуты (Next.js App Router)
├── components/     # React-компоненты
├── contexts/       # React Contexts (Language, Auth, Lightbox)
├── lib/            # Утилиты, типы, переводы
└── data/           # JSON-данные
```

## Языки

10 языков: 🇷🇺 Русский, 🇺🇸 English, 🇦🇲 Հայերեն, 🇫🇷 Français, 🇩🇪 Deutsch, 🇪🇸 Español, 🇮🇹 Italiano, 🇸🇦 العربية, 🇨🇳 中文, 🇮🇷 فارسی

## Домен

[hay-home.com](https://hay-home.com)
