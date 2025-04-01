import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // removes fields that are not in the DTO
      forbidNonWhitelisted: true, // throws an error if there are fields that are not in the DTO
      transform: true, // transforms the payload to the DTO type() in default it is a plain object- so its trnsofrmed all fidels to string) 
    }),
  );

  await app.listen(3000);
}
bootstrap();
