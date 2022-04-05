enum PageCategories {
	Products,
	Services,
	Books,
	Courses,
}

export class PageModel {
	pageCategory: PageCategories;
	subPageCategory: string;
	title: string;
	productsCategory: string;
	hh?: {
		count: number;
		juniorSalary: number;
		middleSalary: number;
		seniorSalary: number;
	};
	advantages: {
		title: string;
		description: string;
	}[];
	seoText: string;
	tagsTitle: string;
	tags: string[];
}
