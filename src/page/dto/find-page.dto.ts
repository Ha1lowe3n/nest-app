import { IsEnum } from 'class-validator';
import { PageCategories } from '../page.model';

export class FindPageDto {
	@IsEnum(PageCategories)
	pageCategory: PageCategories;
}
