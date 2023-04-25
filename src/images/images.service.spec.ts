import { Test, TestingModule } from "@nestjs/testing";
import { ImagesService } from "./images.service";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  ListObjectsOutput,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

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

  //   it("should upload an image and return its URL", async () => {
  //     const file = {
  //       originalname: "test.jpg",
  //       buffer: Buffer.from("test"),
  //       mimetype: "image/jpeg",
  //     };
  //     const uuid = "test-uuid";
  //     (uuidv4 as jest.Mock).mockReturnValue(uuid);

  //     jest.spyOn(s3Client, "send").mockResolvedValue({});

  //     const result = await imagesService.uploadImage(file);
  //     const expectedUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uuid}_${file.originalname}`;

  //     expect(result).toEqual(expectedUrl);
  //     expect(s3Client.send).toHaveBeenCalledWith(
  //       new PutObjectCommand({
  //         Bucket: process.env.AWS_S3_BUCKET_NAME,
  //         Key: `${uuid}_${file.originalname}`,
  //         Body: file.buffer,
  //         ContentType: file.mimetype,
  //       })
  //     );
  //   });
});
