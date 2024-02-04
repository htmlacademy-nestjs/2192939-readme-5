import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { DEFAULT_PAGE_SEARCH_COUNT } from './repo-public.constants';

export class SearchQuery {
  @Transform(({ value }) => decodeURIComponent(value))
  @IsString()
  public title: string;

  @IsInt()
  @IsOptional()
  public limit: number = DEFAULT_PAGE_SEARCH_COUNT;
}
