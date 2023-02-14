import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Article } from "./interface";
import { ArticleEntity } from "./article.entity";
import { CreateArticleDto, UpdateArticleDto } from "./dto";
import { TagEntity } from "../tags/tag.entity";

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
    console.log("createArticleDto", createArticleDto);
    const newArticle: ArticleEntity = new ArticleEntity();
    newArticle.title = createArticleDto.title;
    newArticle.text = createArticleDto.text;
    newArticle.createdAt = new Date();
    newArticle.updatedAt = new Date();
    newArticle.tags = await Promise.all(
      createArticleDto.tagIds.map(async (id: number): Promise<TagEntity> => {
        return await this.tagRepository.findOneBy({ id });
      })
    );

    return await this.articleRepository.save(newArticle);
  }

  async update(
    id: number,
    updateArticleDto: UpdateArticleDto
  ): Promise<ArticleEntity> {
    const updateArticle = await this.articleRepository.findOneBy({ id });
    updateArticle.title = updateArticleDto.title;
    updateArticle.text = updateArticleDto.text;
    updateArticle.updatedAt = new Date();
    const article = await this.articleRepository.save(updateArticle);
    return { ...article, text: JSON.parse(article.text) };
  }

  async findAll(): Promise<Article[]> {
    const articles = await this.articleRepository.find();

    return articles.map((article) => {
      return { ...article, text: JSON.parse(article.text) };
    });
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articleRepository.findOneBy({ id });
    return { ...article, text: JSON.parse(article.text) };
  }

  async remove(id: number): Promise<Article> {
    const article = await this.articleRepository.findOneBy({ id });
    await this.articleRepository.remove(article);
    return { ...article, text: JSON.parse(article.text) };
  }
}
