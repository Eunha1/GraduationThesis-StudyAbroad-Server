import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { Roles } from '../role/role.decorator';
import { Role } from '../enum/roles.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { newPost } from './post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { extname } from 'path';
@Controller('api')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Post('/post/create')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image',{
    storage: storageConfig('post/illustration'),
        fileFilter: (req, file, callback) => {
          const ext = extname(file.originalname);
          const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp'];
          if (!allowedExtArr.includes(ext)) {
            req.fileValidatorError = `Sai định dạng file. Chỉ chấp nhận với các định dạng : ${allowedExtArr}`;
            callback(null, false);
          } else {
            callback(null, true);
          }
        },
  }))
  async createNewPost(@Body() newPost: newPost, @UploadedFile() file : Express.Multer.File, @Req() req: any) {
    if (
      !newPost.title ||
      newPost.title === '' ||
      !newPost.category ||
      newPost.category === ''
    ) {
      return {
        status: 0,
        message: 'Vui lòng điển title hoặc category',
      };
    }
    if (req.fileValidatorError) {
      throw new BadRequestException(req.fileValidatorError);
    }
    return await this.service.createNewPost(newPost,file);
  }

  @Get('/post/list-post')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async getListPost() {
    return await this.service.getListPost();
  }

  @Get('/get-post/:post_id')
  async getPostById(@Param('post_id') postId: string) {
    return await this.service.getPostById(postId);
  }

  @Post('/update-post/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('image',{
    storage: storageConfig('post/illustration'),
        fileFilter: (req, file, callback) => {
          const ext = extname(file.originalname);
          const allowedExtArr = ['.jpg', '.png', '.jpeg', '.webp'];
          if (!allowedExtArr.includes(ext)) {
            req.fileValidatorError = `Sai định dạng file. Chỉ chấp nhận với các định dạng : ${allowedExtArr}`;
            callback(null, false);
          } else {
            callback(null, true);
          }
        },
  }))
  async updatePostById(@Param('id') id: string,@Body() body: any, @UploadedFile() file: Express.Multer.File, @Req() req: any){
    if (req.fileValidatorError) {
      throw new BadRequestException(req.fileValidatorError);
    }
    return await this.service.updatePost(id, body, file)
  }
  
  @Post('/delete-post/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async deletePost(@Param('id') id: string){
    return await this.service.deletePost(id)
  }


  @Get('/list-category')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async getListCategory(){
    return await this.service.getListCategory()
  }

  @Post('/category/create')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async createCategory(@Body() body: any){
    if(!body.category || body.category === '' || !body.slug || body.slug === ''){
      return {
        status: 0,
        message: 'Vui lòng điền đầy đủ thông tin'
      }
    }
    return await this.service.createNewCategory(body.category, body.slug)
  }
  @Post('/category/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async updateCategory(@Param('id') id: string, @Body() body: any){
    return await this.service.updateCategory(id, body)
  }

  @Post('/category/delete/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async deleteCategory(@Param('id') id: string){
    return await this.service.deleteCategory(id)
  }

  @Get('/list-post/category?')
  async getListPostBySlug(@Query('slug') slug: string){
    return await this.service.getListPostBySlug(slug)
  }
}
