"use server";

import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "@/lib/r2";
import { randomUUID } from "crypto";

export async function getPresignedUploadUrl(
  filename: string,
  contentType: string,
) {
  const ext = filename.split(".").pop();
  const key = `${randomUUID()}.${ext}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  try {
    const presignedUrl = await getSignedUrl(r2Client, command, {
      expiresIn: 3600,
    });
    const fileUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
    return { success: true, presignedUrl, key, fileUrl };
  } catch (error) {
    console.error("Error generating presigned URL", error);
    return {
      success: false,
      error: "Authentication failed to generate upload link",
    };
  }
}

export async function deletePublicFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });

  try {
    await r2Client.send(command);
    return { success: true };
  } catch (error) {
    console.error("Error deleting file", error);
    return { success: false, error: "Failed to delete file" };
  }
}
