import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductModel } from './product.model';
import { FindWithReviewsType, ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateProductDto): Promise<DocumentType<ProductModel>> {
		return await this.productService.create(dto);
	}

	@Get(':productId')
	async get(@Param('productId') productId: string): Promise<DocumentType<ProductModel>> {
		return await this.productService.findById(productId);
	}

	@Patch(':productId')
	async update(
		@Param('productId') productId: string,
		@Body() dto: UpdateProductDto,
	): Promise<DocumentType<ProductModel>> {
		return await this.productService.updateById(productId, dto);
	}

	@Delete(':productId')
	async delete(@Param('productId') productId: string): Promise<DocumentType<ProductModel>> {
		return await this.productService.deleteById(productId);
	}

	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindProductDto): Promise<FindWithReviewsType> {
		return await this.productService.findWithReviews(dto);
	}
}
