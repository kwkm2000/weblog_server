import { Test, TestingModule } from "@nestjs/testing";
import { ImagesService } from "./images.service";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  ListObjectsOutput,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { Readable } from "stream";

jest.mock("@aws-sdk/client-s3");
jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("ImagesService", () => {
  let imagesService: ImagesService;
  let s3Client: S3Client;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImagesService],
    }).compile();

    imagesService = module.get<ImagesService>(ImagesService);
    s3Client = new S3Client({});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("getAllImageUrls", async () => {
    const listObjectsResult = {
      Contents: [{ Key: "image1.jpg" }, { Key: "image2.jpg" }],
    };

    jest
      .spyOn(s3Client, "send")
      .mockImplementation(
        async (command: ListObjectsCommand) =>
          listObjectsResult as unknown as Promise<ListObjectsOutput>
      );

    const expectedUrls = listObjectsResult.Contents.map(({ Key }) => {
      return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${Key}`;
    });

    const result = await imagesService.getAllImageUrls();
    expect(result).toEqual(expectedUrls);
  });

  it("uploadImage", async () => {
    const file: Express.Multer.File = {
      fieldname: "image",
      originalname: "test.jpg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      size: Buffer.byteLength("test"),
      buffer: Buffer.from("test"),
      stream: new Readable(),
      destination: "",
      filename: "test.jpg",
      path: "",
    };
    const uuid = "test-uuid";
    (uuidv4 as jest.Mock).mockReturnValue(uuid);

    jest.spyOn(s3Client, "send").mockResolvedValue({} as never);

    const result = await imagesService.uploadImage(file);
    const expectedUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uuid}_${file.originalname}`;

    expect(result).toEqual(expectedUrl);
  });
});
