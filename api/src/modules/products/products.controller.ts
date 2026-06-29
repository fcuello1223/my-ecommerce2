import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ProductsService } from './products.service';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

import { Roles } from 'src/common/decorators/roles.decorator';

import { Role } from '@prisma/client';

import { CreateProductDTO } from './dto/create-product.dto';
import { ProductResponseDTO } from './dto/product-response.dto';
import { QueryProductDTO } from './dto/query-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  //Create Product
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a New Product (Admin Only)' })
  @ApiBody({ type: CreateProductDTO })
  @ApiResponse({
    status: 201,
    description: 'Product Created Successfully',
    type: ProductResponseDTO,
  })
  @ApiResponse({ status: 409, description: 'Product SKU Already Exists' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin Role Required' })
  async create(
    @Body() createProductDTO: CreateProductDTO,
  ): Promise<ProductResponseDTO> {
    return await this.productsService.create(createProductDTO);
  }

  //Get All Products
  @Get()
  @ApiOperation({ summary: 'Fetch All Products with Optional Filters' })
  @ApiResponse({
    status: 200,
    description: 'List of All Products with Pagination',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ProductResponseDTO' },
        },
        meta: {
          type: 'object',
          properties: {
            totalProducts: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async getAllProducts(@Query() queryProductDTO: QueryProductDTO) {
    return await this.productsService.getAllProducts(queryProductDTO);
  }

  //Get Product by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get Product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product Details',
    type: ProductResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Product Not Found',
    type: ProductResponseDTO,
  })
  async getProductByID(@Param('id') id: string): Promise<ProductResponseDTO> {
    return await this.productsService.getProductByID(id);
  }

  //Update Product
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a Product (Admin Only)' })
  @ApiBody({ type: UpdateProductDTO })
  @ApiResponse({
    status: 200,
    description: 'Product Updated Successfully',
    type: ProductResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'Product Not Found' })
  @ApiResponse({ status: 409, description: 'SKU Already Exists' })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDTO: UpdateProductDTO,
  ): Promise<ProductResponseDTO> {
    return await this.productsService.updateProduct(id, updateProductDTO);
  }

  //Update Product Stock
  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update Product Stock' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quantity: {
          type: 'number',
          description:
            'Stock Adjustment (Positive to Add, Negative to Subtract)',
          example: 10,
        },
      },
      required: ['quantity'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Product Stock Updated Successfully',
    type: ProductResponseDTO,
  })
  @ApiResponse({ status: 400, description: 'Insufficient Stock' })
  @ApiResponse({ status: 404, description: 'Product Not Found' })
  async updateStock(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ): Promise<ProductResponseDTO> {
    return await this.productsService.updateStock(id, quantity);
  }

  //Delete Product
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a Product (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Product Deleted Successfully' })
  @ApiResponse({ status: 404, description: 'Product not Found' })
  @ApiResponse({
    status: 400,
    description: 'Cannot Delete Product in Active Orders',
  })
  async deleteProduct(@Param('id') id: string): Promise<{ message: string }> {
    return await this.productsService.deleteProduct(id);
  }
}
