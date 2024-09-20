import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { Logger } from "@nestjs/common";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Notification Example")
    .setDescription("The notification API description")
    .setVersion("1.0")
    .addTag("Notification")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  const port = 3000;
  await app.listen(port);
  logger.log(`Notification microservise running on port ${port}`);
}
bootstrap();
