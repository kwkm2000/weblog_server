import {
  Get,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  Delete,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImagesService } from "./images.service";
import { Request, Response } from "express";

@Controller("images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  async getAllImageUrls(): Promise<string[]> {
    return await this.imagesService.getAllImageUrls();
  }

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return await this.imagesService.uploadImage(file);
  }

  @Delete(":key")
  async delete(@Param("key") key: string) {
    return await this.imagesService.deleteImage(key);
  }
}
