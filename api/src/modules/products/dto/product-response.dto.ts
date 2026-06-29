import { ApiProperty } from '@nestjs/swagger';

//Product Response DTO
export class ProductResponseDTO {
  @ApiProperty({ description: 'Product ID', example: '56534ggh4y435643' })
  id!: string;

  @ApiProperty({ description: 'Product Name', example: 'Wireless Headphones' })
  name!: string;

  @ApiProperty({
    description: 'Product Description',
    example: 'High-Quality Wireless Headphones',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    description: 'Product Price',
    example: 99.99,
  })
  price!: number;

  @ApiProperty({
    description: 'Product Stock',
    example: 50,
  })
  stock!: number;

  @ApiProperty({
    description: 'Stock Keeping Unit',
    example: 'WH-4542342',
  })
  sku!: string;

  @ApiProperty({
    description: 'Product Image URL',
    example: 'https://example.com/image.png',
    nullable: true
  })
  imageUrl!: string | null;

  @ApiProperty({
    description: 'Product Category',
    example: 'Electronics',
  })
  category!: string;

  @ApiProperty({
    description: 'Product Availability Status',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Product Created Timestamp',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Product Updated Timestamp',
  })
  updatedAt!: Date;
}
