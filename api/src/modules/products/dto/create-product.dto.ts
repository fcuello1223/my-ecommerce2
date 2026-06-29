import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

//DTO for Creating a New Product
export class CreateProductDTO {
  @ApiProperty({
    description: 'Product Name',
    example: 'Wireless Headphones',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name!: string;

  @ApiProperty({
    description: 'Product Description',
    example: 'High-Quality Wireless Headphones with Noise Cancellation',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Product Price in USD',
    example: 99.99,
    minimum: 0,
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @Min(0)
  @Type(() => Number)
  price!: number;

  @ApiProperty({
    description: 'Quantity in Stock',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stock!: number;

  @ApiProperty({
    description: 'Stock Keeping Unit (SKU) -> Unique Product Identifer',
    example: 'WH-007',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku!: string;

  @ApiProperty({
    description: 'Product Image URL',
    example: 'https://example.com/image.png',
    required: false,
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Product Category',
    example: 'Electronics',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty({
    description:
      'Indicates Whether Product is Active and Available for Purchase',
    example: true,
    default: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
