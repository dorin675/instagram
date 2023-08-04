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
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { SignInUserDto } from './dto/sign-in.to';
import { ModifyUserDto } from './dto/modify-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Get('/')
  async getAllUsers(): Promise<User[]> {
    return await this.usersService.getAllUsers();
  }
  @Get('/:id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.getUserById(id);
  }
  @Post('/')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }
  @Post('/verify')
  async verifyUser(@Body() verifyUserDto: VerifyUserDto) {
    return await this.usersService.verify(verifyUserDto);
  }
  @Post('/signIn')
  async signIn(@Body() signInDto: SignInUserDto): Promise<string> {
    return await this.usersService.signIn(signInDto);
  }
  @Patch('/:id')
  async modifyUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() modifyUserDto: ModifyUserDto,
  ) {
    return await this.usersService.modifyUser(id, modifyUserDto);
  }
  @Delete('/:id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.deleteUser(id);
  }
}
