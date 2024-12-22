import { IsNotEmpty, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty({ message: 'Old password is required' })
  oldPassword: string;

  @IsNotEmpty({ message: 'New password is required' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'New password must be at least 8 characters long, contain at least one uppercase letter, one digit, and one special character',
  })
  newPassword: string;
}
