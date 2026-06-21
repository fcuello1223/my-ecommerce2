import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { CategoryResponseDto } from './dto/category-response.dto';
import { CreateCategoryDto } from './dto/create-category.dto';

import { Category, Prisma } from '@prisma/client';
import { QueryCategoryDto } from './dto/query-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  //Create a New Category
  async createNewCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryResponseDto> {
    const { name, slug, ...rest } = createCategoryDto;

    const categorySlug =
      slug ??
      name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');

    const existingCategory = await this.prisma.category.findUnique({
      where: { slug: categorySlug },
    });
    if (existingCategory) {
      throw new Error(
        'Category with this Slug Already Exists: ' + categorySlug,
      );
    }

    const category = await this.prisma.category.create({
      data: {
        name: name,
        slug: categorySlug,
        ...rest,
      },
    });

    return this.formatCategory(category, 0);
  }

  //Get all Categories with Optional Filters and Pagination
  async findAllCategories(queryDto: QueryCategoryDto): Promise<{
    data: CategoryResponseDto[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    const { isActive, searchTerm, page = 1, limit = 10 } = queryDto;

    const where: Prisma.CategoryWhereInput = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (searchTerm) {
      where.OR = [
        {
          name: { contains: searchTerm, mode: 'insensitive' },
        },
        {
          description: { contains: searchTerm, mode: 'insensitive' },
        },
      ];
    }

    const total = await this.prisma.category.count({ where: where });

    const categories = await this.prisma.category.findMany({
      where: where,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return {
      data: categories.map((category) => {
        return this.formatCategory(category, category._count.products);
      }),
      meta: {
        total: total,
        page: page,
        limit: limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  //Get Category By ID
  async findCategory(id: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { id: id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not Found!');
    }

    return this.formatCategory(category, Number(category._count.products));
  }

  //Get Category by Slug
  async findBySlug(slug: string): Promise<CategoryResponseDto> {
    const category = await this.prisma.category.findUnique({
      where: { slug: slug },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not Found!');
    }

    return this.formatCategory(category, Number(category._count.products));
  }

  //Update Category
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id: id },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category Not Found');
    }

    if (
      updateCategoryDto.slug &&
      updateCategoryDto.slug !== existingCategory.slug
    ) {
      const slugTaken = await this.prisma.category.findUnique({
        where: { slug: updateCategoryDto.slug },
      });

      if (slugTaken) {
        throw new ConflictException(
          `Category with ${updateCategoryDto.slug} Already Exists`,
        );
      }

      const updatedCategory = await this.prisma.category.update({
        where: { id: id },
        data: updateCategoryDto,
        include: {
          _count: {
            select: { products: true },
          },
        },
      });

      return this.formatCategory(
        updatedCategory,
        Number(updatedCategory._count.products),
      );
    }
  }

  //Remove Category
  async remove(id: string): Promise<{ message: string }> {
    const category = await this.prisma.category.findUnique({
      where: { id: id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category Not Found');
    }

    if (category._count.products > 0) {
      throw new BadRequestException(
        `Cannot Delete Category with ${category._count.products} Products. Remove or Reassign First`,
      );
    }

    await this.prisma.category.delete({
      where: { id: id },
    });

    return { message: 'Category Deleted Successfully!' };
  }

  private formatCategory(
    category: Category,
    productCount: number,
  ): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      slug: category.slug,
      imageUrl: category.imageUrl,
      isActive: category.isActive,
      productCount: productCount,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
