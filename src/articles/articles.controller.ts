import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ArticlesService } from "./articles.service";
import { Article } from "./interface";
import { CreateArticleDto, UpdateArticleDto } from "./dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("articles")
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(): Promise<Article[]> {
    return this.articlesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: number): Promise<Article> {
    return this.articlesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createArticleDto: CreateArticleDto): Promise<Article> {
    return this.articlesService.create(createArticleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id") id: number,
    @Body() updateArticleDto: UpdateArticleDto
  ): Promise<Article> {
    return this.articlesService.update(id, updateArticleDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: number): Promise<void> {
    return this.articlesService.remove(id);
  }
}
