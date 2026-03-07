# Установка CORS для Backblaze B2 (S3 API)

При использовании Backblaze B2 через S3-совместимый API с Presigned URLs (для прямой загрузки файлов с клиента в бакет) вы можете столкнуться с проблемой: **CORS (Cross-Origin Resource Sharing) ошибка при отправке PUT запроса**.

## Симптоматика

1. Безопасный сервер генерирует корректный Presigned URL (AWS SDK v3).
2. Клиентский код (браузер) отправляет `PUT` запрос (с заголовками, такими как `Content-Type`) на этот URL.
3. Браузер предварительно отправляет **OPTIONS (Preflight)** запрос, чтобы проверить разрешения CORS.
4. Backblaze отклоняет запрос с ошибкой `403 Forbidden` (`AccessDenied: This CORS request is not allowed`), и запрос `PUT` даже не выполняется.

## В чем проблема?

В панели управления Backblaze B2 в настройках бакета есть CORS Rules (например, опция "Share everything in this bucket with every origin") — но **эта настройка из UI часто применяется только к нативному (B2 Native API) интерфейсу**, и её не всегда достаточно для S3-совместимого API.

Для S3 API (через конечные точки формата `s3.eu-central-003.backblazeb2.com`) конфигурация CORS должна быть установлена отдельно с помощью `PutBucketCors` команды S3 API. 

**Важно:** заголовок `Content-Type` должен быть явно разрешён, иначе Preflight запрос на `PUT` завершится ошибкой.

---

## Решение (через скрипт AWS SDK)

Самый надёжный и быстрый способ настроить CORS для бакета Backblaze по протоколу S3 — выполнить небольшой скрипт на Node.js, использующий тот же `@aws-sdk/client-s3`.

### 1. Скрипт настройки

Создайте файл `scripts/set-b2-cors.mjs` в корне вашего проекта со следующим содержимым:

```javascript
// scripts/set-b2-cors.mjs
import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";

// Вставьте свои значения из .env
const REGION = "eu-central-003"; // Ваш регион
const ENDPOINT = "https://s3.eu-central-003.backblazeb2.com";
const ACCESS_KEY_ID = "ВАШ_KEY_ID";
const SECRET_ACCESS_KEY = "ВАШ_APPLICATION_KEY";
const BUCKET_NAME = "loungephotobucket"; // Название вашего бакета

const client = new S3Client({
  region: REGION,
  endpoint: ENDPOINT,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const command = new PutBucketCorsCommand({
  Bucket: BUCKET_NAME,
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedOrigins: ["http://localhost:3000", "https://ВАШ_ДОМЕН_ПРОДАКШЕНА.com"],
        AllowedMethods: ["PUT", "GET", "POST", "DELETE", "HEAD"],
        // ВАЖНО: В S3 API массив AllowedHeaders не поддерживает перечисление вместе с "*". 
        // Поэтому мы ставим просто ["*"]
        AllowedHeaders: ["*"],
        MaxAgeSeconds: 3600,
      }
    ]
  }
});

async function run() {
  try {
    console.log(`Применяем CORS для бакета: ${BUCKET_NAME}...`);
    const response = await client.send(command);
    console.log("✅ CORS успешно обновлен! Ответ:", response.$metadata.httpStatusCode);
  } catch (err) {
    console.error("❌ Ошибка при установке CORS:", err);
  }
}

run();
```

### 2. Запуск скрипта

Выполните скрипт в терминале с помощью Node.js:

```bash
node scripts/set-b2-cors.mjs
```

### 3. Верификация

После того как скрипт вернёт `200`, подождите около минуты (кэш серверов Backblaze) и вы можете проверить, заработал ли CORS для OPTIONS запроса (команда для `curl`):

```bash
curl -s -i -X OPTIONS "https://s3.eu-central-003.backblazeb2.com/loungephotobucket/test-key.jpg" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: PUT" \
  -H "Access-Control-Request-Headers: content-type"
```

В ответе вы должны увидеть `HTTP/1.1 200 OK` и заголовки, разрешающие запрос:
```
access-control-allow-origin: http://localhost:3000
access-control-allow-methods: PUT
access-control-allow-headers: content-type
```

После этого загрузка с фронтенда (React / Next.js Drag-and-Drop) начнет работать без `403` ошибки CORS.
