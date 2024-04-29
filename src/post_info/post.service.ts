import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post_info, Post_infoDocument } from './post.schema';
import { Model } from 'mongoose';
import { newPost } from './post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post_info.name)
    private readonly postModel: Model<Post_infoDocument>,
  ) {}

  async createNewPost(newPost: newPost): Promise<any> {
    const data = {
      ...newPost,
      updated_at: new Date(),
      created_at: new Date(),
    };

    const postInfo = await new this.postModel(data).save();
    if (!postInfo) {
      return {
        status: 0,
        message: 'Tạo mới bài viết không thành công',
      };
    }
    return {
      status: 1,
      message: 'Tạo mới bài viết thành công',
    };
  }

  async getListPost(): Promise<any> {
    const data = await this.postModel.find({});
    if (!data) {
      return {
        status: 0,
        message: 'Lấy danh sách thất bại',
      };
    }
    return {
      status: 1,
      message: 'lấy danh sách thành công',
    };
  }

  async getPostById(_id: string): Promise<any> {
    const data = await this.postModel.findById(_id);
    if (!data) {
      return {
        status: 0,
        message: 'Lấy thông tin thất bại',
      };
    }
    return {
      status: 1,
      message: 'Lấy thông tin thành công',
    };
  }
}
