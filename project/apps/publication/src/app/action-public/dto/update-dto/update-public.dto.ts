import {
  ArrayMaxSize,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdatePublicDto {
  @IsString()
  @IsMongoId()
  @IsOptional()
  public userId: string;

  // Repost
  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  public isRepost: boolean;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  public originalUserId: string;

  @IsString()
  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  public originalPublicId: string;

  // VideoPublic
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public title: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public video: string;

  // TextPublic
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public header: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public notice: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public text: string;

  // QuotePublic
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public quote: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public author: string;

  // PhotoPublic
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public photo: string;

  // LinkPublic
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public link: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public description: string;

  // Common
  @ArrayMaxSize(8)
  @IsOptional()
  public tags: string[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public publicType: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public publicStatus: string;
}
