import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from 'src/users/user.repository';
import { PostRepository } from './post.repository';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { ModiFyPostDto } from './dto/modify-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
    @InjectRepository(PostRepository) private readonly postRepo: PostRepository,
  ) {}
  async getAllPosts(): Promise<Post[]> {
    return await this.postRepo.find({ relations: { userCreator: true } });
  }
  async getPostById(id: number): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: { userCreator: true },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }
  async createPost(userId: number, { context }: CreatePostDto): Promise<Post> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const post = this.postRepo.create({ context: context, userCreator: user });
    return await this.postRepo.save(post);
  }
  async modifyPost(id: number, { context }: ModiFyPostDto): Promise<Post> {
    const post = await this.postRepo.findOne({ where: { id } });
    if (!post) {
      throw new ConflictException('Post does not exist');
    }
    post.context = context;
    return await this.postRepo.save(post);
  }
  async deletePost(id: number): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: {
        userCreator: true,
      },
    });
    if (!post) {
      throw new ConflictException('Post does not exist');
    }
    // const user = await this.userRepo.findOne({
    //   where: { id: post.userCreator.id },
    //   relations: {
    //     likedPosts: true,
    //     posts: true,
    //   },
    // });
    // if (user.likedPosts.includes(post)) {
    //   const index = user.likedPosts.indexOf(post);
    //   user.likedPosts.splice(index, 1);
    // }
    // if (user.posts.includes(post)) {
    //   const index = user.posts.indexOf(post);
    //   user.posts.splice(index, 1);
    // }
    // await this.userRepo.save(user);
    await this.postRepo.delete(post.id);
    return post;
  }

  async likePost(userId: number, id: number): Promise<number> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: {
        likedPosts: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const post = await this.postRepo.findOne({
      where: { id },
      relations: {
        usersThatLikedPost: true,
      },
    });
    if (!post) {
      throw new ConflictException('Post does not exist');
    }

    console.log(`prev`, post.usersThatLikedPost);
    // post.usersThatLikedPost = [...new Set(post.usersThatLikedPost)];
    if (post.usersThatLikedPost.findIndex((e) => e.id === user.id) === -1) {
      console.log('tes`');
      post.usersThatLikedPost.push(user);
      user.likedPosts.push(post);
    }
    console.log('NEX', post.usersThatLikedPost);
    await this.postRepo.save(post);
    await this.userRepo.save(user);
    return post.usersThatLikedPost.length;
  }
  async unlikePost(userId: number, id: number): Promise<number> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    const post = await this.postRepo.findOne({
      where: { id },
      relations: {
        usersThatLikedPost: true,
      },
    });
    if (!post) {
      throw new ConflictException('Post does not exist');
    }
    console.log('prev', post.usersThatLikedPost);
    // post.usersThatLikedPost = [...new Set(post.usersThatLikedPost)];
    if (post.usersThatLikedPost.map((x) => x.id).includes(user.id)) {
      const index = post.usersThatLikedPost.indexOf(user);
      post.usersThatLikedPost.splice(index, 1);
      console.log('in process', post.usersThatLikedPost);
    }
    console.log('after', post.usersThatLikedPost);
    await this.postRepo.save(post);
    await this.userRepo.save(user);
    return post.usersThatLikedPost.length;
  }
  async feed(userId: number): Promise<Post[]> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['following', 'following.posts'],
    });
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    console.log(user.following);
    const posts: Post[] = [];
    const test = user.following.map(({ posts }) => posts).flat();
    user.following.forEach((x) => {
      x.posts.forEach((post) => posts.push(post));
    });
    return test;
  }
}
