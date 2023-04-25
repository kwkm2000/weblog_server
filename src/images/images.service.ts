import { Injectable } from "@nestjs/common";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ImagesService {
  private s3: S3Client;
  private bucketName = process.env.AWS_S3_BUCKET_NAME;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async getAllImageUrls(): Promise<string[]> {
    const listObjectsCommandInput = {
      Bucket: this.bucketName,
    };

    try {
      const { Contents } = await this.s3.send(
        new ListObjectsCommand(listObjectsCommandInput)
      );
      const imageUrls = Contents.map(({ Key }) => {
        return `https://${this.bucketName}.s3.amazonaws.com/${Key}`;
      });
      return imageUrls;
    } catch (error) {
      console.error("Error listing objects in S3 bucket:", error);
      throw error;
    }
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: `${uuidv4()}_${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const command = new PutObjectCommand(params);
      await this.s3.send(command);

      const imageUrl = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
      return imageUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }
}
