import { prop } from '@typegoose/typegoose';
import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export enum PageCategories {
	Products,
	Services,
	Books,
	Courses,
}

class HHData {
	@prop()
	count: number;

	@prop()
	juniorSalary: number;

	@prop()
	middleSalary: number;

	@prop()
	seniorSalary: number;
}
class Advantage {
	@prop()
	title: string;

	@prop()
	description: string;
}

export interface PageModel extends Base {}
export class PageModel extends TimeStamps {
	@prop({ enum: PageCategories })
	pageCategory: PageCategories;

	@prop()
	subPageCategory: string;

	@prop({ unique: true })
	alias: string;

	@prop()
	title: string;

	@prop()
	productsCategory: string;

	@prop()
	hh?: HHData;

	@prop({ type: () => Advantage })
	advantages: Advantage[];

	@prop()
	seoText: string;

	@prop()
	tagsTitle: string;

	@prop({ type: () => [String] })
	tags: string[];
}
