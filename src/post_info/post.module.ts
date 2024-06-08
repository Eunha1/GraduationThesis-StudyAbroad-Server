import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Category,
  CategorySchema,
  MenuManager,
  MenuManagerSchema,
  Post_info,
  Post_infoSchema,
} from './post.schema';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Post_info.name, schema: Post_infoSchema },
    ]),
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
    ]),
    MongooseModule.forFeature([
      { name: MenuManager.name, schema: MenuManagerSchema },
    ]),
  ],
  providers: [PostService, JwtService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
