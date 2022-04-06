import { IsNumber, IsString, Min, Max, MinLength, MaxLength } from 'class-validator';
import { ReviewErrorMessages } from '../../errors/errors-messages';

export class CreateReviewDto {
	@IsString()
	@MinLength(2, {
		message: ReviewErrorMessages.AUTHOR_NAME_LONG,
	})
	@MaxLength(20, {
		message: ReviewErrorMessages.AUTHOR_NAME_LONG,
	})
	authorName: string;

	@IsString()
	title: string;

	@IsString()
	@MinLength(10, {
		message: ReviewErrorMessages.DESCRIPTION_LONG,
	})
	@MaxLength(200, {
		message: ReviewErrorMessages.DESCRIPTION_LONG,
	})
	description: string;

	@IsNumber()
	@Min(1, {
		message: ReviewErrorMessages.RATING_COUNT,
	})
	@Max(5, {
		message: ReviewErrorMessages.RATING_COUNT,
	})
	rating: number;

	@IsString()
	productId: string;
}
