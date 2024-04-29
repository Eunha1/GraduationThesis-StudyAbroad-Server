import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { Roles } from '../role/role.decorator';
import { Role } from '../enum/roles.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RoleGuard } from '../role/role.guard';
import { newPost } from './post.dto';

@Controller('api/post')
export class PostController {
  constructor(private readonly service: PostService) {}

  @Post('create-newPost')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async createNewPost(@Body() newPost: newPost) {
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
    return await this.service.createNewPost(newPost);
  }

  @Get('list-post')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async getListPost() {
    return await this.service.getListPost();
  }

  @Get('post/:post_id')
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RoleGuard)
  async getPostById(@Param('post_id') postId: string) {
    return await this.service.getPostById(postId);
  }
}
