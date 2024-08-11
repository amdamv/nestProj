import { UploadFilePayloadDto } from "./s3/dto/upload-file-payload.dto";
import { UploadFileResultDto } from "./s3/dto/upload-file-result.dto";
import { RemoveFilePayloadDto } from "./s3/dto/remove-file-payload.dto";
import { IUploadedMulterFile } from "./s3/interfaces/upload-file.interface";

export abstract class IFileService {
  abstract uploadFile(
    dto: UploadFilePayloadDto,
    file: IUploadedMulterFile,
  ): Promise<UploadFileResultDto>;

  abstract removeFile(dto: RemoveFilePayloadDto): Promise<void>;
}
