import { IsNotEmpty, IsString } from 'class-validator';

export class ModifyCommentDto {
  @IsNotEmpty()
  @IsString()
  commentContent: string;
}
