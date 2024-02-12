import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post_info, Post_infoSchema } from './post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post_info.name, schema: Post_infoSchema },
    ]),
  ],
  controllers: [],
  exports: [],
})
export class PostModule {}
