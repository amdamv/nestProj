import * as AWS from "@aws-sdk/client-s3";
import { Module } from "@nestjs/common";

import { S3Lib } from "./constants/do-spaces-service-lib.constant";
import { S3Service } from "./s3.service";
import { S3Controller } from "./s3.controller";

@Module({
  providers: [
    S3Service,
    {
      provide: S3Lib,
      useFactory: async () => {
        // TODO: укажи только accessKeyId, secretAccessKey
        return new AWS.S3({
          endpoint: "http://127.0.0.1:9000",
          region: "ru-central1",
          credentials: {
            accessKeyId: "u3aU5mAUNwJqz3dyT3qo",
            secretAccessKey: "7df06Vy7mvVk7cVtyOZZVLHsICYem4dMZyJjkrvc",
          },
        });
      },
    },
  ],
  exports: [S3Service, S3Lib],
  controllers: [S3Controller],
})
export class S3Module {}
