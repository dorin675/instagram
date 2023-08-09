import { Comment } from 'src/comments/comment.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  context: string;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  userCreator: User;

  @ManyToMany(() => User, (user) => user.likedPosts, { onDelete: 'CASCADE' })
  usersThatLikedPost: User[];

}
