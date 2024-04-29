import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type Post_infoDocument = HydratedDocument<Post_info>;

@Schema()
export class Post_info {
  @Prop({ trim: true })
  title: string;

  @Prop({ trim: true })
  author: string;

  @Prop({ trim: true })
  image: string;

  @Prop({ trim: true })
  content: string;

  @Prop({ trim: true })
  category: string;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const Post_infoSchema = SchemaFactory.createForClass(Post_info);
