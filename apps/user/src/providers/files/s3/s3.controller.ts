import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { IUploadedMulterFile } from "./interfaces/upload-file.interface";
import { S3Service } from "./s3.service";
import { UploadFilePayloadDto } from "./dto/upload-file-payload.dto";

@Controller("upload-file")
export class S3Controller {
  constructor(private s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async uploadImage(
    @Body() dto: UploadFilePayloadDto,
    @UploadedFile() file: IUploadedMulterFile,
  ) {
    console.log(dto);
    try {
      const uploadedFile = await this.s3Service.uploadFile(dto, file);
      return {
        message: "File uploaded successfully",
        url: uploadedFile.path,
      };
    } catch (err) {
      return {
        message: "Failed to upload file",
        error: err.message,
      };
    }
  }
}
