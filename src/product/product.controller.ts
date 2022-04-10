import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductModel } from './product.model';
import { FindWithReviewsType, ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UseGuards(AuthGuard('jwt'))
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateProductDto): Promise<DocumentType<ProductModel>> {
		return await this.productService.create(dto);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get(':productId')
	async get(
		@Param('productId', IdValidationPipe) productId: string,
	): Promise<DocumentType<ProductModel>> {
		return await this.productService.findById(productId);
	}

	@UseGuards(AuthGuard('jwt'))
	@Patch(':productId')
	async update(
		@Param('productId', IdValidationPipe) productId: string,
		@Body() dto: UpdateProductDto,
	): Promise<DocumentType<ProductModel>> {
		return await this.productService.updateById(productId, dto);
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete(':productId')
	async delete(
		@Param('productId', IdValidationPipe) productId: string,
	): Promise<DocumentType<ProductModel>> {
		return await this.productService.deleteById(productId);
	}

	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindProductDto): Promise<FindWithReviewsType> {
		return await this.productService.findWithReviews(dto);
	}
}
