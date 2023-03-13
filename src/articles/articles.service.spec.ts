import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ArticleEntity } from "./article.entity";
import { TagEntity } from "../tags/tag.entity";
import { ArticlesService } from "./articles.service";
import { Article } from "./interface";

describe("ArticlesService", () => {
  let articlesService: ArticlesService;
  let articleRepository: Repository<ArticleEntity>;
  let tagRepository: Repository<TagEntity>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
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
    }).compile();

    articlesService = module.get<ArticlesService>(ArticlesService);
    articleRepository = module.get<Repository<ArticleEntity>>(
      getRepositoryToken(ArticleEntity)
    );
    tagRepository = module.get<Repository<TagEntity>>(
      getRepositoryToken(TagEntity)
    );
  });

  describe("create", () => {
    const testId = 1;
    const createArticleDto = {
      title: "Test Article",
      text: '{"blocks":[{"key":"8o6ur","text":"New Article","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}],"entityMap":{}}',
      tagIds: [1, 2, 3],
    };
    const now = new Date();
    const tag1 = new TagEntity();
    tag1.id = 1;
    tag1.label = "Tag1";
    const article: Article = {
      id: testId,
      title: createArticleDto.title,
      text: JSON.parse(createArticleDto.text),
      createdAt: now,
      updatedAt: now,
      tags: [tag1],
    };

    it("should create an article", async () => {
      const tag1 = new TagEntity();
      tag1.id = 1;
      tag1.label = "Tag1";

      jest.spyOn(tagRepository, "findOneBy").mockResolvedValueOnce(tag1);

      const createdArticle = new ArticleEntity();

      createdArticle.id = 1;
      createdArticle.title = createArticleDto.title;
      createdArticle.text = createArticleDto.text;
      createdArticle.createdAt = new Date();
      createdArticle.updatedAt = new Date();
      createdArticle.tags = [tag1];

      jest
        .spyOn(articleRepository, "save")
        .mockResolvedValueOnce(createdArticle);

      const result = await articlesService.create(createArticleDto);
      expect(result).toEqual(article);
      // expect(tagRepository.findOneBy).toHaveBeenCalledTimes(3);
      expect(articleRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  // 他のメソッドに対するテストも同様に実装できます
});
