import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TagEntity } from './tag.entity';
import { Tag } from './interface';
import { CreateTagDto, UpdateTagDto } from './dto';

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>,
    ) { }

    async create(createTagDto: CreateTagDto): Promise<TagEntity> {
        const newTag: Tag = new TagEntity();
        newTag.label = createTagDto.label;
        newTag.createdAt = new Date();
        newTag.updatedAt = new Date();
        return await this.tagRepository.save(newTag);
    }

    async update(id: number, updateTagDto: UpdateTagDto): Promise<TagEntity | null> {
        const updateTag = await this.tagRepository.findOne(id);
        updateTag.label = updateTagDto.label;
        updateTag.updatedAt = new Date();
        return await this.tagRepository.save(updateTag);
    }

    async findAll(): Promise<TagEntity[]> {
        return await this.tagRepository.find();
    }

    async findOne(id: number): Promise<TagEntity | null> {
        return await this.tagRepository.findOne(id);
    }

    async remove(id: number): Promise<TagEntity | null> {
        const tag = await this.tagRepository.findOne(id);
        return await this.tagRepository.remove(tag);
    }
}
