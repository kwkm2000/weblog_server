import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Article } from "./interface";
import { ArticleEntity } from "./article.entity";
import { CreateArticleDto, UpdateArticleDto } from "./dto";
import { TagEntity } from "../tags/tag.entity";
import { triggerWorkflow } from "../lib/trigger-workflow";

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const newArticle: ArticleEntity = new ArticleEntity();
    newArticle.title = createArticleDto.title;
    newArticle.text = JSON.stringify(createArticleDto.text);
    newArticle.headerImage = createArticleDto.headerImage;
    newArticle.createdAt = new Date();
    newArticle.updatedAt = new Date();
    newArticle.draft = false;

    if (!Array.isArray(createArticleDto.tagIds)) {
      throw new Error(
        `tagIdsに配列以外の値が渡りました、型は${typeof createArticleDto.tagIds}`
      );
    }

    newArticle.tags = await Promise.all(
      createArticleDto.tagIds.map(async (id: number): Promise<TagEntity> => {
        return await this.tagRepository.findOneBy({ id });
      })
    );

    const articleEntity = await this.articleRepository.save(newArticle);

    if (process.env.ENV === "production") {
      triggerWorkflow();
    }

    return { ...articleEntity, text: JSON.parse(articleEntity.text) };
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto
  ): Promise<Article> {
    const updateArticle = await this.articleRepository.findOneBy({ id });
    updateArticle.title = updateArticleDto.title;
    updateArticle.text = JSON.stringify(updateArticleDto.text);
    updateArticle.updatedAt = new Date();
    const articleEntity = await this.articleRepository.save(updateArticle);

    if (process.env.ENV === "production") {
      triggerWorkflow();
    }

    return { ...articleEntity, text: JSON.parse(articleEntity.text) };
  }

  async findAll(): Promise<Article[]> {
    const articles = await this.articleRepository.find();
    const sortedArticles = [...articles].sort((a, b) =>
      a.createdAt > b.createdAt ? -1 : 1
    );

    return sortedArticles.map((article) => {
      return { ...article, text: JSON.parse(article.text) };
    });
  }

  async findOne(id: number): Promise<Article | null> {
    const article = await this.articleRepository.findOneBy({ id });

    if (!article) {
      return null;
    }

    return { ...article, text: JSON.parse(article.text) };
  }

  async remove(id: number): Promise<void> {
    const article = await this.articleRepository.findOneBy({ id });
    await this.articleRepository.remove(article);

    if (process.env.ENV === "production") {
      triggerWorkflow();
    }
  }
}
