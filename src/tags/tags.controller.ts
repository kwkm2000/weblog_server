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
import { TagsService } from "./tags.service";
import { Tag } from "./interface";
import { CreateTagDto, UpdateTagDto } from "./dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("tags")
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Get()
  async findAll(): Promise<Tag[]> {
    return this.tagsService.findAll();
  }

  @Get(":id")
  async findOne(@Param("id") id: number): Promise<Tag> {
    return this.tagsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    return this.tagsService.create(createTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(@Param("id") id: number, @Body() updateTagDto: UpdateTagDto) {
    return this.tagsService.update(id, updateTagDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(@Param("id") id: number): Promise<void> {
    return this.tagsService.remove(id);
  }
}
