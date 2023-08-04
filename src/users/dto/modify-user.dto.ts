import { IsNotEmpty, IsString } from 'class-validator';

export class ModifyUserDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @IsNotEmpty()
  @IsString()
  lastName: string;
}
