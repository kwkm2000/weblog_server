import { Test, TestingModule } from "@nestjs/testing";
import { ArticlesService } from "./articles.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ArticleEntity } from "./article.entity";
import { TagEntity } from "../tags/tag.entity";

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
      const createArticleDto = {
        title: "Test article",
        text: JSON.stringify({
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
        }),
        tagIds: [1, 2, 3],
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
      articleEntity.text = createArticleDto.text;
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
});
// describe('update', () => {
//   it('should update an article', async () => {
//     const id = 1;
//     const updateArticleDto = {
//       title: 'Test article (updated)',
//       text: 'This is an updated test article.',
//     };

//     const articleEntity = new ArticleEntity();
//     articleEntity.id = id;
//     articleEntity.title = updateArticleDto.title;
//     articleEntity.text = updateArticleDto.text;
//     articleEntity.createdAt = new Date();
//     articleEntity.updatedAt = new Date();

//     articleRepositoryMock.findOneBy.mockResolvedValueOnce(articleEntity);
//     articleRepositoryMock.save.mockResolvedValueOnce(article
