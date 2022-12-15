import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, createConnection } from 'typeorm';
import { Article } from './interface';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto, UpdateArticleDto } from './dto';
import { TagEntity } from '../tags/tag.entity';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>,
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>,
    ) { }

    async create(createArticleDto: CreateArticleDto): Promise<ArticleEntity> {
        const newArticle: Article = new ArticleEntity();
        newArticle.title = createArticleDto.title;
        newArticle.text = createArticleDto.text;
        newArticle.createdAt = new Date();
        newArticle.updatedAt = new Date();
        newArticle.tags = await Promise.all(createArticleDto.tagIds.map(async (id: number): Promise<TagEntity> => {
            return await this.tagRepository.findOne(id);
        }));
        return await this.articleRepository.save(newArticle);
    }

    async update(id: number, updateArticleDto: UpdateArticleDto): Promise<ArticleEntity> {
        const updateArticle = await this.articleRepository.findOne(id);
        updateArticle.title = updateArticleDto.title;
        updateArticle.text = updateArticleDto.text;
        updateArticle.updatedAt = new Date();
        return await this.articleRepository.save(updateArticle);
    }

    async findAll(): Promise<ArticleEntity[]> {
        return await this.articleRepository.find();
    }

    async findOne(id: number): Promise<ArticleEntity> {
        return await this.articleRepository.findOne(id);
    }

    async remove(id: number): Promise<ArticleEntity> {
        const article = await this.articleRepository.findOne(id);
        return await this.articleRepository.remove(article);
    }
}
