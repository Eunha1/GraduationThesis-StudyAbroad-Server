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
  description: string;

  @Prop({ type: [{ type: String, ref: 'Category' }] })
  category: string[];

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const Post_infoSchema = SchemaFactory.createForClass(Post_info);

export type CategoryDocument = HydratedDocument<Category>;
@Schema()
export class Category {
  @Prop({ trim: true })
  category: string;

  @Prop({ trim: true })
  slug: string;

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

export type MenuManagerDocumnet = HydratedDocument<MenuManager>;
@Schema()
export class MenuManager {
  @Prop({ trim: true })
  name: string;

  @Prop({ trim: true })
  menu_parent: string;

  @Prop({ ref: 'category' })
  category: string;

  @Prop({ type: [{ type: String, ref: 'Post_info' }] })
  post: string[];
  
  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const MenuManagerSchema = SchemaFactory.createForClass(MenuManager);
