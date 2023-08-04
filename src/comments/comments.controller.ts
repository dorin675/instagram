import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller(':postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @Get('/')
  async getAllComments() {
    return 'All Comments';
  }
  @Get('/:id')
  async getCommentById(@Param('id', ParseIntPipe) id: number) {
    return `Comment with id ${id} was found`;
  }
  @Post('/')
  async createComment() {
    return 'Comment was created';
  }
  @Patch('/:id')
  async modifyComment(@Param('id', ParseIntPipe) id: number) {
    return `Comment with id ${id} was modified`;
  }
  @Delete('/:id')
  async deleteComment(@Param('id', ParseIntPipe) id: number) {
    return `Comment with id ${id} was deleted`;
  }
}
