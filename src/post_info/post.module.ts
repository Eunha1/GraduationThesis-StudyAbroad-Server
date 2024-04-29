import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post_info, Post_infoSchema } from './post.schema';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post_info.name, schema: Post_infoSchema },
    ]),
  ],
  providers: [PostService, JwtService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
