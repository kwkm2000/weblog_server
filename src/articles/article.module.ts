import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { TagEntity } from '../tags/tag.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ArticleEntity, TagEntity])],
    providers: [ArticlesService],
    controllers: [ArticlesController],
})
export class ArticleModule { }
