import { index, prop } from '@typegoose/typegoose';
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

@index({ '$**': 'text' })
export class PageModel extends TimeStamps {
	@prop({ enum: PageCategories })
	pageCategory: PageCategories;

	@prop()
	subPageCategory: string;

	@prop({ unique: true })
	alias: string;

	@prop()
	category: string;

	@prop()
	title: string;

	@prop()
	productsCategory: string;

	@prop({ _id: false })
	hh?: HHData;

	@prop({ type: () => Advantage, _id: false })
	advantages: Advantage[];

	@prop()
	seoText: string;

	@prop()
	tagsTitle: string;

	@prop({ type: () => [String] })
	tags: string[];
}
