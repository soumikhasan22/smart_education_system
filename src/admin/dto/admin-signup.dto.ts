import { IsNotEmpty, IsEmail, Matches, IsPhoneNumber } from 'class-validator';

export class AdminSignupDto {
  @IsNotEmpty() name: string;

  @IsNotEmpty() address: string;

  @IsPhoneNumber('BD') phone: string;

  @IsEmail() email: string;

  @IsNotEmpty() gender: string;

  @Matches(/^[0-9]{10,17}$/, { message: 'Invalid NID format' })
  nid: string;

  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Password must contain 8 characters, an uppercase letter, a number, and a special character',
  })
  password: string;
}
