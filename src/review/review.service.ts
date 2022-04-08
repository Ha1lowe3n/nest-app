import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Types } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewModel } from './review.model';
import { ReviewErrorMessages } from '../errors/errors-messages';

@Injectable()
export class ReviewService {
	constructor(@InjectModel(ReviewModel) private readonly reviewModel: ModelType<ReviewModel>) {}

	async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
		return await this.reviewModel.create(dto);
	}

	async delete(id: string): Promise<DocumentType<ReviewModel>> {
		const deletedReview = await this.reviewModel.findByIdAndDelete(id);
		if (!deletedReview) {
			throw new HttpException(ReviewErrorMessages.REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedReview;
	}

	async findByProductId(productId: string): Promise<DocumentType<ReviewModel>[]> {
		const result = await this.reviewModel.find({ productId: new Types.ObjectId(productId) });
		if (!result.length) {
			throw new HttpException(ReviewErrorMessages.PRODUCT_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return result;
	}

	async deleteByProductId(productId: string): Promise<DeleteResult> {
		const result = await this.reviewModel.find({ productId: new Types.ObjectId(productId) });
		if (!result.length) {
			throw new HttpException(ReviewErrorMessages.PRODUCT_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return await this.reviewModel.deleteMany({
			productId: new Types.ObjectId(productId),
		});
	}
}
