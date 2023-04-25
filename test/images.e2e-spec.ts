import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import * as request from "supertest";
import { Express } from "express";

describe("ImagesController (e2e)", () => {
  let app: INestApplication;
  let server: Express;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    server = app.getHttpAdapter().getInstance();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("/images (GET)", async () => {
    const response = await request(server).get("/images");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  //   it("/images (POST)", async () => {
  //     const filePath = "./test-files/test-image.jpg";

  //     const response = await request(server)
  //       .post("/images")
  //       .attach("image", filePath);

  //     expect(response.status).toBe(201);
  //     expect(typeof response.body).toBe("string");
  //     expect(response.body).toMatch(/^https:\/\/.+\.s3\.amazonaws\.com\/.+$/);
  //   });
});
