import { Test, TestingModule } from "@nestjs/testing";
import { ImagesController } from "./images.controller";
import { ImagesService } from "./images.service";

// Mock ImagesService
const mockImagesService = () => ({
  getAllImageUrls: jest.fn(),
  uploadImage: jest.fn(),
});

describe("ImagesController", () => {
  let imagesController: ImagesController;
  let imagesService: ImagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImagesController],
      providers: [
        {
          provide: ImagesService,
          useFactory: mockImagesService,
        },
      ],
    }).compile();

    imagesController = module.get<ImagesController>(ImagesController);
    imagesService = module.get<ImagesService>(ImagesService);
  });

  it("定義されている", () => {
    expect(imagesController).toBeDefined();
  });

  describe("getAllImageUrls", () => {
    it("画像URLの配列を返す", async () => {
      const expectedResult = ["url1", "url2", "url3"];
      (imagesService.getAllImageUrls as jest.Mock).mockResolvedValue(
        expectedResult
      );
      const result = await imagesController.getAllImageUrls();
      expect(result).toEqual(expectedResult);
    });
  });

  describe("upload", () => {
    it("アップロードされたimageのURLを返す", async () => {
      const file = { filename: "test.jpg" } as Express.Multer.File;
      const expectedResult = "https://example.com/test.jpg";
      (imagesService.uploadImage as jest.Mock).mockResolvedValue(
        expectedResult
      );
      const result = await imagesController.upload(file);
      expect(result).toEqual(expectedResult);
    });
  });
});
