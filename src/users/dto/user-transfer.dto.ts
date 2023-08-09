// import { Expose } from 'class-transformer';
// import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
// import { User } from '../user.entity';

// export class UserTransferDto {
//   @IsNotEmpty()
//   @IsNumber()
//   @Expose()
//   id: number;

//   @IsNotEmpty()
//   @IsString()
//   @Expose()
//   firstName: string;

//   @IsNotEmpty()
//   @IsString()
//   @Expose()
//   lastName: string;

//   @IsNotEmpty()
//   @IsEmail()
//   @Expose()
//   email: string;

//   @IsNotEmpty()
//   @IsString()
//   @Expose()
//   password: string;

//   constructor(user: User) {
//     this.id = user.id;
//     this.email = user.email;
//     this.firstName = user.firstName;
//     this.lastName = user.lastName;
//   }
// }
