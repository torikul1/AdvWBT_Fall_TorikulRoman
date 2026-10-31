import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Products } from './entities/products.entity.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PartialUpdateProductDto } from './dto/partial-update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private productsRepo: Repository<Products>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.productsRepo.create(dto);
    const savedProduct = await this.productsRepo.save(product);
    return { message: 'Product created successfully', data: savedProduct };
  }

  async findAll() {
    const products = await this.productsRepo.find({
      order: { createdAt: 'DESC' },
    });
    return { message: 'All products fetched', count: products.length, data: products };
  }

  async findOne(id: number) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return { message: 'Product found', data: product };
  }

  async update(id: number, dto: PartialUpdateProductDto) {
    await this.findOne(id);
    await this.productsRepo.update(id, dto);
    const updatedProduct = await this.productsRepo.findOne({ where: { id } });
    return { message: 'Product partially updated', data: updatedProduct };
  }

  async replace(id: number, dto: UpdateProductDto) {
    await this.findOne(id);
    await this.productsRepo.update(id, dto);
    const replacedProduct = await this.productsRepo.findOne({ where: { id } });
    return { message: 'Product fully replaced', data: replacedProduct };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.productsRepo.delete(id);
    return { message: 'Product deleted successfully', id };
  }

  async findByCategory(category: string) {
    const products = await this.productsRepo.find({
      where: { category },
      order: { createdAt: 'DESC' },
    });
    return { message: `Products in category ${category}`, count: products.length, data: products };
  }

  async search(keyword: string) {
    const products = await this.productsRepo.find({
      where: { name: ILike(`%${keyword}%`) },
      order: { createdAt: 'DESC' },
    });
    return { message: `Search results for keyword: ${keyword}`, count: products.length, data: products };
  }

  async toggleActive(id: number) {
    const result = await this.findOne(id);
    const product = result.data;
    product.isActive = !product.isActive;
    const savedProduct = await this.productsRepo.save(product);
    return { message: 'Product active status toggled', data: savedProduct };
  }
}