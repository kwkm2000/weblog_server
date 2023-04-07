import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TagEntity } from "./tag.entity";
import { Tag } from "./interface";
import { CreateTagDto, UpdateTagDto } from "./dto";
import { triggerWorkflow } from "../lib/trigger-workflow";

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>
  ) {}

  async create(createTagDto: CreateTagDto): Promise<TagEntity> {
    const newTag: Tag = new TagEntity();
    newTag.label = createTagDto.label;
    newTag.createdAt = new Date();
    newTag.updatedAt = new Date();
    const createdTag = await this.tagRepository.save(newTag);

    if (process.env.ENV === "production") {
      triggerWorkflow();
    }

    return createdTag;
  }

  async update(
    id: number,
    updateTagDto: UpdateTagDto
  ): Promise<TagEntity | null> {
    const updateTag = await this.tagRepository.findOneBy({ id });
    updateTag.label = updateTagDto.label;
    updateTag.updatedAt = new Date();
    const tag = await this.tagRepository.save(updateTag);

    if (process.env.ENV === "production") {
      triggerWorkflow();
    }

    return tag;
  }

  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find();
  }

  async findOne(id: number): Promise<TagEntity | null> {
    return await this.tagRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    const tag = await this.tagRepository.findOneBy({ id });
    await this.tagRepository.remove(tag);

    if (process.env.ENV === "production") {
      triggerWorkflow();
    }
  }
}
