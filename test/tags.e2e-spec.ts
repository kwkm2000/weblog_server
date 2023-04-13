import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";
import { Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";
import { TagEntity } from "../src/tags/tag.entity";
import { ConfigModule } from "@nestjs/config";
import { ExecutionContext } from "@nestjs/common";
import { JwtAuthGuard } from "../src/auth/jwt-auth.guard";
import { CreateTagDto, UpdateTagDto } from "../src/tags/dto";

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

describe("TagsController (e2e)", () => {
  let app: INestApplication;
  let tagRepo: Repository<TagEntity>;
  const jwt = "";
  const dto: CreateTagDto = {
    label: "CreateTag",
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

    tagRepo = moduleFixture.get<Repository<TagEntity>>(
      getRepositoryToken(TagEntity)
    );
    // データベースのクリーンアップ
    await tagRepo.delete({});
  });

  afterEach(async () => {
    await app.close();
  });

  it("GET /tags", async () => {
    const newTag = await tagRepo.save({
      label: "Test Tag",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const { body } = await request(app.getHttpServer())
      .get("/tags")
      .expect(200);

    expect(body).toHaveLength(1);
    expect(body[0].id).toEqual(newTag.id);
    expect(body[0].label).toEqual(newTag.label);
  });

  it("GET /tags/:id", async () => {
    const newTag = await request(app.getHttpServer())
      .post("/tags")
      .set("Authorization", `Bearer ${jwt}`)
      .send(dto)
      .expect(201);

    console.log("newTag.body", newTag.body);

    // const res = await request(app.getHttpServer())
    //   .get(`/tags/${newTag.body.id}`)
    //   .expect(200);

    // console.log("res.body", res.body);

    // expect(res.body).toHaveProperty("label", dto.label);
  });

  // it("PUT /articles/:id", async () => {
  //   const newArticle = await request(app.getHttpServer())
  //     .post("/articles")
  //     .set("Authorization", `Bearer ${jwt}`)
  //     .send(dto)
  //     .expect(201);

  //   const updateDto: UpdateArticleDto = {
  //     title: "updated Title",
  //     text: JSON.stringify({
  //       blocks: [
  //         {
  //           key: "8o6ur",
  //           text: "updated Article",
  //           type: "unstyled",
  //           depth: 0,
  //           inlineStyleRanges: [],
  //           entityRanges: [],
  //           data: {},
  //         },
  //       ],
  //       entityMap: {},
  //     }),
  //     tagIds: [2, 5, 6],
  //   };

  //   await request(app.getHttpServer())
  //     .put(`/articles/${newArticle.body.id}`)
  //     .set("Authorization", `Bearer ${jwt}`)
  //     .send(updateDto)
  //     .expect(200);

  //   const updatedArticle = await request(app.getHttpServer())
  //     .get(`/articles/${newArticle.body.id}`)
  //     .expect(200);

  //   expect(updatedArticle.body).toHaveProperty("title", updateDto.title);
  //   expect(updatedArticle.body).toHaveProperty(
  //     "text",
  //     JSON.parse(updateDto.text)
  //   );
  // });

  // it("DELETE /articles/:id", async () => {
  //   const newArticle = await request(app.getHttpServer())
  //     .post("/articles")
  //     .set("Authorization", `Bearer ${jwt}`)
  //     .send(dto)
  //     .expect(201);

  //   await request(app.getHttpServer())
  //     .delete(`/articles/${newArticle.body.id}`)
  //     .set("Authorization", `Bearer ${jwt}`)
  //     .expect(200);

  //   await request(app.getHttpServer())
  //     .get(`/articles/${newArticle.body.id}`)
  //     .expect(200);
  // });
});
