import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator';

export class AuthUserDto {
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsString()
  @IsOptional() // Optional field
  role: string;
}
