import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { ReviewModel } from './review.model';
import { ReviewErrorMessages } from '../errors/errors-messages';
import { AuthGuard } from '@nestjs/passport';

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
		return await this.reviewService.create(dto);
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete(':id')
	async delete(@Param('id') id: string): Promise<DocumentType<ReviewModel> | null> {
		const deletedReview = await this.reviewService.delete(id);
		if (!deletedReview) {
			throw new HttpException(ReviewErrorMessages.REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return deletedReview;
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('byProduct/:productId')
	async getByProduct(
		@Param('productId') productId: string,
	): Promise<DocumentType<ReviewModel>[]> {
		const result = await this.reviewService.findByProductId(productId);
		if (!result) {
			throw new HttpException(ReviewErrorMessages.PRODUCT_ID_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
		return result;
	}
}
