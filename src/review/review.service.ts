import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { Types } from 'mongoose';
import { DeleteResult } from 'mongodb';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewModel } from './review.model';

@Injectable()
export class ReviewService {
	constructor(@InjectModel(ReviewModel) private readonly reviewModel: ModelType<ReviewModel>) {}

	async create(dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
		return await this.reviewModel.create(dto);
	}

	async delete(id: string): Promise<DocumentType<ReviewModel> | null> {
		try {
			return await this.reviewModel.findByIdAndDelete(id);
		} catch (error) {
			if (error instanceof Error) {
				return null;
			}
		}
	}

	async getByProductId(productId: string): Promise<DocumentType<ReviewModel>[] | null> {
		try {
			return await this.reviewModel.find({ productId: new Types.ObjectId(productId) });
		} catch (error) {
			if (error instanceof Error) {
				return null;
			}
		}
	}

	async deleteByProductId(productId: string): Promise<DeleteResult> {
		return await this.reviewModel.deleteMany({ productId: new Types.ObjectId(productId) });
	}
}
