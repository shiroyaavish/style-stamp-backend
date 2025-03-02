import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CommonExceptionFilter } from './middlewares/common-exception.filter';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const TITLE = configService.get<string>('app.title', 'Style Stamp');
  const DESCRIPTION = configService.get<string>(
    'app.description',
    'New Style Stamp API',
  );
  const VERSION = configService.get<string>('app.version', '1.0.0');
  const PORT = configService.get<number>('port') || 8080;

  // Create Swagger document
  if (configService.get<string>('environment') == 'development') {
    const Swagger = new DocumentBuilder()
      .setTitle(TITLE)
      .setDescription(DESCRIPTION)
      .setVersion(VERSION)
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'access-token',
      )
      .addSecurityRequirements('access-token')
      .build();
    const document = SwaggerModule.createDocument(app, Swagger);
    SwaggerModule.setup('style-stamp', app, document);
  }
  app.useGlobalFilters(new CommonExceptionFilter());
  await app.listen(PORT);
}
bootstrap();
