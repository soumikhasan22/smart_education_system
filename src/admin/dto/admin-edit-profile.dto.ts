import { IsOptional, IsString, IsPhoneNumber } from 'class-validator';

export class AdminEditProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsPhoneNumber('BD')
  phone?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  
  @IsOptional()
  email?: string;
  @IsOptional()
  nid?: string; 
}
