import { Test, TestingModule } from "@nestjs/testing";
import { TagsService } from "./tags.service";
import { TagEntity } from "./tag.entity";
import { ArticleEntity } from "../articles/article.entity";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateTagDto, UpdateTagDto } from "./dto";

describe("TagsService", () => {
  let service: TagsService;
  let tagRepository: Repository<TagEntity>;

  const tagRepositoryMock = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        {
          provide: getRepositoryToken(TagEntity),
          useValue: tagRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<TagsService>(TagsService);
    tagRepository = module.get<Repository<TagEntity>>(
      getRepositoryToken(TagEntity)
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("create", () => {
    it("タグの作成", async () => {
      const createTagDto: CreateTagDto = {
        label: "test",
      };
      const tagEntity = new TagEntity();
      tagEntity.label = createTagDto.label;
      tagEntity.createdAt = new Date();
      tagEntity.updatedAt = new Date();
      tagRepositoryMock.save.mockResolvedValue(tagEntity);

      const result = await service.create(createTagDto);

      expect(tagRepositoryMock.save).toHaveBeenCalledWith(tagEntity);
      expect(result).toEqual(tagEntity);
    });
  });

  describe("update", () => {
    it("タグの更新", async () => {
      const id = 1;
      const updateTagDto: UpdateTagDto = {
        label: "updatedTag",
      };
      const tagEntity = new TagEntity();
      tagEntity.id = 1;
      tagEntity.label = "saveTag";
      tagEntity.createdAt = new Date();
      tagEntity.updatedAt = new Date();

      tagRepositoryMock.findOneBy.mockResolvedValue(tagEntity);
      const updatedTagEntity = { ...tagEntity };
      updatedTagEntity.label = updateTagDto.label;
      updatedTagEntity.updatedAt = new Date();

      tagRepositoryMock.save.mockResolvedValue(updatedTagEntity);

      const result = await service.update(id, updateTagDto);

      expect(tagRepositoryMock.findOneBy).toHaveBeenCalledWith({ id });
      expect(tagRepositoryMock.save).toHaveBeenCalledWith(tagEntity);
      expect(result).toEqual(updatedTagEntity);
    });

    // it("should return null if the tag does not exist", async () => {
    //   const id = 1;
    //   const updateTagDto: UpdateTagDto = {
    //     label: "updated",
    //   };
    //   tagRepositoryMock.findOneBy.mockResolvedValue(null);

    //   const result = await service.update(id, updateTagDto);

    //   expect(tagRepositoryMock.findOneBy).toHaveBeenCalledWith({ id });
    //   expect(tagRepositoryMock.save).not.toHaveBeenCalled();
    //   expect(result).toBeNull();
    // });
  });

  // describe("findAll", () => {
  //   it("should return an array of tags", async () => {
  //     const tagEntity: TagEntity = {
  //       id: 1,
  //       label: "test",
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };
  //     tagRepositoryMock.find.mockResolvedValue([tagEntity]);

  //     const result = await service.findAll();

  //     expect(tagRepositoryMock.find).toHaveBeenCalled();
  //     expect(result).toEqual([tagEntity]);
  //   });
  // });
});
