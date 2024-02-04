import { IsMongoId } from 'class-validator';

export class RepostPublicDto {
  @IsMongoId()
  userId: string;
}
