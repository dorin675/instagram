import { IsNotEmpty, IsString } from 'class-validator';

export class ModiFyPostDto {
  @IsNotEmpty()
  @IsString()
  context: string;
}
