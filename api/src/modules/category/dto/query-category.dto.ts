import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

//DTO for Querying Categories
export class QueryCategoryDto {
  @ApiPropertyOptional({
    description: 'Filter by Active Status',
    example: true,
  })
  @Transform(({ value }) => {
    if (value === 'true' || value === true) return true;
    if (value === 'false' || value === false) return false;
    return undefined;
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Search Term to Filter by Name or Description',
    example: 'electronics',
  })
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @ApiPropertyOptional({
    description: 'Page Number for Pagination',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page = 1;

  @ApiPropertyOptional({
    description: 'Number of Items Per Page for Pagination',
    example: 10,
    default: 10,
    minimum: 1,
  })
  @Min(1)
  @IsNumber()
  @IsOptional()
  limit = 10;
}
