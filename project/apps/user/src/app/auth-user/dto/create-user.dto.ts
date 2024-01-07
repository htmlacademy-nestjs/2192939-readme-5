import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { AUTH_USER_EMAIL_NOT_VALID } from '../auth-user.constant';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@host.local',
  })
  @IsEmail({}, { message: AUTH_USER_EMAIL_NOT_VALID })
  public email!: string;

  @ApiProperty({
    description: 'User name',
    example: 'Keks',
  })
  @IsString()
  public name!: string;

  @ApiProperty({
    description: 'User password',
    example: '12345678',
  })
  @IsString()
  public password!: string;
}
