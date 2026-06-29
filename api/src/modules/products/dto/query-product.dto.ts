import { ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

//DTO for Querying Product
export class QueryProductDTO {
  @ApiPropertyOptional({
    description: 'Filter by Category',
    example: 'Electronics',
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiPropertyOptional({
    description: 'Filter by Product Active Status',
    example: true,
  })
  @Transform(({ value }) => {
    if (value === 'true' || value == true) return true;
    if (value === 'false' || value == false) return false;
    return undefined;
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Search by Product Name',
    example: 'headphones',
  })
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @ApiPropertyOptional({
    description: 'Page Number for Pagination',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of Items per Page',
    example: 10,
    minimum: 1,
    default: 10,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
