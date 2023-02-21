import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common'
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  /////////// View Engine//////////////
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  /////////// View Engine//////////////


  /////////// Swagger Start//////////////
  const config = new DocumentBuilder()
    .setTitle('Ecommerce EndPoint')
    .setDescription('Ecommerce EndPoint')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  /////////// Swagger End//////////////



  /////////// Logging//////////////

  const port = process.env.PORT || 5000
  await app.listen(port, () => {
    Logger.log(`eccommerce server started at ${port}`, 'server');
    Logger.log(`DataBase connected`, 'DataBase')
    Logger.log(`http://localhost:${port}/api`, "swagger")

    
    app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  });
}
bootstrap();
