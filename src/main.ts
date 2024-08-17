import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, Logger } from "@nestjs/common";
import { HttpExceptionFilter } from "../http-exception.filters";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { initializeTransactionalContext } from "typeorm-transactional";

async function bootstrap() {
  initializeTransactionalContext();
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle("Users Example")
    .setDescription("The users API description")
    .setVersion("1.0")
    .addTag("users")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const port = 3000;
  await app.listen(port);

  logger.log(`Application running on port ${port}`);
}
bootstrap();
