import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Category,
  CategoryDocument,
  MenuManager,
  MenuManagerDocumnet,
  Post_info,
  Post_infoDocument,
} from './post.schema';
import { Model } from 'mongoose';
import { newMenu, newPost, pagination } from './post.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post_info.name)
    private readonly postModel: Model<Post_infoDocument>,

    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,

    @InjectModel(MenuManager.name)
    private readonly menuManagerModel: Model<MenuManagerDocumnet>,

    private config: ConfigService,
  ) {}

  async createNewPost(
    newPost: newPost,
    file: Express.Multer.File,
  ): Promise<any> {
    const listCategory = newPost.category.split(',');
    const data = {
      title: newPost.title,
      author: newPost.author,
      content: newPost.content,
      description: newPost.description,
      category: listCategory.map((item) => item),
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
      data: postInfo,
    };
  }

  async getListPost(pagination: pagination): Promise<any> {
    const skip = pagination.limit * (pagination.page - 1);
    const data = await this.postModel
      .find({})
      .limit(pagination.limit)
      .skip(skip);
    const listPost = [];
    let count = 1;
    const web_url = this.config.get('WEB_URL');
    for (const item of data) {
      let obj: object;

      let listCategory = [];
      for (const category of item.category) {
        const info = await this.categoryModel.findById(category);
        listCategory.push(info.category);
      }
      obj = {
        _id: item._id,
        stt: count++,
        title: item.title,
        author: item.author,
        image: web_url + '/' + item.image,
        category: listCategory.toString(),
        description: item.description,
      };
      listPost.push(obj);
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
      data: listPost,
    };
  }

  async getPostById(_id: string): Promise<any> {
    const data = await this.postModel.findById(_id);
    const web_url = this.config.get('WEB_URL');

    if (!data) {
      return {
        status: 0,
        message: 'Lấy thông tin thất bại',
      };
    }
    let listCategory = [];
    for (const category of data.category) {
      const info = await this.categoryModel.findById(category);
      listCategory.push(info);
    }
    const postInfo = {
      _id: data._id,
      title: data.title,
      author: data.author,
      image: web_url + '/' + data.image,
      category: listCategory,
      content: data.content,
      description: data.description,
      updated_at: data.updated_at,
      created_at: data.created_at,
    };
    return {
      status: 1,
      message: 'Lấy thông tin thành công',
      data: postInfo,
    };
  }

  async findPostByID(_id: string): Promise<any> {
    const data = await this.postModel.findById(_id);
    const web_url = this.config.get('WEB_URL');
    if (!data) {
      return null;
    }
    let listCategory = [];
    for (const category of data.category) {
      const info = await this.categoryModel.findById(category);
      listCategory.push(info);
    }
    const postInfo = {
      _id: data._id,
      title: data.title,
      author: data.author,
      image: web_url + '/' + data.image,
      category: listCategory,
      content: data.content,
      description: data.description,
      updated_at: data.updated_at,
      created_at: data.created_at,
    };
    return postInfo;
  }
  async updatePost(
    _id: string,
    body: any,
    file: Express.Multer.File,
  ): Promise<any> {
    const listCategory = body.category.split(',');
    console.log(listCategory);
    const newInfo = {
      ...body,
      category: listCategory.map((item) => item),
      image: file ? file.destination + '/' + file.filename : file,
      updated_at: new Date(),
    };
    const data = await this.postModel.findByIdAndUpdate(_id, newInfo);
    if (!data) {
      return {
        status: 0,
        message: 'Cập nhật thất bại',
      };
    }
    return {
      status: 1,
      message: 'Cập nhật thành công',
      data: data,
    };
  }

  async deletePost(_id: string): Promise<any> {
    const data = await this.postModel.findByIdAndDelete(_id);
    if (!data) {
      return {
        status: 0,
        message: 'Xóa bài viết thất bại',
      };
    }
    return {
      status: 1,
      message: 'Xóa bài viết thành công',
    };
  }
  async createNewCategory(category: string, slug: string): Promise<any> {
    const fingByCategory = await this.categoryModel.findOne({
      category: category,
    });
    const findBySlug = await this.categoryModel.findOne({ slug: slug });
    if (fingByCategory || findBySlug) {
      return {
        status: 0,
        message: 'Slug hoặc category đã tồn tại',
      };
    }
    const newCategory = {
      category: category,
      slug: slug,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const newInfo = await new this.categoryModel(newCategory).save();
    if (!newInfo) {
      return {
        status: 0,
        message: 'Tạo mới thất bại',
      };
    }
    return {
      status: 1,
      message: 'Tạo mới thành công',
      data: newInfo,
    };
  }

  async updateCategory(_id: string, body: any): Promise<any> {
    const categoryInfo = await this.categoryModel.findByIdAndUpdate(_id, body);
    if (!categoryInfo) {
      return {
        status: 0,
        message: 'Cập nhật thất bại',
      };
    }
    return {
      status: 1,
      message: 'Cập nhật thành công',
    };
  }

  async getListCategory(pagination: pagination): Promise<any> {
    const skip = pagination.limit * (pagination.page - 1);
    const data = await this.categoryModel
      .find({})
      .limit(pagination.limit)
      .skip(skip);
    const listCategory = [];
    let count = 1;
    for (let item of data) {
      const obj = {
        _id: item._id,
        stt: count++,
        category: item.category,
        slug: item.slug,
      };
      listCategory.push(obj);
    }
    return {
      status: 1,
      message: 'Lấy danh sách thành công',
      data: listCategory,
    };
  }

  async deleteCategory(_id: string): Promise<any> {
    const data = await this.categoryModel.findByIdAndDelete(_id);
    if (!data) {
      return {
        status: 0,
        message: 'Xóa bài viết thất bại',
      };
    }
    return {
      status: 1,
      message: 'Xóa bài viết thành công',
    };
  }

  async getListPostMenuByID(_id: string): Promise<any> {
    const menuInfo = await this.menuManagerModel.findById(_id);
    if (!menuInfo) {
      return {
        status: 0,
        message: 'Không tồn tại slug',
      };
    }
    const categoryInfo = await this.categoryModel.findById(menuInfo.category);
    const web_url = this.config.get('WEB_URL');
    let listPostMenu = [];
    for (let item of menuInfo.post) {
      const postInfo = await this.postModel.findById(item);
      const obj = {
        _id: postInfo._id,
        title: postInfo.title,
        description: postInfo.description,
        image: web_url + '/' + postInfo.image,
        author: postInfo.author,
        category: categoryInfo.category,
        slug: categoryInfo.slug,
        updated_at: postInfo.updated_at,
        created_at: postInfo.created_at,
      };
      listPostMenu.push(obj);
    }

    if (listPostMenu.length === 0) {
      return {
        status: 0,
        message: 'Không có bài viết nào trong menu này',
      };
    }
    return {
      status: 1,
      message: 'Lấy danh sách thành công',
      data: listPostMenu.reverse(),
    };
  }

  async getListPostMenuBySlug(slug: string): Promise<any> {
    const categoryInfo = await this.categoryModel.findOne({
      slug: slug,
    });
    if (!categoryInfo) {
      return {
        status: 0,
        message: 'Không tồn tại slug',
      };
    }
    const web_url = this.config.get('WEB_URL');
    const listPost = await this.postModel.find({});
    let listPostBySlug = [];
    for (let item of listPost) {
      if (item.category.includes(categoryInfo._id.toString())) {
        const obj = {
          _id: item._id,
          title: item.title,
          description: item.description,
          image: web_url + '/' + item.image,
          author: item.author,
          category: categoryInfo.category,
          slug: categoryInfo.slug,
          updated_at: item.updated_at,
          created_at: item.created_at,
        };
        listPostBySlug.push(obj);
      }
    }
    if (listPostBySlug.length === 0) {
      return {
        status: 0,
        message: 'Không có bài viết nào có category này',
      };
    }
    return {
      status: 1,
      message: 'Lấy danh sách thành công',
      data: listPostBySlug.reverse(),
    };
  }

  async createNewMenu(newMenu: newMenu): Promise<any> {
    const categoryInfo = await this.menuManagerModel.findOne({
      category: newMenu.category,
    });
    if (categoryInfo) {
      return {
        status: 0,
        message: 'Category này đã tồn tại ở menu khác',
      };
    }
    const data = {
      ...newMenu,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const newInfo = await new this.menuManagerModel(data).save();
    if (!newInfo) {
      return {
        status: 0,
        message: 'Tạo mới không thành công',
      };
    }
    return {
      status: 1,
      message: 'Tạo mới thành công',
    };
  }
  async updateMenu(_id: string, body: any): Promise<any> {
    const data = await this.menuManagerModel.findByIdAndUpdate(_id, body);
    if (!data) {
      return {
        status: 0,
        message: 'Cập nhật thất bại',
      };
    }
    return {
      status: 1,
      message: 'Cập nhật thành công',
    };
  }

  async deleteMenu(_id: string): Promise<any> {
    const data = await this.menuManagerModel.findByIdAndDelete(_id);
    if (data) {
      return {
        status: 1,
        message: 'Xóa menu thành công',
      };
    }
    return {
      status: 0,
      message: 'Xóa menu không thành công',
    };
  }

  async getMenuTree(): Promise<any> {
    const tree = await this.buildTree(null, []);
    return {
      status: 1,
      message: 'Lấy danh sách thành công',
      data: tree,
    };
  }

  async getMenuById(_id: string): Promise<any> {
    const info = await this.menuManagerModel.findById(_id);
    if (!info) {
      return {
        status: 0,
        message: 'Lấy thông tin thất bại',
      };
    }
    const data = {
      _id: info._id,
      name: info.name,
      menu_parent: await this.menuManagerModel.findById(info.menu_parent),
      category: await this.categoryModel.findById(info.category),
    };
    return {
      status: 1,
      message: 'Lấy thông tin thành công',
      data: data,
    };
  }

  async getListMenu(pagination: pagination): Promise<any> {
    const skip = pagination.limit * (pagination.page - 1);
    const listMenu = await this.menuManagerModel
      .find({})
      .limit(pagination.limit)
      .skip(skip);
    let data = [];
    let count = 1;
    for (let item of listMenu) {
      const obj = {
        _id: item._id,
        stt: count++,
        name: item.name,
        category: (await this.categoryModel.findById(item.category)).category,
        slug: (await this.categoryModel.findById(item.category)).slug,
        parent: item.menu_parent
          ? (await this.menuManagerModel.findById(item.menu_parent)).name
          : 'null',
      };
      data.push(obj);
    }
    return {
      status: 1,
      message: 'Lấy danh sách thành công',
      data: data,
    };
  }

  async addPost(_id: string, listPost: any): Promise<any> {
    const data = {
      post: listPost.map((item: any) => item),
    };
    const menuInfo = await this.menuManagerModel.findByIdAndUpdate(_id, data);
    if (!menuInfo) {
      return {
        status: 0,
        message: 'Cập nhật thất bại',
      };
    }
    return {
      status: 1,
      message: 'Cập nhật thành công',
      data: menuInfo,
    };
  }

  async buildTree(menu_parent: any = null, data: any = []): Promise<any> {
    const nodes = await this.menuManagerModel.find({
      menu_parent: menu_parent,
    });
    for (let node of nodes) {
      const obj = {
        _id: node._id,
        name: node.name,
        category: (await this.categoryModel.findById(node.category)).category,
        slug: (await this.categoryModel.findById(node.category)).slug,
        parent_id: node.menu_parent,
      };
      obj['children'] = await this.buildTree(node._id, []);
      data.push(obj);
    }
    return data;
  }
}
