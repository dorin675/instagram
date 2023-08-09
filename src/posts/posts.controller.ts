import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ModiFyPostDto } from './dto/modify-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @Get('/')
  async getAllPosts() {
    return await this.postsService.getAllPosts();
  }
  @Get('/:id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.getPostById(id);
  }
  @Post('/:userId')
  async createPost(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() createPostDto: CreatePostDto,
  ) {
    return await this.postsService.createPost(userId, createPostDto);
  }
  @Patch('/:id')
  async modifyPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() modifyPostDto: ModiFyPostDto,
  ) {
    return await this.postsService.modifyPost(id, modifyPostDto);
  }
  @Delete('/:id')
  async deletePost(@Param('id', ParseIntPipe) id: number) {
    return await this.postsService.deletePost(id);
  }
  @Post('/likePost/:userId/:id')
  async likePost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.postsService.likePost(userId, id);
  }
  @Post('/unlikePost/:userId/:id')
  async unlikePost(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.postsService.unlikePost(userId, id);
  }
  @Get('/feed/:userId')
  async feed(@Param('userId', ParseIntPipe) userId: number) {
    return await this.postsService.feed(userId);
  }
}
