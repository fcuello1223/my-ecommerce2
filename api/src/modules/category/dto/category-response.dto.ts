import { ApiProperty } from "@nestjs/swagger";

//DTO for Category Response
export class CategoryResponseDto {
  @ApiProperty({
    example: '563454935gsdfvfv-4635432giibf',
    description: 'The Unique Identifier of the Category',
  })
  id!: string;

  @ApiProperty({
    example: 'Electronics',
    description: 'The Name of the Category',
  })
  name!: string;

  @ApiProperty({
    example: 'Devices and Gadgets Including Phones, Tablets and Accessories',
    description: 'A Brief Description of the Category',
    nullable: true,
  })
  description!: string | null;

  @ApiProperty({
    example: 'electronics',
    description: 'The URL-friendly Slug for the Category',
    nullable: true,
  })
  slug!: string | null;

  @ApiProperty({
    example: 'https://example.com/images/electronics.png',
    description: 'URL of the Category Image',
    nullable: true,
  })
  imageUrl!: string | null;

  @ApiProperty({
    example: true,
    description: 'Indicates if the Category is Active',
  })
  isActive!: boolean;

  @ApiProperty({
    example: 150,
    description: 'Number of Products in this Category',
  })
  productCount!: number;

  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    description: 'Date and Time when Category was Created',
  })
  createdAt!: Date;

  @ApiProperty({
    example: '2024-01-01T12:00:00Z',
    description: 'Date and Time when Category was Last Updated',
  })
  updatedAt!: Date;
}
