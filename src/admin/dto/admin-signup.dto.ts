import { IsString, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AdminSignupDto {
  @IsString({ message: 'Name must be a string.' })
  @IsNotEmpty({ message: 'Name field is required.' })
  name: string;

  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email field is required.' })
  email: string;

  @IsString({ message: 'Password must be a string.' })
  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @IsNotEmpty({ message: 'Password field is required.' })
  password: string;
}
