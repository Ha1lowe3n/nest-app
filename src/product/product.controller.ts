import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { FindProductDto } from './dto/find-product.dto';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@Post('create')
	async create(@Body() dto: ProductModel): Promise<void> {}

	@Get(':id')
	async get(@Param(':id') id: string): Promise<void> {}

	@Patch(':id')
	async update(@Param(':id') id: string, @Body() dto: Partial<ProductModel>): Promise<void> {}

	@Delete(':id')
	async delete(@Param(':id') id: string): Promise<void> {}

	@HttpCode(200)
	@Post()
	async find(@Body() dto: FindProductDto): Promise<void> {}
}
