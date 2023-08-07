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
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ModifyCommentDto } from './dto/modify-comment.dto';

@Controller(':postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @Get('/')
  async getAllComments(@Param('postId', ParseIntPipe) postId: number) {
    return await this.commentsService.getAllComments(postId);
  }
  @Get('/:id')
  async getCommentById(
    @Param('id', ParseIntPipe) id: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return await this.commentsService.getCommentById(postId, id);
  }
  @Post('/:userId')
  async createComment(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentsService.createComment(
      postId,
      userId,
      createCommentDto,
    );
  }
  @Post('/:userId/:parentId')
  async createCommentReply(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('parentId', ParseIntPipe) parentId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentsService.createCommentReply(
      postId,
      userId,
      parentId,
      createCommentDto,
    );
  }
  @Patch('/:id')
  async modifyComment(
    @Param('id', ParseIntPipe) id: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() modifyCommentDto: ModifyCommentDto,
  ) {
    return await this.commentsService.modifyComment(
      postId,
      id,
      modifyCommentDto,
    );
  }
  @Delete('/:id')
  async deleteComment(
    @Param('id', ParseIntPipe) id: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return await this.commentsService.deleteComment(postId, id);
  }
  @Post('/likecomment/:userId/:id')
  async likeComment(
    @Param('id', ParseIntPipe) id: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.commentsService.likeComment(postId, userId, id);
  }
  @Post('/unlikecomment/:userId/:id')
  async unlikeComment(
    @Param('id', ParseIntPipe) id: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return await this.commentsService.unlikeComment(postId, userId, id);
  }
}
