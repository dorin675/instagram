import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { userType } from './dto/user.enum';
import { Post } from 'src/posts/post.entity';
import { Comment } from 'src/comments/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  type: userType;

  @Column()
  verificationCode: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  verified: boolean;

  @OneToMany(() => Post, (post) => post.userCreator)
  posts: Post[];

  @ManyToMany(() => Post, (post) => post.usersThatLikedPost)
  @JoinTable()
  likedPosts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @ManyToMany(() => Comment, (comment) => comment.userThatLiked)
  @JoinTable()
  likedComments: Comment[];

  @ManyToMany(() => User, (user) => user.followers, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  // {
  //   name: 'user_follows',
  //   joinColumn: { name: 'follower_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'following_id', referencedColumnName: 'id' },
  // }
  @JoinTable()
  following: User[];

  @ManyToMany(() => User, (user) => user.following, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  followers: User[];
}
