import { Test, TestingModule } from "@nestjs/testing";
import { ArticlesController } from "./articles.controller";
import { ArticlesService } from "./articles.service";
import { ArticleEntity } from "./article.entity";
import { TagEntity } from "../tags/tag.entity";
import { CreateArticleDto, UpdateArticleDto } from "./dto";
import { Article } from "./interface";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

describe("ArticlesController", () => {
  let articlesController: ArticlesController;
  let articlesService: ArticlesService;
  const articleMock: Article = {
    id: 1,
    title: "Test",
    text: {
      blocks: [
        {
          key: "8o6ur",
          text: "New Article",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [],
          data: {},
        },
      ],
      entityMap: {},
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
  };

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
    it("should return an array of articles", async () => {
      const result: Article[] = [articleMock];

      jest
        .spyOn(articlesService, "findAll")
        .mockImplementation(async () => result);

      expect(await articlesController.findAll()).toBe(result);
    });
  });

  describe("findOne", () => {
    it("should return an article by id", async () => {
      const result: Article = articleMock;

      jest
        .spyOn(articlesService, "findOne")
        .mockImplementation(async () => result);

      expect(await articlesController.findOne(1)).toBe(result);
    });
  });

  describe("create", () => {
    it("should create and return an article", async () => {
      const articleDto: CreateArticleDto = {
        title: "Test",
        text: "Test article",
        tagIds: [1, 2, 3],
      };
      const result: Article = articleMock;

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
        text: JSON.stringify({
          blocks: [
            {
              key: "8o6ur",
              text: "Update Article",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [],
              data: {},
            },
          ],
          entityMap: {},
        }),
        tagIds: [1],
      };
      const result: Article = {
        ...articleMock,
        title: articleDto.title,
        text: JSON.parse(articleDto.text),
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

      console.log(await articlesController.remove(1));
      expect(await articlesController.remove(1)).toBeUndefined();
    });
  });
});
