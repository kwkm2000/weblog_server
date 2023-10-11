import { Test, TestingModule } from "@nestjs/testing";
import { ArticlesController } from "./articles.controller";
import { ArticlesService } from "./articles.service";
import { ArticleEntity } from "./article.entity";
import { TagEntity } from "../tags/tag.entity";
import { CreateArticleDto, UpdateArticleDto } from "./dto";
import { Article } from "./interface";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { articles as articlesMock } from "../../test/mocks/articles";

describe("ArticlesController", () => {
  let articlesController: ArticlesController;
  let articlesService: ArticlesService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(ArticleEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(TagEntity),
          useClass: Repository,
        },
      ],
      imports: [],
    }).compile();

    articlesService = moduleRef.get<ArticlesService>(ArticlesService);
    articlesController = moduleRef.get<ArticlesController>(ArticlesController);
  });

  describe("findAll", () => {
    it("記事を作成日が新しい順に全件取得", async () => {
      const result: Article[] = articlesMock;

      jest
        .spyOn(articlesService, "findAll")
        .mockImplementation(async () => result);

      expect(await articlesController.findAll()).toBe(result);
    });
  });

  describe("findOne", () => {
    it("IDに紐づく記事が返却されること", async () => {
      const result: Article = articlesMock[0];

      jest
        .spyOn(articlesService, "findOne")
        .mockImplementation(async () => result);

      expect(await articlesController.findOne(1)).toBe(result);
    });
  });

  describe("create", () => {
    it("記事が作成できること、作成した記事が返却されること", async () => {
      const articleDto: CreateArticleDto = {
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
      const result: Article = {
        id: 1,
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
        createdAt: new Date("2023-08-06T07:29:52.580Z"),
        updatedAt: new Date("2023-08-06T07:29:52.580Z"),
        tags: [],
        draft: false,
      };

      jest
        .spyOn(articlesService, "create")
        .mockImplementation(async () => result);

      expect(await articlesController.create(articleDto)).toBe(result);
    });
  });

  describe("update", () => {
    it("should update and return an article", async () => {
      const articleDto: UpdateArticleDto = {
        title: "Test",
        text: articlesMock[0].text,
        tagIds: [1],
      };
      const result: Article = {
        ...articlesMock[0],
        title: articleDto.title,
        text: articleDto.text,
      };

      jest
        .spyOn(articlesService, "update")
        .mockImplementation(async () => result);

      expect(await articlesController.update(1, articleDto)).toBe(result);
    });
  });

  describe("remove", () => {
    it("should remove and return an article", async () => {
      jest.spyOn(articlesService, "remove").mockImplementation();

      expect(await articlesController.remove(1)).toBeUndefined();
    });
  });
});
