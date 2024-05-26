import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument, Post_info, Post_infoDocument } from './post.schema';
import { Model } from 'mongoose';
import { newPost } from './post.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post_info.name)
    private readonly postModel: Model<Post_infoDocument>,

    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    
    private config: ConfigService
  ) {}

  async createNewPost(newPost: newPost,file: Express.Multer.File): Promise<any> {
    const listCategory = newPost.category.split(',')
    const data = {
      title: newPost.title,
      author: newPost.author,
      content: newPost.content,
      description: newPost.description,
      category: listCategory.map(item=>item),
      image: file ? file.destination + '/' + file.filename : file,
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
      data: postInfo
    };
  }

  async getListPost(): Promise<any> {
    const data = await this.postModel.find({});
    const listPost = []
    let count = 1
    const web_url = this.config.get('WEB_URL')
    for(const item of data){
      let obj : object
      
      let listCategory = []
      for(const category of item.category){
        const info = await this.categoryModel.findById(category)
        listCategory.push(info.category)
      }
      obj = {
        _id: item._id,
         stt: count++,
         title: item.title,
         author: item.author,
         image: web_url + '/' + item.image,
         category: listCategory.toString(),
         description: item.description
      }
      listPost.push(obj)
    }
    if (!data) {
      return {
        status: 0,
        message: 'Lấy danh sách thất bại',
      };
    }
    return {
      status: 1,
      message: 'lấy danh sách thành công',
      data: listPost
    };
  }

  async getPostById(_id: string): Promise<any> {
    const data = await this.postModel.findById(_id);
    const web_url = this.config.get('WEB_URL')
    
    if (!data) {
      return {
        status: 0,
        message: 'Lấy thông tin thất bại',
      };
    }
    let listCategory = []
      for(const category of data.category){
        const info = await this.categoryModel.findById(category)
        listCategory.push(info)
      }
    const postInfo = {
      _id: data._id,
        title: data.title,
        author: data.author,
        image: web_url + '/' + data.image,
        category : listCategory,
        content: data.content,
        description: data.description,
        updated_at: data.updated_at,
        created_at: data.created_at
    }
    return {
      status: 1,
      message: 'Lấy thông tin thành công',
      data: postInfo
    };
  }

  async updatePost(_id: string, body: any, file: Express.Multer.File):Promise<any>{
    const listCategory = body.category.split(',')
    console.log(listCategory)
    const newInfo = {
      ...body,
      category: listCategory.map(item=>item),
      image: file ? file.destination + '/' + file.filename : file,
      updated_at: new Date()
    }
    const data = await this.postModel.findByIdAndUpdate(_id, newInfo)
    if(!data){
      return {
        status: 0,
        message: 'Cập nhật thất bại'
      }
    }
    return {
      status: 1,
      message: 'Cập nhật thành công',
      data:data
    }
  }

  async deletePost(_id: string):Promise<any>{
    const data =  await this.postModel.findByIdAndDelete(_id)
    if(!data){
      return {
        status: 0,
        message: 'Xóa bài viết thất bại'
      }
    }
    return {
      status: 1, 
      message: 'Xóa bài viết thành công'
    }
  }
  async createNewCategory(category: string, slug: string):Promise<any>{
    const fingByCategory = await this.categoryModel.findOne({category: category})
    const findBySlug = await this.categoryModel.findOne({slug:slug})
    if(fingByCategory || findBySlug){
      return {
        status: 0,
        message: 'Slug hoặc category đã tồn tại'
      }
    }
    const newCategory = {
      category: category,
      slug: slug,
      created_at : new Date(),
      updated_at: new Date()
    }
    const newInfo = await new this.categoryModel(newCategory).save()
    if(!newInfo){
      return {
        status: 0,
        message : 'Tạo mới thất bại'
      }
    }
    return {
      status: 1,
      message: 'Tạo mới thành công',
      data: newInfo
    }
  }

  async updateCategory(_id: string, body : any):Promise<any>{
    const categoryInfo = await this.categoryModel.findByIdAndUpdate(_id, body)
    if(!categoryInfo){
      return {
        status: 0,
        message: 'Cập nhật thất bại'
      }
    }
    return {
      status: 1,
      message: 'Cập nhật thành công'
    }
  }

  async getListCategory():Promise<any>{
    const data = await this.categoryModel.find({})
    const listCategory = []
    let count = 1
    for(let item of data){
      const obj = {
        _id: item._id,
        stt: count++,
        category: item.category,
        slug: item.slug
      }
      listCategory.push(obj)
    }
    return {
      status: 1,
      message: 'Lấy danh sách thành công',
      data: listCategory
    }
  }

  async deleteCategory(_id: string):Promise<any>{
    const data = await this.categoryModel.findByIdAndDelete(_id)
    if(!data){
      return {
        status: 0,
        message: 'Xóa bài viết thất bại'
      }
    }
    return {
      status: 1,
      message: 'Xóa bài viết thành công'
    }
  }

  async getListPostBySlug(slug: string):Promise<any>{
    const categoryInfo = await this.categoryModel.findOne({
      slug: slug
    })
    if(!categoryInfo){
      return {
        status: 0,
        message: 'Không tồn tại slug'
      }
    }
    const web_url = this.config.get('WEB_URL')
    const listPost = await this.postModel.find({})
    let listPostBySlug = []
    for(let item of listPost){
      if(item.category.includes(categoryInfo._id.toString())){
        const obj = {
          _id: item._id,
          title: item.title,
          description: item.description,
          image: web_url + '/' + item.image,
          author: item.author,
          updated_at: item.updated_at,
          created_at: item.created_at
        }
        listPostBySlug.push(obj)
      }
    }
    if(listPostBySlug.length === 0){
      return {
        status: 0,
        message: 'Không có bài viết nào có category này'
      }
    }
    return {
      status: 1,
      message: 'Lấy danh sách thành công',
      data: listPostBySlug.reverse()
    }
  }
}
