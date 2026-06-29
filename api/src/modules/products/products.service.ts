import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateProductDTO } from './dto/create-product.dto';
import { ProductResponseDTO } from './dto/product-response.dto';
import { QueryProductDTO } from './dto/query-product.dto';

import { Category, Prisma, Product } from '@prisma/client';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  //Create Product
  async create(
    createProductDTO: CreateProductDTO,
  ): Promise<ProductResponseDTO> {
    const existingSKU = await this.prisma.product.findUnique({
      where: { sku: createProductDTO.sku },
    });
    if (existingSKU) {
      throw new ConflictException(
        `Product with SKU ${createProductDTO.sku} Already Exists`,
      );
    }

    const product = await this.prisma.product.create({
      data: {
        ...createProductDTO,
        price: new Prisma.Decimal(createProductDTO.price),
      },
      include: {
        category: true,
      },
    });

    return this.formatProduct(product);
  }

  //Get All Products
  async getAllProducts(queryProductDTO: QueryProductDTO): Promise<{
    data: ProductResponseDTO[];
    meta: {
      totalProducts: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const {
      category,
      isActive,
      searchTerm,
      page = 1,
      limit = 10,
    } = queryProductDTO;

    const where: Prisma.ProductWhereInput = {};

    if (category) {
      where.categoryId = category;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    const totalProducts = await this.prisma.product.count({ where: where });

    const products = await this.prisma.product.findMany({
      where: where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
      },
    });

    return {
      data: products.map((product) => {
        return this.formatProduct(product);
      }),
      meta: {
        totalProducts: totalProducts,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalProducts / limit),
      },
    };
  }

  //Get Product By ID
  async getProductByID(id: string): Promise<ProductResponseDTO> {
    const product = await this.prisma.product.findUnique({
      where: { id: id },
      include: {
        category: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    return this.formatProduct(product);
  }

  //Update Product
  async updateProduct(
    id: string,
    updateProductDTO: UpdateProductDTO,
  ): Promise<ProductResponseDTO> {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id: id },
    });

    if (!existingProduct) {
      throw new NotFoundException('Product Not Found');
    }

    if (updateProductDTO.sku && updateProductDTO.sku !== existingProduct.sku) {
      const skuTaken = await this.prisma.product.findUnique({
        where: { sku: updateProductDTO.sku },
      });
      if (skuTaken) {
        throw new ConflictException(
          `Product with SKU ${updateProductDTO.sku} Already Exists`,
        );
      }
    }

    const updateData: any = { ...updateProductDTO };

    if (updateProductDTO.price !== undefined) {
      updateData.price = new Prisma.Decimal(updateProductDTO.price);
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return this.formatProduct(updatedProduct);
  }

  //Update Product Stock
  async updateStock(id: string, quantity: number): Promise<ProductResponseDTO> {
    const product = await this.prisma.product.findUnique({
      where: { id: id },
    });
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }

    const newStock = product.stock + quantity;
    if (newStock < 0) {
      throw new BadRequestException('Insufficient Stock');
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id: id },
      data: {
        stock: newStock,
      },
      include: {
        category: true,
      },
    });

    return this.formatProduct(updatedProduct);
  }

  //Delete Product
  async deleteProduct(id: string): Promise<{ message: string }> {
    const product = await this.prisma.product.findUnique({
      where: { id: id },
      include: { cartItems: true, orderItems: true },
    });

    if (!product) {
      throw new NotFoundException('Product not Found');
    }

    if (product.orderItems.length > 0) {
      throw new BadRequestException(
        'Cannot Delete Product that is Part of Existing Orders. Consider Marking it as Inactive',
      );
    }

    await this.prisma.product.delete({
      where: { id: id },
    });

    return { message: 'Product Deleted Successfully' };
  }

  private formatProduct(
    product: Product & { category: Category },
  ): ProductResponseDTO {
    return {
      ...product,
      price: Number(product.price),
      category: product.category.name,
    };
  }
}
