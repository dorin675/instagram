import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { userType } from './dto/user.enum';
import { VerifyUserDto } from './dto/verify-user.dto';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { SignInUserDto } from './dto/sign-in.to';
import { ModifyUserDto } from './dto/modify-user.dto';

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const EXPIRATION_TIME = process.env.EXPIRATION_TIME;
console.log(JWT_SECRET_KEY, EXPIRATION_TIME);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRepository) private userRepo: UserRepository,
  ) {}
  async getAllUsers(): Promise<User[]> {
    return await this.userRepo.find();
  }
  async getUserById(id: number): Promise<User> {
    return await this.userRepo.findOne({
      where: { id },
    });
  }
  async createUser({
    firstName,
    lastName,
    email,
    password,
  }: CreateUserDto): Promise<User> {
    const oldUser = await this.userRepo.findOne({
      where: { email },
      select: { id: true },
    });
    if (oldUser) {
      throw new ConflictException('user with this email exists');
    }
    const user = this.userRepo.create({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10),
      verificationCode: await bcrypt.hash('banana', 10),
      type: userType.USER,
    });
    return await this.userRepo.save(user);
  }

  private async _getToken(email: string): Promise<string> {
    const user = await this.userRepo.findOne({ where: { email } });
    const token = jwt.sign(
      {
        id: user.id,
        type: user.type,
        isActive: user.isActive,
        verified: user.verified,
      },
      JWT_SECRET_KEY,
      { expiresIn: EXPIRATION_TIME },
    );
    return token;
  }

  async verify({ email, verificationCode }: VerifyUserDto): Promise<string> {
    const user = await this.userRepo.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const match = await bcrypt.compare(verificationCode, user.verificationCode);

    if (!match) {
      throw new UnauthorizedException('Verification Code is wrong');
    }

    if (user.verified) {
      throw new ConflictException('User already verificated');
    }

    await this.userRepo.update(user.id, { verified: true });

    return await this._getToken(user.email);
  }

  async signIn({ email, password }: SignInUserDto): Promise<string> {
    const user = await this.userRepo.findOne({
      where: { email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new UnauthorizedException('Password is wrong');
    }

    if (!user.verified || !user.isActive) {
      throw new ConflictException('User is not verified or active');
    }
    return await this._getToken(user.email);
  }

  async modifyUser(
    id: number,
    { firstName, lastName }: ModifyUserDto,
  ): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.firstName = firstName;
    user.lastName = lastName;
    return await this.userRepo.save(user);
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepo.delete(user);
    return user;
  }
}
