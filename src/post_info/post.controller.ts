import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Roles } from '../role/role.decorator';
import { Role } from '../enum/roles.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { newMenu, newPost, pagination } from './post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'src/helpers/config';
import { extname } from 'path';
@Controller('api')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Post('/post/create')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(
    FileInterceptor('image', {
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
    }),
  )
  async createNewPost(
    @Body() newPost: newPost,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
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
    return await this.service.createNewPost(newPost, file);
  }

  @Get('/post/list-post')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async getListPost(@Query() pagination: pagination) {
    return await this.service.getListPost(pagination);
  }

  @Get('/get-post/:post_id')
  async getPostById(@Param('post_id') postId: string) {
    return await this.service.getPostById(postId);
  }

  @Post('/update-post/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  @UseInterceptors(
    FileInterceptor('image', {
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
    }),
  )
  async updatePostById(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (req.fileValidatorError) {
      throw new BadRequestException(req.fileValidatorError);
    }
    return await this.service.updatePost(id, body, file);
  }

  @Post('/delete-post/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async deletePost(@Param('id') id: string) {
    return await this.service.deletePost(id);
  }

  @Get('/list-category')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async getListCategory(@Query() pagination: pagination) {
    return await this.service.getListCategory(pagination);
  }

  @Post('/category/create')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async createCategory(@Body() body: any) {
    if (
      !body.category ||
      body.category === '' ||
      !body.slug ||
      body.slug === ''
    ) {
      return {
        status: 0,
        message: 'Vui lòng điền đầy đủ thông tin',
      };
    }
    return await this.service.createNewCategory(body.category, body.slug);
  }
  @Post('/category/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async updateCategory(@Param('id') id: string, @Body() body: any) {
    return await this.service.updateCategory(id, body);
  }

  @Post('/category/delete/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async deleteCategory(@Param('id') id: string) {
    return await this.service.deleteCategory(id);
  }

  @Get('/list-post/menu/:id')
  async getListPostMenuByID(@Param('id') id: string) {
    return await this.service.getListPostMenuByID(id);
  }

  @Get('/list-post/slug')
  async getListPostBySlug(@Query('slug') slug: string) {
    return await this.service.getListPostMenuBySlug(slug);
  }

  @Post('/menu/create-menu')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async createNewCategory(@Body() newMenu: newMenu) {
    if (
      !newMenu.name ||
      newMenu.name === '' ||
      !newMenu.category ||
      newMenu.category === ''
    ) {
      return {
        status: 0,
        message: 'Vui lòng thêm name và category',
      };
    }
    return await this.service.createNewMenu(newMenu);
  }

  @Get('/menu/get-menu')
  async getMenuTree() {
    return await this.service.getMenuTree();
  }

  @Post('/menu/update-menu/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async updateMenu(@Body() body: any, @Param('id') id: string) {
    if (
      !body.name ||
      body.name === '' ||
      !body.category ||
      body.category === ''
    ) {
      return {
        status: 0,
        message: 'Vui lòng thêm name và category',
      };
    }
    return await this.service.updateMenu(id, body);
  }

  @Get('/menu/list-menu')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async getListMenu(@Query() pagination: pagination) {
    return await this.service.getListMenu(pagination);
  }

  @Post('/menu/delete-menu/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async deleteMenu(@Param('id') id: string) {
    return await this.service.deleteMenu(id);
  }

  @Get('/menu/get-menu/:id')
  async getMenuById(@Param('id') id: string) {
    return await this.service.getMenuById(id);
  }

  @Post('/menu/add-post/:id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async addPostToMenu(@Param('id') id: string, @Body() listPost: any) {
    if (listPost.length === 0) {
      return {
        status: 0,
        message: 'Vui lòng thêm ít nhất phải thêm một bài viết',
      };
    }
    return await this.service.addPost(id, listPost);
  }
}
