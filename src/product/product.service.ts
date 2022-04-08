import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { ReviewModel } from '../review/review.model';
import { ProductErrorMessages } from '../errors/errors-messages';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductModel } from './product.model';

export type FindWithReviewsType = (ProductModel & {
	review: ReviewModel[];
	reviewCount: number;
	reviewAvg: number;
})[];

@Injectable()
export class ProductService {
	constructor(
		@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>,
	) {}

	async create(dto: CreateProductDto): Promise<DocumentType<ProductModel>> {
		return await this.productModel.create(dto);
	}

	async findById(productId: string): Promise<DocumentType<ProductModel>> {
		const product = await this.productModel.findById(productId);
		if (!product) {
			throw new HttpException(ProductErrorMessages.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return product;
	}

	async deleteById(id: string): Promise<DocumentType<ProductModel>> {
		const deletedProduct = await this.productModel.findByIdAndDelete(id);
		if (!deletedProduct) {
			throw new HttpException(ProductErrorMessages.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedProduct;
	}

	async updateById(id: string, dto: UpdateProductDto): Promise<DocumentType<ProductModel>> {
		const updatedProduct = await this.productModel.findByIdAndUpdate(id, dto, { new: true });
		if (!updatedProduct) {
			throw new HttpException(ProductErrorMessages.PRODUCT_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return updatedProduct;
	}

	async findWithReviews(dto: FindProductDto): Promise<FindWithReviewsType> {
		return await this.productModel.aggregate([
			{ $match: { categories: dto.category } },
			{ $sort: { _id: 1 } },
			{ $limit: dto.limit },
			{
				$lookup: {
					from: 'Review',
					localField: '_id',
					foreignField: 'productId',
					as: 'reviews',
				},
			},
			{
				$addFields: {
					reviewsCount: { $size: '$reviews' },
					reviewsAvg: { $avg: '$reviews.rating' },
				},
			},
		]);
	}
}
