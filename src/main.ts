import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(path.join(process.cwd(), ''));
  app.enableCors({
    origin: true,
  });
  const port = process.env.PORT || 3001;
  app.use(morgan('common'));
  await app.listen(port, () => {
    console.log(`App listen at port ${port}`);
  });
}
bootstrap();
