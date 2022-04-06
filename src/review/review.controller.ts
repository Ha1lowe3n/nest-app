import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { ReviewModel } from './review.model';
import { ReviewErrorMessages } from 'src/errors/errors-messages';

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@Post('create')
	async create(@Body() dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
		return await this.reviewService.create(dto);
	}

	@Delete(':id')
	async delete(@Param() id: string): Promise<DocumentType<ReviewModel> | null> {
		const deletedReview = await this.reviewService.delete(id);
		if (!deletedReview) {
			throw new HttpException(ReviewErrorMessages.NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedReview;
	}

	@Get('byProduct/:productId')
	async getByProduct(@Param() productId: string): Promise<DocumentType<ReviewModel>[]> {
		return await this.reviewService.getByProductId(productId);
	}
}
