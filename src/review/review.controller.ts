import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ReviewModel } from './review.model';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewService: ReviewService) {}

	@Post('create')
	async create(@Body() dto: ReviewModel): Promise<void> {}

	@Delete(':id')
	async delete(@Param() id: string): Promise<void> {}

	@Get('byProduct/:productId')
	async getByProduct(@Param() productId: string): Promise<void> {}
}
