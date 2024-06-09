import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';


export type BannerDocument = HydratedDocument<Banner>
@Schema()
export class Banner {
  @Prop({ trim: true })
  title: string
  
  @Prop({ trim: true })
  image: string;
  
  @Prop({ trim: true })
  type: number

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const BannerSchema = SchemaFactory.createForClass(Banner)

export type NewsAndEventDocument = HydratedDocument<NewsAndEvent>
@Schema()
export class NewsAndEvent {
  @Prop({ ref: 'Post_info' })
  post: string;
  
  @Prop({trim: true})
  type: number

  @Prop({ type: Date })
  created_at: Date;

  @Prop({ type: Date })
  updated_at: Date;
}

export const NewsAndEventSchema = SchemaFactory.createForClass(NewsAndEvent)

export type TestimonialDocument = HydratedDocument<Testimonial>
@Schema()
export class Testimonial{
    @Prop({trim: true})
    avatar: string

    @Prop({trim: true})
    name: string

    @Prop({trim: true})
    description: string

    @Prop({trim: true})
    content: string

    @Prop({ type: Date })
    created_at: Date;

    @Prop({ type: Date })
    updated_at: Date;

}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial)
