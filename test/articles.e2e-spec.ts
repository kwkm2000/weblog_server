import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ExecutionContext } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ArticleEntity } from "../src/articles/article.entity";
import { TagEntity } from "../src/tags/tag.entity";
import { ConfigModule } from "@nestjs/config";
import { JwtAuthGuard } from "../src/auth/jwt-auth.guard";
import { CreateArticleDto, UpdateArticleDto } from "../src/articles/dto";

const mockJwtAuthGuard = (canActivate: boolean) => {
  return jest.fn().mockImplementation(
    () =>
      new (class extends JwtAuthGuard {
        async canActivate(context: ExecutionContext): Promise<boolean> {
          return canActivate;
        }
      })()
  );
};

describe("ArticlesController (e2e)", () => {
  let app: INestApplication;
  let articleRepo: Repository<ArticleEntity>;
  let tagRepo: Repository<TagEntity>;
  const jwt = "";
  const testTags = [1, 2, 3];
  const dto: CreateArticleDto = {
    title: "Test article",
    headerImage: "",
    text: [
      {
        type: "paragraph",
        children: [
          {
            text: "あいうえお",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "",
          },
        ],
      },
      {
        type: "paragraph",
        children: [
          {
            text: "こんにちは",
          },
        ],
      },
    ],
    tagIds: [1, 2, 3],
  };

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
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(mockJwtAuthGuard(true))
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    articleRepo = moduleFixture.get<Repository<ArticleEntity>>(
      getRepositoryToken(ArticleEntity)
    );
    tagRepo = moduleFixture.get<Repository<TagEntity>>(
      getRepositoryToken(TagEntity)
    );
    // データベースのクリーンアップ
    await articleRepo.delete({});
    await tagRepo.delete({});
  });

  afterEach(async () => {
    await app.close();
  });

  it("GET /articles", async () => {
    const article = await articleRepo.save({
      title: "Test Article",
      headerImage: "",
      text: JSON.stringify("Test content"),
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
    });

    const { body } = await request(app.getHttpServer())
      .get("/articles")
      .expect(200);

    expect(body).toHaveLength(1);
    expect(body[0].id).toEqual(article.id);
    expect(body[0].title).toEqual(article.title);
    expect(body[0].text).toEqual(JSON.parse(article.text));
    expect(body[0].headerImage).toEqual(article.headerImage);
  });

  it("GET /articles/:id", async () => {
    const newArticle = await request(app.getHttpServer())
      .post("/articles")
      .set("Authorization", `Bearer ${jwt}`)
      .send(dto)
      .expect(201);

    const res = await request(app.getHttpServer())
      .get(`/articles/${newArticle.body.id}`)
      .expect(200);

    expect(res.body).toHaveProperty("title", dto.title);
    expect(res.body).toHaveProperty("text", dto.text);
  });

  it("PUT /articles/:id", async () => {
    const newArticle = await request(app.getHttpServer())
      .post("/articles")
      .set("Authorization", `Bearer ${jwt}`)
      .send(dto)
      .expect(201);

    const updateDto: UpdateArticleDto = {
      title: "updated Title",
      text: [
        {
          type: "paragraph",
          children: [
            {
              text: "A line of text in a paragraph.",
            },
          ],
        },
        {
          type: "image",
          url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/A_cat_on_a_motorcycle_in_the_medina_of_Tunis_20171017_131525.jpg/1200px-A_cat_on_a_motorcycle_in_the_medina_of_Tunis_20171017_131525.jpg",
          children: [
            {
              text: "",
            },
          ],
        },
      ],
      tagIds: [2, 5, 6],
    };

    await request(app.getHttpServer())
      .put(`/articles/${newArticle.body.id}`)
      .set("Authorization", `Bearer ${jwt}`)
      .send(updateDto)
      .expect(200);

    const updatedArticle = await request(app.getHttpServer())
      .get(`/articles/${newArticle.body.id}`)
      .expect(200);

    expect(updatedArticle.body).toHaveProperty("title", updateDto.title);
    expect(updatedArticle.body).toHaveProperty("text", updateDto.text);
  });

  it("DELETE /articles/:id", async () => {
    const newArticle = await request(app.getHttpServer())
      .post("/articles")
      .set("Authorization", `Bearer ${jwt}`)
      .send(dto)
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/articles/${newArticle.body.id}`)
      .set("Authorization", `Bearer ${jwt}`)
      .expect(200);

    await request(app.getHttpServer())
      .get(`/articles/${newArticle.body.id}`)
      .expect(200);
  });
});
