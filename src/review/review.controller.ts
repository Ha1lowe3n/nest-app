import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { DeleteResult } from 'mongodb';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewService } from './review.service';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { ReviewModel } from './review.model';
import { AuthGuard } from '@nestjs/passport';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

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
	async delete(
		@Param('id', IdValidationPipe) id: string,
	): Promise<DocumentType<ReviewModel> | null> {
		return await this.reviewService.delete(id);
	}

	@UseGuards(AuthGuard('jwt'))
	@Get('byProduct/:productId')
	async getByProduct(
		@Param('productId', IdValidationPipe) productId: string,
	): Promise<DocumentType<ReviewModel>[]> {
		return await this.reviewService.findByProductId(productId);
	}

	@UseGuards(AuthGuard('jwt'))
	@Delete('byProduct/:productId')
	async deleteByProduct(
		@Param('productId', IdValidationPipe) productId: string,
	): Promise<DeleteResult> {
		return await this.reviewService.deleteByProductId(productId);
	}
}
