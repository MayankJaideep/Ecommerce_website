import "server-only";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

// Payment screenshots are private: they are never placed in /public and are
// only readable through the authenticated admin route.

const driver = process.env.STORAGE_DRIVER === "s3" ? "s3" : "local";
const LOCAL_DIR = path.join(process.cwd(), "storage", "uploads");

let s3: S3Client | undefined;
function getS3() {
  s3 ??= new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT || undefined,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
  });
  return s3;
}

const EXTENSIONS = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

export type ImageType = keyof typeof EXTENSIONS;

// Detect the real type from magic bytes instead of trusting the browser.
export function detectImageType(buf: Buffer): ImageType | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return "image/png";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP")
    return "image/webp";
  return null;
}

export async function saveScreenshot(buf: Buffer, contentType: ImageType, orderCode: string) {
  const key = `payment-screenshots/${orderCode}-${randomUUID()}.${EXTENSIONS[contentType]}`;
  if (driver === "s3") {
    await getS3().send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: buf,
        ContentType: contentType,
      }),
    );
  } else {
    const file = path.join(LOCAL_DIR, key);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, buf);
  }
  return key;
}

// Best-effort cleanup for screenshots whose order row was never created.
export async function deleteScreenshot(key: string) {
  try {
    if (driver === "s3") {
      await getS3().send(new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }));
      return;
    }
    const file = path.resolve(LOCAL_DIR, key);
    if (!file.startsWith(LOCAL_DIR + path.sep)) return;
    await unlink(file);
  } catch {
    // Nothing to clean up — the file may not exist.
  }
}

export async function readScreenshot(key: string): Promise<Buffer | null> {
  try {
    if (driver === "s3") {
      const res = await getS3().send(
        new GetObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key }),
      );
      return res.Body ? Buffer.from(await res.Body.transformToByteArray()) : null;
    }
    const file = path.resolve(LOCAL_DIR, key);
    if (!file.startsWith(LOCAL_DIR + path.sep)) return null;
    return await readFile(file);
  } catch {
    return null;
  }
}
