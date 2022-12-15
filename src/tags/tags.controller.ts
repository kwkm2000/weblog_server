import { Controller, Get, Param, Post, Body, Delete, Put } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Tag } from './interface';
import { CreateTagDto, UpdateTagDto } from './dto';

@Controller('tags')
export class TagsController {
    constructor(private readonly tagsService: TagsService) { }

    @Post()
    async create(@Body() createTagDto: CreateTagDto) {
        this.tagsService.create(createTagDto);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateTagDto: UpdateTagDto) {
        this.tagsService.update(id, updateTagDto);
    }

    @Get()
    async findAll(): Promise<Tag[]> {
        return this.tagsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Tag> {
        return this.tagsService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: number): Promise<Tag> {
        return this.tagsService.remove(id);
    }
}
