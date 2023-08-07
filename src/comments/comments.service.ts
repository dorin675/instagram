import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from 'src/posts/post.repository';
import { UserRepository } from 'src/users/user.repository';
import { CommentRepository } from './comment.repository';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ModifyCommentDto } from './dto/modify-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @InjectRepository(PostRepository) private readonly postRepo: PostRepository,
    @InjectRepository(CommentRepository)
    private readonly commentRepo: CommentRepository,
  ) {}
  async getAllComments(postId: number): Promise<Comment[]> {
    const post = await this.postRepo.find({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException('Post Not Found!');
    }
    const comments = await this.commentRepo.find({
      relations: ['replies', 'replies.replies'],
      where: {
        post,
      },
    });
    return comments;
  }
  async getCommentById(postId: number, commentId: number): Promise<Comment> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException('Post Not Found!');
    }
    const comments = await this.commentRepo.find({
      relations: ['replies', 'replies.replies', 'post'],
    });
    return comments
      .filter((x) => x.post.id === postId)
      .find(({ id }) => id === commentId);
  }
  async createComment(
    postId: number,
    userId: number,
    { commentContent }: CreateCommentDto,
  ): Promise<Comment> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException('Post Not Found!');
    }
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    const comment = this.commentRepo.create({
      commentContent: commentContent,
      post: post,
      user: user,
    });
    return await this.commentRepo.save(comment);
  }
  async modifyComment(
    postId: number,
    id: number,
    { commentContent }: ModifyCommentDto,
  ) {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException('Post Not Found!');
    }
    const comment = await this.commentRepo.findOne({
      where: {
        id,
      },
      relations: {
        post: true,
      },
    });
    if (!comment) {
      throw new NotFoundException('Comment Not Found!');
    }
    if (comment.post.id === post.id) {
      comment.commentContent = commentContent;
      return await this.commentRepo.save(comment);
    }
    throw new BadRequestException('This post does not contain this comment');
  }
  async deleteComment(postId: number, id: number): Promise<Comment> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException('Post Not Found!');
    }
    const comment = await this.commentRepo.findOne({
      where: {
        id,
      },
      relations: {
        post: true,
      },
    });
    if (!comment) {
      throw new NotFoundException('Comment Not Found!');
    }
    if (comment.post.id === post.id) {
      await this.commentRepo.delete(comment);
      return comment;
    }
    throw new BadRequestException('This post does not contain this comment');
  }
  async createCommentReply(
    postId: number,
    userId: number,
    parentId: number,
    { commentContent }: CreateCommentDto,
  ): Promise<Comment> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException('Post Not Found!');
    }
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    const parentComment = await this.commentRepo.findOne({
      where: {
        id: parentId,
      },
    });
    if (!parentComment) {
      throw new NotFoundException(
        'The comment you want to reply does not exist',
      );
    }
    const comment = this.commentRepo.create({
      commentContent: commentContent,
      post: post,
      user: user,
      parent: parentComment,
    });
    return await this.commentRepo.save(comment);
  }
  async likeComment(
    postId: number,
    userId: number,
    id: number,
  ): Promise<number> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException('Post Not Found!');
    }
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
      relations: {
        likedComments: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: { post: true, userThatLiked: true },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found!');
    }
    if (comment.post.id !== post.id) {
      throw new BadRequestException('This post does not contain this comment');
    }
    if (comment.userThatLiked.findIndex((e) => e.id === user.id) === -1) {
      comment.userThatLiked.push(user);
      user.likedComments.push(comment);
    }
    await this.commentRepo.save(comment);
    await this.userRepo.save(user);
    return comment.userThatLiked.length;
  }
  async unlikeComment(
    postId: number,
    userId: number,
    id: number,
  ): Promise<number> {
    const post = await this.postRepo.findOne({
      where: {
        id: postId,
      },
    });
    if (!post) {
      throw new NotFoundException('Post Not Found!');
    }
    const user = await this.userRepo.findOne({
      where: {
        id: userId,
      },
      relations: {
        likedComments: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User Not Found!');
    }
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: { post: true, userThatLiked: true },
    });
    if (!comment) {
      throw new NotFoundException('Comment not found!');
    }
    if (comment.post.id !== post.id) {
      throw new BadRequestException('This post does not contain this comment');
    }
    if (comment.userThatLiked.map((x) => x.id).includes(user.id)) {
      const index = comment.userThatLiked.indexOf(user);
      const indexOfUser = user.likedComments.indexOf(comment);
      comment.userThatLiked.splice(index, 1);
      user.likedComments.splice(indexOfUser, 1);
    }
    await this.commentRepo.save(comment);
    await this.userRepo.save(user);
    return comment.userThatLiked.length;
  }
}
