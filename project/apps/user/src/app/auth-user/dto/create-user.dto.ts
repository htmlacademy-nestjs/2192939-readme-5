import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email',
    example: 'user@host.local',
  })
  public email!: string;

  @ApiProperty({
    description: 'User name',
    example: 'Keks',
  })
  public name!: string;

  @ApiProperty({
    description: 'User password',
    example: '12345678',
  })
  public password!: string;
}
