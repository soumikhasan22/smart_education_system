import { IsNotEmpty, IsEmail } from 'class-validator';

export class AdminLoginDto {
  @IsEmail() email: string;

  @IsNotEmpty() password: string;

  @IsNotEmpty() uniqueCode: string;
}
