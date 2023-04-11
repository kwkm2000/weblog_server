import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { ArticlesService } from "../src/articles/articles.service";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ArticleEntity } from "../src/articles/article.entity";
import { TagEntity } from "../src/tags/tag.entity";
import { ConfigModule } from "@nestjs/config";

describe("ArticlesController (e2e)", () => {
  let app: INestApplication;
  let articleRepo: Repository<ArticleEntity>;
  let tagRepo: Repository<TagEntity>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              JWT_SECRET_KEY: "jwt_secret_key_for_testing",
            }),
          ],
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    articleRepo = moduleFixture.get<Repository<ArticleEntity>>(
      getRepositoryToken(ArticleEntity)
    );
    tagRepo = moduleFixture.get<Repository<TagEntity>>(
      getRepositoryToken(TagEntity)
    );
  });

  afterEach(async () => {
    await app.close();
  });

  it("GET /articles", async () => {
    const article = await articleRepo.save({
      title: "Test Article",
      text: JSON.stringify("Test content"),
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    });

    const { body } = await request(app.getHttpServer())
      .get("/articles")
      .expect(200);

    // Verify
    // expect(body).toHaveLength(1);
    // expect(body[0].id).toEqual(article.id);
    // expect(body[0].title).toEqual(article.title);
    // expect(body[0].text).toEqual(JSON.parse(article.text));
  });
});
