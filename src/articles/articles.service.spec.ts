import { Test, TestingModule } from "@nestjs/testing";
import { ArticlesService } from "./articles.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { CreateArticleDto, UpdateArticleDto } from "./dto";
import { ArticleEntity } from "./article.entity";
import { TagEntity } from "../tags/tag.entity";
import {
  articles as mockArticles,
  articleEntities as mockArticleEntities,
} from "../../test/mocks/articles";

describe("ArticlesService", () => {
  let service: ArticlesService;
  let articleRepositoryMock: any;
  let tagRepositoryMock: any;

  beforeEach(async () => {
    articleRepositoryMock = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
      remove: jest.fn(),
    };

    tagRepositoryMock = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        {
          provide: getRepositoryToken(ArticleEntity),
          useValue: articleRepositoryMock,
        },
        {
          provide: getRepositoryToken(TagEntity),
          useValue: tagRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("記事の作成", async () => {
      const createArticleDto: CreateArticleDto = {
        title: "Test article",
        headerImage: "",
        text: [
          {
            type: "image",
            url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/A_cat_on_a_motorcycle_in_the_medina_of_Tunis_20171017_131525.jpg/1200px-A_cat_on_a_motorcycle_in_the_medina_of_Tunis_20171017_131525.jpg",
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
                text: "あいうえお",
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
        draft: false,
      };

      const tagEntity1 = new TagEntity();
      tagEntity1.id = 1;
      tagEntity1.label = "Tag 1";

      const tagEntity2 = new TagEntity();
      tagEntity2.id = 2;
      tagEntity2.label = "Tag 2";

      const tagEntity3 = new TagEntity();
      tagEntity3.id = 3;
      tagEntity3.label = "Tag 3";

      tagRepositoryMock.findOneBy.mockResolvedValueOnce(tagEntity1);
      tagRepositoryMock.findOneBy.mockResolvedValueOnce(tagEntity2);
      tagRepositoryMock.findOneBy.mockResolvedValueOnce(tagEntity3);

      const articleEntity = new ArticleEntity();
      articleEntity.id = 1;
      articleEntity.title = createArticleDto.title;
      articleEntity.text = JSON.stringify(createArticleDto.text);
      articleEntity.createdAt = new Date();
      articleEntity.updatedAt = new Date();
      articleEntity.tags = [tagEntity1, tagEntity2, tagEntity3];

      articleRepositoryMock.save.mockResolvedValueOnce(articleEntity);

      const result = await service.create(createArticleDto);

      expect(tagRepositoryMock.findOneBy).toHaveBeenCalledTimes(3);
      expect(articleRepositoryMock.save).toHaveBeenCalledWith(
        expect.any(ArticleEntity)
      );
      expect(result).toEqual({
        id: articleEntity.id,
        title: articleEntity.title,
        text: JSON.parse(articleEntity.text),
        createdAt: articleEntity.createdAt,
        updatedAt: articleEntity.updatedAt,
        tags: articleEntity.tags,
      });
    });
  });

  describe("update", () => {
    it("記事の更新", async () => {
      const id = 1;
      const updateArticleDto: UpdateArticleDto = {
        title: "updated title",
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
        ],
        tagIds: [1, 2],
      };

      const tagEntity1 = new TagEntity();
      tagEntity1.id = 1;
      tagEntity1.label = "Tag 1";

      articleRepositoryMock.findOneBy.mockResolvedValueOnce(
        mockArticleEntities[0]
      );
      articleRepositoryMock.save.mockImplementationOnce(
        jest.fn((article: ArticleEntity) => ({
          ...mockArticleEntities[0],
          ...{
            ...updateArticleDto,
            text: JSON.stringify(updateArticleDto.text),
          },
          updatedAt: new Date(),
        }))
      );

      const result = await service.update(id, updateArticleDto);

      expect(articleRepositoryMock.findOneBy).toHaveBeenCalledWith({ id: id });

      expect(result).toEqual({
        ...mockArticleEntities[0],
        ...updateArticleDto,
        updatedAt: expect.any(Date),
      });
    });
  });

  describe("find", () => {
    it("下書き中ではない記事を全件取得する", async () => {
      const mockArticleEntities = mockArticles.map((article) => {
        return { ...article, text: JSON.stringify(article.text) };
      });
      articleRepositoryMock.find.mockResolvedValueOnce(mockArticleEntities);

      const result = await service.find();

      expect(result).toEqual(
        mockArticles
          .filter((article) => !article.draft)
          .map((mockArticle) => {
            return { ...mockArticle, text: mockArticle.text };
          })
      );
    });
  });

  describe("findDraft", () => {
    it("下書き中の記事全件取得", async () => {
      const mockArticleEntities = mockArticles.map((article) => {
        return { ...article, text: JSON.stringify(article.text) };
      });
      articleRepositoryMock.find.mockResolvedValueOnce(mockArticleEntities);

      const result = await service.findDraft();

      expect(result).toEqual(
        mockArticles
          .filter((article) => article.draft)
          .map((mockArticle) => {
            return { ...mockArticle, text: mockArticle.text };
          })
      );
    });
  });

  describe("findOne", () => {
    it("IDに紐づく記事を取得", async () => {
      const article = mockArticleEntities[0];

      articleRepositoryMock.findOneBy.mockResolvedValueOnce(article);

      const result = await service.findOne(1);

      expect(result).toEqual({ ...article, text: JSON.parse(article.text) });
    });
  });

  describe("remove", () => {
    it("記事の削除", async () => {
      const article = mockArticles[0];

      articleRepositoryMock.remove.mockResolvedValueOnce(article);
      articleRepositoryMock.findOneBy.mockResolvedValueOnce(article);
      await service.remove(article.id);

      expect(articleRepositoryMock.findOneBy).toHaveBeenCalledWith({
        id: article.id,
      });
      expect(articleRepositoryMock.remove).toHaveBeenCalledWith(article);
    });
  });
});
