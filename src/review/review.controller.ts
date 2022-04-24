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
import { TelegramService } from 'src/telegram/telegram.service';

@Controller('review')
export class ReviewController {
	constructor(
		private readonly reviewService: ReviewService,
		private readonly telegramService: TelegramService,
	) {}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewDto): Promise<DocumentType<ReviewModel>> {
		return await this.reviewService.create(dto);
	}

	@UsePipes(new ValidationPipe())
	@Post('notify')
	async notify(@Body() dto: CreateReviewDto): Promise<void> {
		const message =
			`Имя: ${dto.authorName}\n` +
			`Заголовок: ${dto.title}\n` +
			`Описание: ${dto.description}\n` +
			`Рейтинг: ${dto.rating}\n` +
			`ID Продукта: ${dto.productId}`;

		return await this.telegramService.sendMessage(message);
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
