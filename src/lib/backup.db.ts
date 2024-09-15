import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import { dirname } from "path";
import * as path from "path";

export async function uploadDatabaseToS3(
  bucketName: string,
  region: string,
  accessKeyId: string,
  secretAccessKey: string
): Promise<void> {
  const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  const tmp = path.join(__dirname, "../../db/sqlitedb.db");
  console.log("tmp", tmp);

  const currentDate = new Date();
  const formattedDate = currentDate
    .toISOString()
    .replace(/[:\-T]/g, "")
    .slice(0, 14);
  const targetKey = `backups/${formattedDate}-sqlitedb.db`;

  const fileStream = fs.readFileSync(tmp);

  const params = {
    Bucket: bucketName,
    Key: targetKey,
    Body: fileStream,
  };

  try {
    const result = await s3Client.send(new PutObjectCommand(params));
    console.log(`Successfully uploaded data to ${bucketName}/${targetKey}`);
  } catch (error) {
    throw new Error(`Error uploading to S3: ${error}`);
  }
}
