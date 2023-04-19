import {
  Get,
  Controller,
  Post,
  Req,
  Res,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ImagesService } from "./images.service";
import { Request, Response } from "express";

@Controller("images")
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Get()
  hoge(): string {
    return "hoge";
  }

  @Post()
  @UseInterceptors(FileInterceptor("image"))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Res() res: Response
  ) {
    try {
      const imageUrl = await this.imagesService.uploadImage(file);
      return res.status(200).json({ imageUrl });
    } catch (error) {
      console.error("Error uploading file:", error);

      return res.status(500).json({ message: "Error uploading file." });
    }
  }
}
