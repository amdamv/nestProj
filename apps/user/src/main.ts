import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { HttpExceptionFilter } from "../../../Libraries/http-exception.filter";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { initializeTransactionalContext } from "typeorm-transactional";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";

async function bootstrap() {
  initializeTransactionalContext();
  const logger = new Logger();

  const httpApp = await NestFactory.create(AppModule);
  httpApp.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );
  httpApp.useGlobalFilters(new HttpExceptionFilter());

  // Настройка Swagger для HTTP приложения
  const config = new DocumentBuilder()
    .setTitle("Users Example")
    .setDescription("The users API description")
    .setVersion("1.0")
    .addTag("users")
    .build();
  const document = SwaggerModule.createDocument(httpApp, config);
  SwaggerModule.setup("api", httpApp, document);

  await httpApp.listen(3000);
  logger.log(`HTTP application running on port 3000`);

  // Микросервис для NATS
  const microserviceApp =
    await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
      transport: Transport.NATS,
      options: {
        servers: "nats://localhost:4222",
      },
    });

  await microserviceApp.listen();
  logger.log("Microservice is listening");
}

bootstrap();
